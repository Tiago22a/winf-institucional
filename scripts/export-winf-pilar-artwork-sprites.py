#!/usr/bin/env python3
"""Exporta APENAS PNGs renderizados — fontes oficiais não saem do ambiente de build."""
from pathlib import Path
import sys, io, json, zipfile
from PIL import Image,ImageDraw,ImageFont
import importlib.util
ROOT=Path(__file__).resolve().parents[1]
sys.path.insert(0,str(ROOT/"scripts"))
spec=importlib.util.spec_from_file_location("brand_baseline",str(ROOT/"scripts/build-winf-pilar-brand.py"))
mod=importlib.util.module_from_spec(spec)
spec.loader.exec_module(mod)
DEST=ROOT/"build"/"pilar_brand_sprites"
DEST.mkdir(parents=True,exist_ok=True)
def font(key,size):
 return ImageFont.truetype(str(ROOT/"fonts"/f"gustavo-{key}.otf"),size)
def fallback(size):return ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf",size)
def custom(draw,s,xy,f,color,spacing=0):
 x,y=xy
 for c in s:
  ft=fallback(f.size) if c in "™/+•" else f
  draw.text((round(x),round(y)),c,font=ft,fill=color,anchor="lt")
  x+=draw.textlength(c,font=ft)+spacing
 return x
def file(name,im):
 path=DEST/name
 im.save(path,optimize=True)
 return path
out=[]
for ink,fill in [("DARK","#161c24"),("LIGHT","#f9f9fa")]:
 # Composição vetorial WINF: parte original sem detalhe circular, Ghost original substituindo o detalhe;
 # ™ desenhado uma vez no canto alto do F. Não compor letras WINF com fonte.
 w,h=850,520
 im=Image.new("RGBA",(w,h),(0,0,0,0))
 word=mod.official_winf("dark" if ink=="DARK" else "light",680)
 im.alpha_composite(word,(25,30))
 ghost=mod.ghost_symbol(62,"dark" if ink=="DARK" else "light")
 im.alpha_composite(ghost,(round(25+680*.825),round(30+word.height*.66)))
 d=ImageDraw.Draw(im)
 # ™ Unicode, não "TM" digitado; âncora superior fixa e folga generosa.
 tmfont=fallback(39)
 d.text((644,37),"™",font=tmfont,fill=fill,anchor="lt")
 custom(d,"SELECT",(40,275),font("light",105),fill,spacing=14)
 custom(d,"GLASS",(41,421),font("medium",28),fill,spacing=7)
 # Sinal + vetorial para evitar glyph ausente no Gustavo
 d.line((243,440,261,440),fill=fill,width=3)
 d.line((252,431,252,449),fill=fill,width=3)
 custom(d,"HOME",(287,421),font("medium",28),fill,spacing=7)
 path=file(f"LOCKUP_WINFIN_SELECT_PILAR_{ink}_TM_CORRIGIDO.png",im)
 out.append(path)
 # Tipos auxiliares renderizados com Gustavo do repositório, caracteres de separação como fallback.
 texts=[
  ("LOCAL","PILAR DO SUL / SP","medium",42,2.1),
  ("HEAD_01","SOL FORTE.","light",76,0.1),
  ("HEAD_02","CONFORTO SOB CONTROLE.","light",68,-0.65),
  ("SUB","Controle solar para seus espaços.","regular",37,0),
  ("SERVICES","ARQUITETURA / AUTOMOTIVO / PPF","medium",31,1.4),
  ("PROFILE_TAG","ARQUITETURA • AUTOMOTIVO","regular",32,0.5),
 ]
 for id,text,wt,size,spacing in texts:
  tmp=Image.new("RGBA",(1580,120),(0,0,0,0))
  dd=ImageDraw.Draw(tmp)
  end=custom(dd,text,(6,6),font(wt,size),fill,spacing)
  cropped=tmp.crop((0,0,min(1580,max(30,round(end+20))),120))
  path=file(f"TXT_{id}_{ink}.png",cropped);out.append(path)
zip_path=ROOT/"build"/"WINF_PILAR_SPRITES_OFICIAIS_SEM_FONTES.zip"
with zipfile.ZipFile(zip_path,"w",zipfile.ZIP_DEFLATED) as z:
 for p in out:z.write(p,arcname=p.name)
 z.writestr("ORIGEM.json",json.dumps({"logo":"winf-logo.svg vetorizado", "ghost":"aerocore/assets/ghost-symbol.png", "typefaces":["Gustavo Light","Gustavo Regular","Gustavo Medium"],"city":"Pilar do Sul/SP","files":len(out),"fonts_included":False},ensure_ascii=False))
print("✓ sprites:",len(out),"ZIP:",zip_path,zip_path.stat().st_size)
