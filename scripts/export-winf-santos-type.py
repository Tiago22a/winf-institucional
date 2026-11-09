#!/usr/bin/env python3
"""Exporta somente textos WINF Select Santos como imagens transparentes.
Cada glifo alfabético vem diretamente da família Gustavo usada no site.
Não exporta arquivos de fontes.
"""
from pathlib import Path
from PIL import Image,ImageDraw,ImageFont,PngImagePlugin
import json,zipfile
ROOT=Path(__file__).resolve().parents[1]
OUT=ROOT/"build"/"santos_official_text"
OUT.mkdir(parents=True,exist_ok=True)
def F(kind,size):return ImageFont.truetype(str(ROOT/"fonts"/f"gustavo-{kind}.otf"),size)
FALLBACK="/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf"
def render(name,text,weight,size,spacing):
 im=Image.new("RGBA",(2500,220),(0,0,0,0))
 d=ImageDraw.Draw(im)
 x,y=8,15
 for char in text:
  font=ImageFont.truetype(FALLBACK,size) if char in "/+•—" else F(weight,size)
  d.text((round(x),y),char,font=font,fill="#FFFFFF",anchor="lt")
  x+=d.textlength(char,font=font)+spacing
 bbox=im.getbbox()
 if bbox is None:raise RuntimeError("empty output "+name)
 im=im.crop((0,0,min(2500,bbox[2]+15),min(220,bbox[3]+12)))
 info=PngImagePlugin.PngInfo()
 info.add_text("Brand","WINF Select™")
 info.add_text("Territory","Santos/SP")
 info.add_text("FontSource",f"fonts/gustavo-{weight}.otf")
 info.add_text("Role",name)
 p=OUT/(name+".png")
 im.save(p,pnginfo=info,optimize=True)
 return p
files=[
 render("SANTOS_SP", "SANTOS / SP", "medium", 62,2),
 render("CONFORTO", "SOL FORTE. CONFORTO SOB CONTROLE.", "light", 50,0),
 render("ARQUITETURA", "ARQUITETURA / GLASS + HOME", "regular", 36,1),
 render("CONTROLE_SOLAR", "CONTROLE SOLAR PARA SEUS ESPACOS.", "regular", 33,0),
]
archive=ROOT/"build"/"WINF_SELECT_SANTOS_TIPOGRAFIA_OFICIAL_RENDERIZADA.zip"
with zipfile.ZipFile(archive,'w',zipfile.ZIP_DEFLATED) as z:
 for p in files:z.write(p,p.name)
 z.writestr("NOTAS.json",json.dumps({"city":"Santos/SP","brand":"WINF Select","font_family":"Gustavo oficial em fonts/ do repositorio WINF","files":[p.name for p in files]},ensure_ascii=False))
print("OK",archive,archive.stat().st_size)
