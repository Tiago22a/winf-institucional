#!/usr/bin/env python3
"""Optimize media referenced by the homepage and AeroCore pages.

Requirements:
  - ffmpeg
  - ImageMagick (magick or convert)

Usage:
  python scripts/optimize_media.py
  python scripts/optimize_media.py --dry-run

Only replaces files when the optimized output is at least 5% smaller.
Existing paths/URLs are preserved so no HTML references need to change.
"""
from __future__ import annotations

import argparse
import re
import shutil
import subprocess
import tempfile
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
MEDIA_RE = re.compile(r'(?:src|data-src|poster)=["\']([^"\']+\.(?:mp4|png|jpe?g|webp))["\']', re.I)
MIN_VIDEO = 1_000_000
MIN_IMAGE = 150_000
MIN_SAVING = 0.05


def tool(*names: str) -> str | None:
    for name in names:
        found = shutil.which(name)
        if found:
            return found
    return None


def referenced_media() -> list[Path]:
    html_files = [ROOT / "index.html"]
    aero = ROOT / "aerocore"
    if aero.exists():
        html_files.extend(aero.rglob("index.html"))

    found: set[Path] = set()
    for html in html_files:
        if not html.exists():
            continue
        text = html.read_text(encoding="utf-8", errors="ignore")
        for raw in MEDIA_RE.findall(text):
            if raw.startswith(("http://", "https://", "//", "data:")):
                continue
            clean = raw.split("?", 1)[0].split("#", 1)[0]
            path = (ROOT / clean.lstrip("/")) if clean.startswith("/") else (html.parent / clean)
            try:
                path = path.resolve()
                path.relative_to(ROOT)
            except ValueError:
                continue
            if path.exists() and path.is_file():
                found.add(path)
    return sorted(found)


def run(cmd: list[str]) -> None:
    subprocess.run(cmd, check=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)


def maybe_replace(src: Path, out: Path, dry_run: bool) -> tuple[bool, int, int]:
    before = src.stat().st_size
    after = out.stat().st_size if out.exists() else before
    worthwhile = after < before * (1 - MIN_SAVING)
    if worthwhile and not dry_run:
        out.replace(src)
    elif out.exists():
        out.unlink()
    return worthwhile, before, after


def optimize_video(src: Path, ffmpeg: str, dry_run: bool) -> tuple[bool, int, int]:
    before = src.stat().st_size
    if before < MIN_VIDEO:
        return False, before, before
    with tempfile.NamedTemporaryFile(suffix=".mp4", dir=src.parent, delete=False) as tmp:
        out = Path(tmp.name)
    try:
        run([
            ffmpeg, "-y", "-i", str(src),
            "-map_metadata", "-1",
            "-an",
            "-c:v", "libx264",
            "-preset", "medium",
            "-crf", "25",
            "-pix_fmt", "yuv420p",
            "-movflags", "+faststart",
            str(out),
        ])
        return maybe_replace(src, out, dry_run)
    finally:
        if out.exists():
            out.unlink(missing_ok=True)


def optimize_image(src: Path, magick: str, dry_run: bool) -> tuple[bool, int, int]:
    before = src.stat().st_size
    if before < MIN_IMAGE:
        return False, before, before
    suffix = src.suffix.lower()
    with tempfile.NamedTemporaryFile(suffix=suffix, dir=src.parent, delete=False) as tmp:
        out = Path(tmp.name)
    try:
        if suffix == ".png":
            run([magick, str(src), "-strip",
                 "-define", "png:compression-level=9",
                 "-define", "png:compression-strategy=1",
                 str(out)])
        elif suffix in {".jpg", ".jpeg"}:
            run([magick, str(src), "-strip", "-interlace", "Plane", "-quality", "86", str(out)])
        elif suffix == ".webp":
            run([magick, str(src), "-strip", "-quality", "82", str(out)])
        else:
            return False, before, before
        return maybe_replace(src, out, dry_run)
    finally:
        if out.exists():
            out.unlink(missing_ok=True)


def fmt(n: int) -> str:
    return f"{n / 1024 / 1024:.2f} MB"


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--dry-run", action="store_true")
    args = parser.parse_args()

    ffmpeg = tool("ffmpeg")
    magick = tool("magick", "convert")
    media = referenced_media()

    print(f"Found {len(media)} referenced media files.")
    saved = 0
    for src in media:
        rel = src.relative_to(ROOT)
        try:
            if src.suffix.lower() == ".mp4":
                if not ffmpeg:
                    print(f"SKIP {rel}: ffmpeg not found")
                    continue
                changed, before, after = optimize_video(src, ffmpeg, args.dry_run)
            else:
                if not magick:
                    print(f"SKIP {rel}: ImageMagick not found")
                    continue
                changed, before, after = optimize_image(src, magick, args.dry_run)
        except subprocess.CalledProcessError:
            print(f"ERROR {rel}: optimizer failed; original preserved")
            continue

        if changed:
            saved += before - after
            action = "WOULD OPTIMIZE" if args.dry_run else "OPTIMIZED"
            print(f"{action} {rel}: {fmt(before)} -> {fmt(after)}")
        else:
            print(f"KEEP {rel}: already efficient ({fmt(before)})")

    print(f"Potential/actual saving: {fmt(saved)}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
