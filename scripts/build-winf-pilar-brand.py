#!/usr/bin/env python3
"""WINF Select™ / Pilar do Sul — produção original com os ativos do site.
Fontes: fonts/gustavo-{light,regular,medium}.otf (usadas no site WINF Select).
Logotipo: winf-logo.svg (vetor oficial); Ghost: aerocore/assets/ghost-symbol.png.
Saída: 3 capas WhatsApp, 3 capas Facebook e 1 perfil; sem prévia falsa de aplicativo.
"""
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont, ImageOps, ImageEnhance, ImageFilter, PngImagePlugin
import io, json, zipfile, re, hashlib
import cairosvg

ROOT=Path(__file__).resolve().parents[1]
OUT=ROOT/"build"/"WINF_Select_Pilar_do_Sul_Identidade_Oficial"
OUT.mkdir(parents=True,exist_ok=True)
CITY="Pilar do Sul"
STATE="SP"
VERSION="2026-11-09"
LOGO=ROOT/"winf-logo.svg"
GHOST=ROOT/"aerocore/assets/ghost-symbol.png"
FONTS={
 "light":ROOT/"fonts/gustavo-light.otf",
 "regular":ROOT/"fonts/gustavo-regular.otf",
 "medium":ROOT/"fonts/gustavo-medium.otf",
 "inter":ROOT/"fonts/gustavo-regular.otf",
}
PHOTOS=[
 ROOT/"images/dualreflect-poster-2.webp",
 ROOT/"images/invisible-poster-1.webp",
 ROOT/"images/blackpro-poster-2.webp",
]
CONCEPTS=[
 {"id":1,"slug":"sol_conforto","line1":"SOL FORTE.","line2":"CONFORTO SOB CONTROLE.","sub":"Controle solar para seus espaços.","theme":"graphite"},
 {"id":2,"slug":"privacidade","line1":"MAIS PRIVACIDADE.","line2":"SEM PERDER A LUZ.","sub":"Discrição com estética arquitetônica.","theme":"light"},
 {"id":3,"slug":"arquitetura_carros","line1":"SUA CASA. SEU CARRO.","line2":"IDENTIDADE E PROTECAO.","sub":"Arquitetura • Automotivo • PPF","theme":"graphite"},
]

def sha(p):
 return hashlib.sha256(p.read_bytes()).hexdigest()

def F(kind,size): return ImageFont.truetype(str(FONTS[kind]),size)

def label(draw,text,xy,font,fill,spacing=0):
 x,y=xy
 for letter in text:
  draw.text((x,y),letter,font=font,fill=fill)
  x+=draw.textlength(letter,font=font)+spacing
 return x

def letter_width(draw,text,font,spacing=0):
 return sum(draw.textlength(ch,font=font) for ch in text)+max(0,len(text)-1)*spacing

def official_winf(ink,width=300):
 # Retira somente o detalhe circular original, para posicionar o Ghost OFICIAL.
 source=LOGO.read_text(encoding="utf-8")
 path=re.search(r'<path\b[^>]*\bd="([^"]+)"',source).group(1)
 split=path.find(" M105.33")
 assert split>0,"O vetor WINF oficial mudou; revisar recorte antes de gerar."
 path_without_circle=path[split+1:]
 fill="white" if ink=="light" else "#151b20"
 svg=f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 109 36" width="109" height="36"><path d="{path_without_circle}" fill="{fill}" fill-rule="evenodd"/></svg>'
 png=cairosvg.svg2png(bytestring=svg.encode("utf-8"),output_width=width,output_height=round(width*36/109))
 return Image.open(io.BytesIO(png)).convert("RGBA")

def ghost_symbol(height=60,ink="light"):
 original=Image.open(GHOST).convert("RGBA")
 alpha=original.getchannel("A")
 if alpha.getextrema()[0]==255:
  gray=ImageOps.grayscale(original.convert("RGB"))
  corners=[gray.getpixel(p) for p in [(0,0),(gray.width-1,0),(0,gray.height-1),(gray.width-1,gray.height-1)]]
  # fundo sólido conhecido: silhueta oposta ao valor de borda
  alpha=ImageOps.invert(gray) if sum(corners)/4>127 else gray
  alpha=alpha.point(lambda v:0 if v<45 else min(255,int((v-45)*255/150)))
 box=alpha.getbbox()
 if not box: raise ValueError("Ghost sem máscara visual: "+str(GHOST))
 alpha=alpha.crop(box)
 w=max(1,round(alpha.width/alpha.height*height))
 alpha=alpha.resize((w,height),Image.Resampling.LANCZOS)
 color=(246,247,249,255) if ink=="light" else (19,26,32,255)
 symbol=Image.new("RGBA",(w,height),color)
 symbol.putalpha(alpha)
 return symbol

def fit_photo(path,size):
 im=Image.open(path).convert("RGB")
 return ImageOps.fit(im,size,method=Image.Resampling.LANCZOS,centering=(.54,.51))

def overlay(im,theme):
 w,h=im.size
 im=ImageEnhance.Color(im).enhance(1.08)
 im=ImageEnhance.Brightness(im).enhance(1.48 if theme=="light" else 1.33)
 im=ImageEnhance.Contrast(im).enhance(1.09)
 dark=Image.new("RGBA",(w,h),(9,13,18,0))
 # vinheta com zona sólida para texto e vidro ainda visível ao fundo
 mask=Image.new("L",(w,h),0)
 pixels=mask.load()
 for y in range(h):
  vert=max(0,abs(y/h-.50)-.2)*.22
  for x in range(w):
   xx=x/w
   if theme=="light":
    opacity=int(75+77*(1-xx)+vert*35)
   else:
    opacity=int(92+74*(1-xx)+vert*45)
   pixels[x,y]=min(240,opacity)
 dark.putalpha(mask)
 im=Image.alpha_composite(im.convert("RGBA"),dark)
 return im

def lockup(canvas,x,y,scale=1,ink="light",extra=True):
 # original SVG sem a bolinha; Ghost original aplicado no ponto da marca.
 width=round(295*scale)
 mark=official_winf(ink,width)
 canvas.alpha_composite(mark,(round(x),round(y)))
 ghost=ghost_symbol(round(27*scale),ink)
 canvas.alpha_composite(ghost,(round(x+width*.825),round(y+width*36/109*.66)))
 d=ImageDraw.Draw(canvas)
 col="#f5f6f7" if ink=="light" else "#12181e"
 # Trademark em tipografia OFICIAL, acima e à direita do F, nunca no corpo da marca.
 # O desenho WINF continua vindo do mesmo SVG vetorial sem deformações.
 tm_font=F("medium",max(8,round(12*scale)))
 d.text((round(x+width*.935),round(y-2*scale)),"TM",font=tm_font,fill=col)
 sub="#d3d7dc" if ink=="light" else "#323d45"
 select=F("light",round(55*scale))
 label(d,"SELECT",(round(x+3*scale),round(y+mark.height+10*scale)),select,col,spacing=round(8.5*scale))
 if extra:
  small=F("medium",max(8,round(13*scale)))
  label(d,"GLASS + HOME",(round(x+7*scale),round(y+mark.height+80*scale)),small,sub,spacing=round(4.5*scale))
 return (width,mark.height+round(109*scale))

def add_exif(path,description,role,concept,platform):
 image=Image.open(path)
 ex=image.getexif()
 ex[270]=description
 ex[315]="WINF.inc® | WINF Select™"
 ex[33432]="WINF.inc® — arquivo editorial"
 ex[305]="WINF Official Branding • Pilar do Sul/SP"
 ex[40094]=(f"WINF Select; Pilar do Sul; SP; {platform}; {role}; {concept}; oficial").encode("utf-16le")
 image.save(path,format="JPEG",quality=93,optimize=True,subsampling=0,exif=ex.tobytes())

def safe_text(draw,text,maxwidth,fontsize,color):
 size=fontsize
 while size>15:
  f=F("light",size)
  if letter_width(draw,text,f,1.15)<=maxwidth: break
  size-=1
 return f

def cover(platform,concept,index):
 w,h=(1211,681) if platform=="whatsapp" else (1640,624)
 im=overlay(fit_photo(PHOTOS[index],(w,h)),concept["theme"])
 d=ImageDraw.Draw(im)
 # Facebook avatar pode esconder parte esquerda inferior; WhatsApp avatar fica central inferior.
 if platform=="whatsapp":
  x,y=62,224
  lockup(im,x,y,.81)
  main_x=717
  t_y=255
  maxw=w-main_x-37
  font_size=40
  # cidade em área segura ao lado direito (não na faixa inferior coberta por avatar)
  label(d,"PILAR DO SUL / SP",(main_x,211),F("medium",17),"#edf0f3",spacing=1.7)
 else:
  x,y=105,180
  lockup(im,x,y,1.06)
  main_x=680
  t_y=206
  maxw=w-main_x-95
  font_size=57
  label(d,"PILAR DO SUL / SP",(main_x,150),F("medium",20),"#edf0f3",spacing=2)
 color="#f7f8f9"
 f1=safe_text(d,concept["line1"],maxw,font_size,color)
 f2=safe_text(d,concept["line2"],maxw,font_size-3,color)
 d.text((main_x,t_y),concept["line1"],font=f1,fill=color,stroke_width=0)
 d.text((main_x,t_y+f1.size+12),concept["line2"],font=f2,fill=color)
 font=F("regular",22 if platform=="facebook" else 18)
 d.text((main_x,t_y+f1.size+f2.size+35),concept["sub"],font=font,fill="#e1e6e9")
 d.line((main_x,t_y-16,main_x+100,t_y-16),fill="#e6ecf0",width=2)
 d.text(((main_x if platform=="whatsapp" else main_x),h-95 if platform=="facebook" else 496),
        "ARQUITETURA  /  AUTOMOTIVO  /  PPF",font=F("medium",12 if platform=="whatsapp" else 17),fill="#e3e6ea",stroke_width=0)
 name=f"WINF_SELECT_PILAR_DO_SUL_SP_{platform.upper()}_{concept['id']:02d}_{concept['slug']}_{w}x{h}.jpg"
 path=OUT/name
 im.convert("RGB").save(path,format="JPEG",quality=93,subsampling=0,optimize=True)
 add_exif(path,"WINF Select™ Pilar do Sul/SP — "+concept["line1"]+" "+concept["line2"]+
             " | Capa "+platform+" oficial | Fotografia arquitetônica ilustrativa.", "capa",concept["slug"],platform)
 return path

def profile():
 w=h=1080
 bg=fit_photo(PHOTOS[0],(w,h))
 bg=ImageEnhance.Brightness(bg).enhance(.64)
 bg=ImageEnhance.Color(bg).enhance(.72)
 bg=bg.filter(ImageFilter.GaussianBlur(4))
 im=bg.convert("RGBA")
 overlay_layer=Image.new("RGBA",(w,h),(7,11,14,185))
 im=Image.alpha_composite(im,overlay_layer)
 # segurança do recorte circular: marca completa no centro de 72% da largura.
 d=ImageDraw.Draw(im)
 # Sem aro: o WhatsApp e o Facebook aplicam recorte circular por conta própria.
 lockup(im,225,287,2.00)
 d=ImageDraw.Draw(im)
 title="PILAR DO SUL / SP"
 f=F("medium",32)
 x=round((w-letter_width(d,title,f,3))/2)
 label(d,title,(x,767),f,"#fff",3)
 line="ARQUITETURA • AUTOMOTIVO"
 f=F("regular",22);xx=round((w-letter_width(d,line,f,2))/2)
 label(d,line,(xx,830),f,"#d9dde2",2)
 info=PngImagePlugin.PngInfo()
 meta={"Brand":"WINF Select™","Territory":"Pilar do Sul","State":"SP","Platform":"WhatsApp Business, Facebook, Instagram","Type":"profile",
       "Identity":"WINF official SVG, original Ghost icon, Gustavo official font","Version":VERSION,"PhotoStatus":"illustrative"}
 for k,v in meta.items():info.add_text(k,str(v))
 path=OUT/"WINF_SELECT_PILAR_DO_SUL_SP_PERFIL_1080x1080.png"
 im.convert("RGB").save(path,pnginfo=info,optimize=True)
 return path

def contact_sheet(files):
 thumbs=[]
 for p in files:
  a=Image.open(p).convert("RGB")
  a.thumbnail((850,365))
  b=Image.new("RGB",(900,400),"#eef0f2")
  b.paste(a,((900-a.width)//2,12))
  d=ImageDraw.Draw(b)
  d.text((30,370),p.stem,font=F("regular",13),fill="#26313b")
  thumbs.append(b)
 out=Image.new("RGB",(1800,1600),"#eef0f2")
 for i,t in enumerate(thumbs):out.paste(t,((i%2)*900,(i//2)*400))
 path=OUT/"PREVIAS_3_WHATSAPP_3_FACEBOOK.jpg"
 out.save(path,quality=91)
 return path

def export_master_lockups():
 out=[]
 for ink in ("light","dark"):
  layer=Image.new("RGBA",(700,400),(0,0,0,0))
  lockup(layer,17,13,1.83,ink=ink)
  box=layer.getbbox()
  if not box:raise RuntimeError("Logo transparente vazio: "+ink)
  layer=layer.crop((0,0,max(box[2]+8,610),min(400,box[3]+8)))
  p=OUT/("MATRIZ_OFICIAL_WINFIN_SELECT_"+ink.upper()+".png")
  layer.save(p,optimize=True)
  out.append(p)
 return out

def run():
 files=[]
 for platform in ("whatsapp","facebook"):
  for i,c in enumerate(CONCEPTS):
   p=cover(platform,c,i);files.append(p);print("✓",p.name,Image.open(p).size)
 profile_path=profile()
 print("✓",profile_path.name,Image.open(profile_path).size)
 preview=contact_sheet(files)
 masters=export_master_lockups()
 meta={"territory":"Pilar do Sul","uf":"SP","status":"propostas para aprovação","brand":"WINF Select™",
       "logo_source":"winf-logo.svg (oficial, detalhe circular substituído pelo Ghost original)",
       "ghost_source":"aerocore/assets/ghost-symbol.png (original do GitHub)",
       "font_source":["fonts/gustavo-light.otf","fonts/gustavo-regular.otf","fonts/gustavo-medium.otf"],
       "platforms":{"whatsapp":{"size":[1211,681],"count":3},"facebook":{"size":[1640,624],"count":3},"perfil":{"size":[1080,1080],"count":1}},
       "note":"Fotografias ilustrativas do acervo institucional. Sem promessa de eficácia ou disponibilidade não verificada.",
       "metadata":"EXIF em JPG, PNG textual na imagem do perfil e manifesto JSON; não aumenta ranking sozinho.",
       "source_hashes":{"winf_svg":sha(LOGO),"ghost":sha(GHOST),"gustavo_light":sha(FONTS["light"])},
       "artworks":[{"filename":x.name,"bytes":x.stat().st_size,"sha256":sha(x)} for x in [*files,profile_path,preview,*masters]]
       }
 manifest=OUT/"MANIFESTO_PILAR_DO_SUL.json"
 manifest.write_text(json.dumps(meta,ensure_ascii=False,indent=2),encoding="utf-8")
 readme=OUT/"LEIA_PRIMEIRO.txt"
 readme.write_text("WINF SELECT™ — PILAR DO SUL/SP\n"+
  "3 capas WhatsApp (1211×681), 3 capas Facebook (1640×624), 1 perfil (1080×1080).\n"+
  "Fontes usadas: GUSTAVO do repositório WINF. Fantasminha ORIGINAL: ghost-symbol.png.\n"+
  "Metadados: EXIF nos JPG, texto no PNG e manifesto no pacote.\n"+
  "Os fundos são imagens ilustrativas, não fotos de obras executadas na cidade.\n"+
  "Não são imagens de simulação do WhatsApp: carregue os arquivos separadamente.\n"+
  "Ajuste fino de recorte pode variar entre aplicativos e aparelhos.\n",encoding="utf-8")
 archive=OUT.parent/"WINF_SELECT_PILAR_DO_SUL_SP_APROVACAO_3_CONCEITOS.zip"
 with zipfile.ZipFile(archive,"w",zipfile.ZIP_DEFLATED,compresslevel=6) as z:
  for p in [*files,profile_path,preview,manifest,readme,*masters]:z.write(p,arcname=p.name)
 print("✓",archive.name,archive.stat().st_size)
if __name__=="__main__":run()
