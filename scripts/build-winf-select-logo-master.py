#!/usr/bin/env python3
"""WINF SELECT™ / logomarca mestra com ™ em contornos (sem fontes anexadas).

Winf = vetor oficial winf-logo.svg, retirando SOMENTE o ornamento/círculo
substituído pelo Ghost em unidades automotivas. Ghost = imagem oficial do site.
SELECT e GLASS/HOME = contornos das fontes Gustavo do próprio projeto.
O caractere ™ é contornado separadamente, sem clipping ou "rabinho".
"""
from pathlib import Path
from xml.etree import ElementTree as ET
from fontTools.ttLib import TTFont
from fontTools.pens.svgPathPen import SVGPathPen
from PIL import Image, ImageOps
import cairosvg, io, base64, zipfile, json

ROOT=Path(__file__).resolve().parents[1]
OUT=ROOT/"build"/"WINF_SELECT_LOGO_MESTRA_TM"
OUT.mkdir(parents=True,exist_ok=True)
SVG=ROOT/"winf-logo.svg"
GHOST=ROOT/"aerocore/assets/ghost-symbol.png"
GUSTAVO_LIGHT=ROOT/"fonts/gustavo-light.otf"
GUSTAVO_MEDIUM=ROOT/"fonts/gustavo-medium.otf"
TM_FONT=Path("/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf")
WIDTH,HEIGHT=1200,720
ALL=[SVG,GHOST,GUSTAVO_LIGHT,GUSTAVO_MEDIUM,TM_FONT]
for p in ALL:
 if not p.is_file():raise FileNotFoundError(p)

source=ET.parse(SVG).getroot()
full_path=next(el.attrib["d"] for el in source.iter() if el.tag.endswith("path"))
# M97.5 = início da letra F do logotipo oficial. Tudo a partir dali inclui
# as letras originais completas W, I, N e F; ornamentos ficam fora.
marker=" M97.5 1.33"
assert marker in full_path,"Caminho do logotipo oficial alterado. Interromper em vez de deformar."
official_letters=full_path[full_path.index(marker)+1:]
assert "M1.17 3.5" in official_letters and "M45.17 1.17" in official_letters

def outlined(text,font_path,x,y,target_width,tracking,fill):
 """Converte os glifos exatos do arquivo OTF/TTF em paths SVG, sem depender da fonte no destino."""
 font=TTFont(str(font_path))
 cmap=font.getBestCmap()
 glyphs=font.getGlyphSet()
 em=font["head"].unitsPerEm
 names=[]
 for ch in text:
  name=cmap.get(ord(ch))
  if not name:raise ValueError(f"Glifo ausente em {font_path.name}: U+{ord(ch):04X}")
  names.append(name)
 total=sum(font["hmtx"][name][0] for name in names)
 scale=(target_width-tracking*(len(text)-1))/total
 pos=float(x);tags=[]
 for i,(ch,name) in enumerate(zip(text,names)):
  pen=SVGPathPen(glyphs)
  glyphs[name].draw(pen)
  d=pen.getCommands()
  if d:tags.append(f'<path d="{d}" transform="translate({pos:.5f},{y:.5f}) scale({scale:.8f},-{scale:.8f})" fill="{fill}"/>')
  pos+=font["hmtx"][name][0]*scale+tracking
 return "".join(tags),scale*em

def ghost_data(ink):
 original=Image.open(GHOST).convert("RGBA")
 alpha=original.getchannel("A")
 if alpha.getextrema()[0]==255:
  gray=ImageOps.grayscale(original.convert("RGB"))
  corners=[gray.getpixel(p) for p in [(0,0),(gray.width-1,0),(0,gray.height-1),(gray.width-1,gray.height-1)]]
  alpha=ImageOps.invert(gray) if sum(corners)/4>127 else gray
  alpha=alpha.point(lambda v:0 if v<45 else min(255,round((v-45)*255/150)))
 box=alpha.getbbox()
 if not box:raise RuntimeError("Ghost oficial sem máscara legível")
 alpha=alpha.crop(box)
 height=76
 width=max(1,round(alpha.width/alpha.height*height))
 alpha=alpha.resize((width,height),Image.Resampling.LANCZOS)
 img=Image.new("RGBA",(width,height),(255,255,255,255) if ink=="white" else (25,31,36,255))
 img.putalpha(alpha)
 buf=io.BytesIO();img.save(buf,"PNG")
 return base64.b64encode(buf.getvalue()).decode(),width,height

def create(ink):
 color="#FFFFFF" if ink=="white" else "#151B20"
 brand=f'<path d="{official_letters}" transform="translate(141,62) scale(8.65)" fill="{color}" fill-rule="evenodd"/>'
 g,w,h=ghost_data(ink)
 ghost=f'<image x="908" y="283" width="{w}" height="{h}" href="data:image/png;base64,{g}"/>'
 # ™ vetorizado, proporcional e acima da haste do F, em coordenadas fixas.
 tm,_=outlined("™",TM_FONT,1026,130,39,0,color)
 select,_=outlined("SELECT",GUSTAVO_LIGHT,164,532,875,13,color)
 glass,_=outlined("GLASS",GUSTAVO_MEDIUM,290,632,240,7,color)
 home,_=outlined("HOME",GUSTAVO_MEDIUM,676,632,242,7,color)
 plus=f'<path d="M601 584V610 M588 597H614" stroke="{color}" stroke-width="3.4" fill="none" stroke-linecap="square"/>'
 data=f'''<svg xmlns="http://www.w3.org/2000/svg" width="{WIDTH}" height="{HEIGHT}" viewBox="0 0 {WIDTH} {HEIGHT}" role="img" aria-label="WINF Select Glass + Home, logomarca oficial com trademark">
<title>WINF Select™ / Glass + Home — marca oficial</title>{brand}{tm}{ghost}{select}{glass}{plus}{home}</svg>'''
 svg=OUT/f"WINF_SELECT_LOGO_MESTRA_{ink.upper()}_TM_CORRETO.svg"
 svg.write_text(data,encoding="utf-8")
 png=OUT/f"WINF_SELECT_LOGO_MESTRA_{ink.upper()}_TM_CORRETO_2400.png"
 cairosvg.svg2png(bytestring=data.encode("utf-8"),write_to=str(png),output_width=2400,output_height=1440)
 im=Image.open(png)
 assert im.size==(2400,1440) and im.mode=="RGBA"
 assert im.getbbox() is not None
 assert "™" not in im.info # print is outlined, not rendered by app font
 return svg,png

files=list(create("black"))+list(create("white"))
manifest=OUT/"INFORMACOES_IDENTIDADE.json"
manifest.write_text(json.dumps({
 "brand":"WINF Select™",
 "official_logo_source":"winf-logo.svg",
 "official_ghost_source":"aerocore/assets/ghost-symbol.png",
 "official_fonts":["fonts/gustavo-light.otf","fonts/gustavo-medium.otf"],
 "trademark":"símbolo ™ vetorizado à direita superior do F, sem clipping",
 "note":"Arquivos finais não contêm nem redistribuem fontes. A letra WINF provém do vetor do site e não foi redesenhada.",
 "master_colors":["BLACK","WHITE"],
 "files":[p.name for p in files]},ensure_ascii=False,indent=2),encoding="utf-8")
archive=ROOT/"build"/"WINF_SELECT_LOGOMARCA_TM_CORRIGIDO.zip"
with zipfile.ZipFile(archive,"w",zipfile.ZIP_DEFLATED,compresslevel=6) as zipf:
 for p in [*files,manifest]:zipf.write(p,p.name)
print("VALIDAÇÃO APROVADA. Marca mestra: ")
for p in [*files,archive]:print(p,round(p.stat().st_size/1024,1),"KiB")
