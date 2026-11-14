#!/usr/bin/env python3
"""SynthWAVE: 18 prévias sonoras originais com LIA e DAVI (Piper TTS).
A prévia não equivale a podcast final homologado; não altera catálogo para published.
Áudio e cama musical são sintetizados, sem amostras de fonogramas de terceiros.
"""
from __future__ import annotations

import argparse
from array import array
import hashlib
import io
import json
from math import ceil
from pathlib import Path
import subprocess
import tempfile
import wave

ROOT = Path(__file__).resolve().parent.parent
PREVIEWS = ROOT / "experiencias/audio-previews"

def catalog_from(path: Path) -> list[dict]:
    j = json.loads(path.read_text(encoding="utf-8"))
    if j.get("version") != 1 or j.get("status") != "preview_source_only":
        raise ValueError("Catálogo de roteiros inválido")
    stories = j.get("stories", [])
    if len(stories) != 18:
        raise ValueError(f"Esperados 18 roteiros, encontrados {len(stories)}")
    seen = set()
    for story in stories:
        sid = story["id"]
        if sid in seen or not sid.replace("-", "").isalnum():
            raise ValueError(f"ID duplicado ou inválido: {sid}")
        seen.add(sid)
        turns = story.get("turns", [])
        if len(turns) < 15 or {t["speaker"] for t in turns} != {"LIA", "DAVI"}:
            raise ValueError(f"Roteiro sem falas válidas: {sid}")
    return stories

def make_voice(onnx_path: Path):
    from piper import PiperVoice
    return PiperVoice.load(str(onnx_path))

def brighten_lia(raw: bytes) -> bytes:
    """Leve contraste de personagem por interpolação; não imita voz de pessoa real."""
    pcm = array("h")
    pcm.frombytes(raw)
    if not pcm:
        return raw
    ratio = 1.11
    shorter = array("h")
    for index in range(int(len(pcm) / ratio)):
        position = index * ratio
        left = int(position)
        fraction = position - left
        right = min(left + 1, len(pcm) - 1)
        shorter.append(int(pcm[left] * (1 - fraction) + pcm[right] * fraction))
    return shorter.tobytes()

def synthesize_story(story: dict, voices: dict, output: Path) -> None:
    sid = story["id"]
    output.mkdir(parents=True, exist_ok=True)
    with tempfile.TemporaryDirectory(prefix="synthwave-") as temp:
        wav = Path(temp) / (sid + ".wav")
        rate = None
        samples = 0
        with wave.open(str(wav), "wb") as final:
            for index, turn in enumerate(story["turns"]):
                buffer = io.BytesIO()
                with wave.open(buffer, "wb") as utterance:
                    voices[turn["speaker"]].synthesize_wav(turn["text"], utterance)
                buffer.seek(0)
                with wave.open(buffer, "rb") as chunk:
                    if rate is None:
                        rate = chunk.getframerate()
                        final.setnchannels(1)
                        final.setsampwidth(2)
                        final.setframerate(rate)
                        lead = int(rate * 0.7)
                        final.writeframes(b"\x00\x00" * lead)
                        samples += lead
                    if chunk.getnchannels() != 1 or chunk.getsampwidth() != 2 or chunk.getframerate() != rate:
                        raise ValueError("Amostragem PCM incompatível entre modelos")
                    raw = chunk.readframes(chunk.getnframes())
                if turn["speaker"] == "LIA":
                    raw = brighten_lia(raw)
                final.writeframes(raw)
                samples += len(raw) // 2
                pause = 0.24 if turn["text"].rstrip().endswith("?") else 0.30
                if index and index % 15 == 0:
                    pause += 0.50
                count = int(rate * pause)
                final.writeframes(b"\x00\x00" * count)
                samples += count
        if not rate or samples < rate * 40:
            raise ValueError(f"Prévia curta ou vazia: {sid}")
        mp3 = output / f"{sid}-previa.mp3"
        # Cama musical discreta, totalmente procedimental e original, sem loops de obras existentes.
        bed = (
            "aevalsrc=0.004*sin(2*PI*110*t)+"
            "0.0025*sin(2*PI*164.81*t)+"
            "0.0018*sin(2*PI*220*t):s=22050"
        )
        command = [
            "ffmpeg", "-y", "-hide_banner", "-loglevel", "error",
            "-i", str(wav), "-f", "lavfi", "-i", bed,
            "-filter_complex",
            "[1:a]afade=t=in:st=0:d=2[bed];"
            "[0:a][bed]amix=inputs=2:duration=first:normalize=0,"
            "alimiter=limit=0.92[a]",
            "-map", "[a]", "-ar", "44100", "-ac", "2",
            "-codec:a", "libmp3lame", "-b:a", "80k",
            "-metadata", "artist=SynthWAVE.fm | LIA e DAVI (vozes sinteticas)",
            "-metadata", f"title={story['title']}",
            "-id3v2_version", "3", str(mp3),
        ]
        subprocess.run(command, check=True, timeout=360)
        if mp3.stat().st_size < 60000:
            raise ValueError(f"MP3 insuficiente: {sid}")
        subprocess.run([
            "ffprobe", "-v", "error", "-show_entries", "format=duration",
            "-of", "default=noprint_wrappers=1:nokey=1", str(mp3)
        ], check=True, stdout=subprocess.PIPE, text=True, timeout=20)
        digest = hashlib.sha256(mp3.read_bytes()).hexdigest()
        manifest = {
            "experienceId": sid,
            "title": story["title"],
            "status": "audio_preview_unreviewed",
            "speakers": ["LIA", "DAVI"],
            "speechEngine": "Piper TTS",
            "ttsModels": {"LIA": "pt_BR-cadu-medium", "DAVI": "pt_BR-faber-medium"},
            "soundtrack": "original_synthesized_ambient",
            "spokenTurns": len(story["turns"]),
            "durationSecondsApprox": round(samples / rate, 2),
            "sourceScripts": "synthwave/experiencias/volume-01/ e synthwave/experiencias/capsulas/",
            "rightsReviewRequired": True,
            "finalPublicationApproved": False,
            "sha256": digest,
        }
        (output / f"{sid}-manifest.json").write_text(
            json.dumps(manifest, indent=2, ensure_ascii=False) + "\n", encoding="utf-8"
        )
        print(f"{sid}: {len(story['turns'])} falas, ~{samples/rate:.1f}s, {mp3.stat().st_size} bytes", flush=True)

def main():
    cli = argparse.ArgumentParser()
    cli.add_argument("--catalog", type=Path, required=True)
    cli.add_argument("--models-dir", type=Path, default=Path("models"))
    cli.add_argument("--output-dir", type=Path, default=PREVIEWS)
    cli.add_argument("--validate-only", action="store_true")
    args = cli.parse_args()
    stories = catalog_from(args.catalog)
    for story in stories:
        print(f"{story['id']}: {len(story['turns'])} falas", flush=True)
    if args.validate_only:
        return
    paths = {
        "LIA": args.models_dir / "pt_BR-cadu-medium.onnx",
        "DAVI": args.models_dir / "pt_BR-faber-medium.onnx",
    }
    for name, path in paths.items():
        if not path.is_file():
            raise FileNotFoundError(f"Modelo {name} não encontrado: {path}")
    voices = {name: make_voice(path) for name, path in paths.items()}
    for story in stories:
        synthesize_story(story, voices, args.output_dir)

if __name__ == "__main__":
    main()
