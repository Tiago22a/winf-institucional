#!/usr/bin/env python3
"""SynthWAVE.fm — produzir prévias integrais de episódios com duas vozes TTS.
Lê os roteiros CANÔNICOS; não inventa novas falas nem publica no catálogo.
Modelos: Piper pt_BR-cadu-medium (LIA) e pt_BR-faber-medium (DAVI).
Trilha: tons sintetizados locais via ffmpeg; nenhum fonograma externo usado.
"""
from __future__ import annotations
import argparse
import io
import json
from pathlib import Path
import re
import subprocess
import tempfile
import wave
from array import array
from math import ceil

ROOT = Path(__file__).resolve().parent.parent
SCRIPTS = {
    "ep01-cuidar-conectar": ROOT / "podcasts/temporada-01/ep01-cuidar-conectar.md",
    "ep02-padrinho": ROOT / "podcasts/temporada-01/ep02-padrinho.md",
    "ep03-invisivel": ROOT / "podcasts/temporada-01/ep03-invisivel.md",
}
CUTOFF = re.compile(r"^## (?:Produção|Checklist antes de publicar|Revisão antes de áudio|Revisão antes de áudio|Fontes e pontos)", re.I)
TURN = re.compile(r"^\*\*(LIA|DAVI|JUNTOS[^*]*):\*\*\s*(.+)$", re.I)


def lines(path: Path):
    if not path.is_file():
        raise FileNotFoundError(path)
    turns = []
    for raw in path.read_text(encoding="utf-8").splitlines():
        if CUTOFF.match(raw):
            break
        m = TURN.match(raw.strip())
        if not m:
            continue
        speaker = "LIA" if m.group(1).upper().startswith("LIA") else "DAVI"
        text = re.sub(r"\*([^*]+)\*", r"\1", m.group(2)).strip()
        if not text:
            continue
        turns.append((speaker, text))
    if len(turns) < 15 or not any(s == "LIA" for s, _ in turns) or not any(s == "DAVI" for s, _ in turns):
        raise ValueError(f"Roteiro sem falas suficientes: {path}")
    return turns


def make_voice(onnx_file: Path):
    from piper import PiperVoice
    return PiperVoice.load(str(onnx_file))


def render_one(key: str, voices: dict, output: Path):
    turns = lines(SCRIPTS[key])
    output.mkdir(parents=True, exist_ok=True)
    wav_path = output / (key + "-vozes-temporario.wav")
    sample_rate = None
    frames_total = 0
    with wave.open(str(wav_path), "wb") as assembled:
        for index, (speaker, text) in enumerate(turns):
            buffer = io.BytesIO()
            with wave.open(buffer, "wb") as part:
                voices[speaker].synthesize_wav(text, part)
            buffer.seek(0)
            with wave.open(buffer, "rb") as chunk:
                if sample_rate is None:
                    sample_rate = chunk.getframerate()
                    assembled.setnchannels(1)
                    assembled.setsampwidth(2)
                    assembled.setframerate(sample_rate)
                    assembled.writeframes(b"\0\0" * int(sample_rate * 0.7))
                if chunk.getnchannels() != 1 or chunk.getsampwidth() != 2 or chunk.getframerate() != sample_rate:
                    raise ValueError("Modelos de voz têm formatos PCM diferentes")
                audio = chunk.readframes(chunk.getnframes())
            # Identidade vocal de LIA: inflexão sintética ligeiramente elevada (sem personificar ninguém).
            # Sem alteração no arquivo/modelo de origem; apenas processamento do sinal gerado.
            if speaker == "LIA":
                # LIA: brilho/pitch ligeiramente maior, sem emular uma voz humana real.
                pcm = array("h")
                pcm.frombytes(audio)
                ratio = 1.13
                stretched = array("h")
                for n in range(int(len(pcm) / ratio)):
                    pos = n * ratio
                    left = int(pos)
                    fract = pos - left
                    right = min(left + 1, len(pcm) - 1)
                    stretched.append(int(pcm[left] * (1 - fract) + pcm[right] * fract))
                audio = stretched.tobytes()
            assembled.writeframes(audio)
            frames_total += len(audio) // 2
            pause = 0.23 if text.rstrip().endswith("?") else 0.30
            if index and index % 16 == 0:
                pause += 0.65
            assembled.writeframes(b"\0\0" * int(sample_rate * pause))
            frames_total += int(sample_rate * pause)
    mp3_path = output / (key + "-previa.mp3")
    # Paisagem musical gerada matematicamente: não incorpora obras protegidas.
    # O volume é propositalmente baixo para manter a inteligibilidade.
    bed = (
        "aevalsrc=0.006*sin(2*PI*110*t)+0.0035*sin(2*PI*164.81*t)"
        "+0.0025*sin(2*PI*220*t):s=22050"
    )
    cmd = [
        "ffmpeg", "-hide_banner", "-loglevel", "error", "-y",
        "-i", str(wav_path), "-f", "lavfi", "-i", bed,
        "-filter_complex",
        "[1:a]afade=t=in:st=0:d=2[bed];"
        "[0:a][bed]amix=inputs=2:duration=first:normalize=0,"
        "alimiter=limit=0.92[a]",
        "-map", "[a]", "-ar", "44100", "-ac", "2",
        "-codec:a", "libmp3lame", "-b:a", "112k", str(mp3_path),
    ]
    subprocess.run(cmd, check=True)
    wav_path.unlink(missing_ok=True)
    with open(output / (key + "-manifest.json"), "w", encoding="utf-8") as fp:
        json.dump({
            "episodeId": key,
            "status": "audio_preview_unreviewed",
            "speakers": ["LIA", "DAVI"],
            "speechEngine": "Piper TTS",
            "ttsModels": {"LIA": "pt_BR-cadu-medium", "DAVI": "pt_BR-faber-medium"},
            "soundtrack": "original_synthesized_ambient",
            "spokenTurns": len(turns),
            "durationSecondsApprox": round(frames_total / sample_rate, 2),
            "sourceScript": str(SCRIPTS[key].relative_to(ROOT)),
            "publicCatalogStatusUnchanged": True,
        }, fp, indent=2, ensure_ascii=False)
    print(f"{key}: {len(turns)} falas, ~{frames_total/sample_rate:.0f}s, {mp3_path.stat().st_size} bytes")


def main():
    cli = argparse.ArgumentParser()
    cli.add_argument("--validate-only", action="store_true")
    cli.add_argument("--models-dir", type=Path, default=Path("."))
    cli.add_argument("--output-dir", type=Path, default=ROOT / "podcasts/audio-previews")
    opts = cli.parse_args()
    for key, path in SCRIPTS.items():
        turns = lines(path)
        print(f"{key}: {len(turns)} falas válidas; LIA={sum(s=='LIA' for s,_ in turns)}, DAVI={sum(s=='DAVI' for s,_ in turns)}")
    if opts.validate_only:
        return
    paths = {
        "LIA": opts.models_dir / "pt_BR-cadu-medium.onnx",
        "DAVI": opts.models_dir / "pt_BR-faber-medium.onnx",
    }
    for key, path in paths.items():
        if not path.is_file():
            raise FileNotFoundError(f"Modelo de {key} ausente: {path}")
    voices = {k: make_voice(path) for k, path in paths.items()}
    for key in SCRIPTS:
        render_one(key, voices, opts.output_dir)


if __name__ == "__main__":
    main()
