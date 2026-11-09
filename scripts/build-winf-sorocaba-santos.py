#!/usr/bin/env python3
"""Replica o padrão visual de Pilar (aprovado) para Santos e Sorocaba.
Usa O MESMO gerador e somente os ativos oficiais do repositório.
Ghost permanece restrito a unidades com serviço automotivo confirmado.
Capas: 3 WhatsApp + 3 Facebook + 1 perfil por cidade.
"""
from pathlib import Path
import re, json, zipfile

HERE=Path(__file__).resolve()
ROOT=HERE.parents[1]
SOURCE=(ROOT/"scripts/build-winf-pilar-brand.py").read_text(encoding="utf-8")

CITIES=[
 {
  "city":"Sorocaba","slug":"SOROCABA","folder":"Sorocaba","label":"Sorocaba",
  "photos":["images/invisible-poster-1.webp","images/dualreflect-poster-1.webp","images/blackpro-poster-2.webp"],
  "concepts":[
   {"id":1,"slug":"sol_conforto","line1":"SOL FORTE.","line2":"CONFORTO SOB CONTROLE.","sub":"Mais conforto na rotina de casa.","theme":"graphite"},
   {"id":2,"slug":"privacidade","line1":"MAIS PRIVACIDADE.","line2":"SEM PERDER A LUZ.","sub":"Discrição com estética arquitetônica.","theme":"light"},
   {"id":3,"slug":"casas_escritorios","line1":"SUA CASA. SUA ROTINA.","line2":"CONFORTO COM ESTILO.","sub":"Casas, apartamentos e escritórios.","theme":"graphite"}
  ],
 },
 {
  "city":"Santos","slug":"SANTOS","folder":"Santos","label":"Santos",
  "photos":["images/dualreflect-poster-2.webp","images/invisible-poster-2.webp","images/blackpro-poster-1.webp"],
  "concepts":[
   {"id":1,"slug":"sol_conforto","line1":"SOL FORTE.","line2":"CONFORTO SOB CONTROLE.","sub":"Mais conforto perto das janelas.","theme":"graphite"},
   {"id":2,"slug":"privacidade","line1":"MAIS PRIVACIDADE.","line2":"SEM PERDER A LUZ.","sub":"Discrição com estética arquitetônica.","theme":"light"},
   {"id":3,"slug":"sacadas_vista","line1":"SUA VISTA CONTINUA.","line2":"O CONFORTO TAMBEM.","sub":"Sacadas, janelas e fachadas.","theme":"graphite"}
  ],
 },
]

# Substituição exata de marca: NÃO usar o Ghost para afirmar serviço automotivo não confirmado.
OFFICIAL_WINF='''def official_winf(ink,width=300):
 source=LOGO.read_text(encoding="utf-8")
 fill="white" if ink=="light" else "#151b20"
 svg=source.replace('fill="white"',f'fill="{fill}"',1)
 png=cairosvg.svg2png(bytestring=svg.encode("utf-8"),output_width=width,output_height=round(width*36/109))
 return Image.open(io.BytesIO(png)).convert("RGBA")

'''
def create(city):
 # Especificidade territorial também em conteúdo EXIF, PNG, manifesto, nomes e pacote.
 text=SOURCE
 patterns=[
  ("WINF_Select_Pilar_do_Sul_Identidade_Oficial",f"WINF_Select_{city['folder']}_Identidade_Oficial"),
  ("Pilar do Sul",city["city"]),
  ("PILAR DO SUL",city["slug"]),
  ("PILAR_DO_SUL",city["slug"]),
 ]
 for old,new in patterns:
  if old not in text:raise RuntimeError("Âncora territorial ausente: "+old)
  text=text.replace(old,new)
 # Os dois preservam a bolinha original; ela somente é substituída quando o serviço automotivo é confirmado.
 text,n=re.subn(r'def official_winf\(ink,width=300\):[\s\S]*?(?=def ghost_symbol\()',OFFICIAL_WINF,text,count=1)
 if n!=1:raise RuntimeError("Vetorização da marca alterada")
 original=''' ghost=ghost_symbol(round(27*scale),ink)
 canvas.alpha_composite(ghost,(round(x+width*.825),round(y+width*36/109*.66)))
'''
 if original not in text:raise RuntimeError("Âncora Ghost alterada")
 text=text.replace(original,"")
 text=text.replace(" # original SVG sem a bolinha; Ghost original aplicado no ponto da marca.",
                   " # SVG original WINF preservado integralmente, com detalhe circular oficial.")
 text=text.replace('\"ARQUITETURA  /  AUTOMOTIVO  /  PPF\"','\"ARQUITETURA  /  GLASS + HOME\"')
 text=text.replace('line=\"ARQUITETURA • AUTOMOTIVO\"','line=\"ARQUITETURA • GLASS + HOME\"')
 text=text.replace('"original Ghost icon, Gustavo official font"','"official WINF SVG, Gustavo official font"')
 text=text.replace('"winf-logo.svg (oficial, detalhe circular substituído pelo Ghost original)"',
                   '"winf-logo.svg (oficial, preservado integralmente)"')
 text=text.replace('"ghost_source":"aerocore/assets/ghost-symbol.png (original do GitHub)"',
                   '"ghost_source":"não aplicado; serviço automotivo não confirmado para a identidade regional"')
 text=text.replace('"Fontes usadas: GUSTAVO do repositório WINF. Fantasminha ORIGINAL: ghost-symbol.png.\\n"+',
                   '"Fontes usadas: GUSTAVO do repositório WINF. Logotipo WINF SVG oficial preservado.\\n"+')
 text=text.replace('"Logotipo: winf-logo.svg (vetor oficial); Ghost: aerocore/assets/ghost-symbol.png."',
                   '"Logotipo: winf-logo.svg (vetor oficial, incluindo detalhe circular original)."')
 # Fonte de imagens ilustrativas distintas por cidade, sem alegar obra executada no local.
 ns={"__name__":f"winf_select_{city['slug'].lower()}","__file__":str(ROOT/"scripts/build-winf-pilar-brand.py")}
 exec(compile(text,ns["__file__"],"exec"),ns)
 ns["PHOTOS"]=[ROOT/p for p in city["photos"]]
 ns["CONCEPTS"]=city["concepts"]
 ns["run"]()
 directory=ns["OUT"]
 zipname=ROOT/"build"/f"WINF_SELECT_{city['slug']}_SP_APROVACAO_3_CONCEITOS.zip"
 if not zipname.exists():raise RuntimeError("Pacote não encontrado: "+str(zipname))
 # Verificações: não vazar território do template, 6 capas, 1 perfil, imagens com metadados.
 manifest=json.loads((directory/f"MANIFESTO_{city['slug']}.json").read_text(encoding="utf-8"))
 if manifest.get("territory")!=city["city"]:raise RuntimeError("Território incorreto no manifesto")
 jpgs=sorted(directory.glob("*.jpg"))
 covers=[p for p in jpgs if "WHATSAPP" in p.name or "FACEBOOK" in p.name]
 if len(covers)!=6:raise RuntimeError("Número de capas inesperado: "+str(len(covers)))
 profiles=list(directory.glob("*PERFIL_1080x1080.png"))
 if len(profiles)!=1:raise RuntimeError("Perfil não encontrado para "+city["city"])
 from PIL import Image
 for p in covers:
  im=Image.open(p)
  expected=(1211,681) if "WHATSAPP" in p.name else (1640,624)
  if im.size!=expected or not im.getexif():raise RuntimeError("Capa/EXIF inválidos: "+str(p))
  if "PILAR" in p.name:raise RuntimeError("Arquivo misturado com Pilar do Sul")
 for p in profiles:
  im=Image.open(p)
  if im.size!=(1080,1080) or im.info.get("Territory")!=city["city"]:raise RuntimeError("Perfil/metadados inválidos")
 with zipfile.ZipFile(zipname) as z:
  names=z.namelist()
  if any("PILAR" in n for n in names):raise RuntimeError("Arquivo territorial misturado: "+str(zipname))
  if len(names)<10:raise RuntimeError("Pacote incompleto: "+str(zipname))
 print("✓ CIDADE:",city["city"],"6 capas + 1 perfil, identidade SVG/Gustavo oficial, ZIP separado:",zipname.name)

if __name__=="__main__":
 for c in CITIES:create(c)
