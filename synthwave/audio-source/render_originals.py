#!/usr/bin/env python3
"""SynthWAVE.fm: 4 soundscapes instrumentais originais, sem samples de terceiros.
Saída MP3; reprodução pública somente após render e QA.
"""
from pathlib import Path
import hashlib
import subprocess
import numpy as np
from scipy.signal import lfilter
RATE=22050
SECONDS=42
OUT=Path(__file__).resolve().parent.parent/"audio"/"original"
OUT.mkdir(parents=True,exist_ok=True)
N=RATE*SECONDS
T=np.arange(N,dtype=np.float32)/RATE
DESIGNS=[
 ("foco-frequencia-clara","Foco · Frequência Clara",0,(146.83,220.0,293.66),0.12),
 ("estrada-horizonte","Estrada · Horizonte",1,(110.0,164.81,220.0),0.30),
 ("refugio-chuva-sintetica","Refúgio · Chuva Sintética",2,(130.81,196.0,261.63),0.09),
 ("depois-das-20h","Depois das 20h · Luzes Baixas",3,(98.0,146.83,196.0),0.18)
]
def build(seed,notes,beat):
 root,third,fifth=notes
 env=np.sin(np.minimum(T/2.2,1)*np.pi/2)**2
 env*=np.clip((SECONDS-T)/3.5,0,1)
 pad=np.zeros_like(T)
 for k,hz in enumerate((root,third,fifth,root*2)):
  wobble=1.0+.0015*np.sin(2*np.pi*(.07+.01*k)*T+k)
  phase=2*np.pi*hz*T*wobble
  trem=.77+.23*np.sin(2*np.pi*(.08+.012*k)*T+k)**2
  pad+=(np.sin(phase)+.16*np.sin(phase*2.01))*trem/(k+2)
 pad*=.14
 unit=1.25 if seed in (0,2) else .75
 idx=np.floor(T/unit).astype(np.int32)
 phase=np.mod(T,unit)
 seq=np.array([0,2,1,2,0,1,2,1,2,1,0,1,2,0,1,0],dtype=np.int32)
 freqs=np.array([root*2,third*2,fifth*2],dtype=np.float32)[seq[idx%len(seq)]]
 onset=np.exp(-5.1*phase)*np.minimum(phase*18,1)
 melody=.082*onset*(np.sin(2*np.pi*freqs*phase)+.12*np.sin(2*np.pi*2.003*freqs*phase))
 pulse=.06*np.sin(2*np.pi*root/2*T)*np.exp(-4*np.mod(T,unit*2))
 noise=lfilter([.012 if seed==2 else .003],[1,-(1-(.012 if seed==2 else .003))],np.random.default_rng(100+seed).normal(size=N).astype(np.float32)).astype(np.float32)
 if seed==2:
  hiss=lfilter([1,-.96],[1,-.20],np.random.default_rng(222).normal(size=N).astype(np.float32)).astype(np.float32)
  atmos=.018*np.tanh(hiss)
 else:atmos=.02*noise
 sig=(pad+melody+pulse*beat+atmos)*env
 stereo=np.stack((sig,.94*sig+.06*np.roll(sig,int(.014*RATE))),axis=1)
 peak=max(np.max(np.abs(stereo)),1e-8)
 pcm=np.asarray((stereo*min(.84/peak,3.0)).clip(-.93,.93)*32767,dtype="<i2")
 return pcm.tobytes()
def main():
 for stem,title,seed,notes,beat in DESIGNS:
  target=OUT/(stem+".mp3")
  p=subprocess.run(["ffmpeg","-hide_banner","-loglevel","error","-y","-f","s16le","-ar",str(RATE),"-ac","2","-i","pipe:0","-c:a","libmp3lame","-b:a","96k","-metadata","artist=SynthWAVE.fm Original Audio","-metadata","title="+title,"-metadata","comment=Original procedural audio, 2026",str(target)],input=build(seed,notes,beat),capture_output=True)
  if p.returncode:raise RuntimeError(p.stderr.decode())
  if target.stat().st_size<20000:raise RuntimeError("Audio muito pequeno")
  print(target.name,target.stat().st_size,hashlib.sha256(target.read_bytes()).hexdigest())
if __name__=="__main__":main()
