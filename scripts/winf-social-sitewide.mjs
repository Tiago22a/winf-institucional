/* WINF™ / Capas sociais e Open Graph para todas as páginas HTML públicas.
 * Títulos e URLs limpos, imagem editorial por assunto e logotipo vetorial oficial.
 * Sem rastreamento utm_source ou conteúdo artificial para robôs.
 */
import {readFileSync,writeFileSync,mkdirSync,readdirSync,existsSync} from 'node:fs';
import {resolve,relative,dirname,join} from 'node:path';
import {fileURLToPath} from 'node:url';
import sharp from 'sharp';

const root=resolve(dirname(fileURLToPath(import.meta.url)),'..');
const read=path=>readFileSync(resolve(root,path),'utf8');
const config=JSON.parse(read('config/winf-social-content.json'));
const cities=JSON.parse(read('config/winf-active-cities.json')).cities;
const cityPhotos={
 santos:'images/dualreflect-poster-2.webp',
 'praia-grande':'images/invisible-poster-2.webp',
 guaruja:'images/dualreflect-poster-3.webp',
 sorocaba:'images/invisible-poster-1.webp',
 'pilar-do-sul':'images/blackpro-poster-2.webp',
 'campina-grande':'images/blackpro-poster-1.webp',
 cuiaba:'images/dualreflect-poster-1.webp'
};
const imgDir=resolve(root,'images/og');
mkdirSync(imgDir,{recursive:true});
const logo=await sharp(resolve(root,'winf-logo.svg')).resize({width:151}).png().toBuffer();
const escape=s=>String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&apos;');
const attr=(tag,key)=>{const all=[...tag.matchAll(/([a-zA-Z:-]+)\s*=\s*(?:"([^"]*)"|'([^']*)')/g)];return all.find(m=>m[1].toLowerCase()===key.toLowerCase())?.slice(2).find(v=>v!==undefined)||''};
function meta(html,kind,key){
 const matches=html.match(/<meta\b[^>]*>/ig)||[];
 for(const tag of matches)if(attr(tag,kind)===key)return attr(tag,'content');
 return '';
}
const textTitle=html=>html.match(/<title\b[^>]*>([\s\S]*?)<\/title>/i)?.[1].replace(/\s+/g,' ').trim()||'WINF™';
const shorten=(s,n)=>s.length>n?s.slice(0,n).replace(/\s+\S*$/,'').trim()+'…':s;
function domainRoute(file){return file==='index.html'?'':file.slice(0,-'/index.html'.length);}
function allIndexes(dir,acc=[]){
 for(const item of readdirSync(dir,{withFileTypes:true})){
  if(item.name==='.git'||item.name==='node_modules')continue;
  const p=join(dir,item.name);
  if(item.isDirectory())allIndexes(p,acc);
  else if(item.name==='index.html')acc.push(relative(root,p).replace(/\\/g,'/'));
 }
 return acc.sort();
}
function details(route,html){
 const city=cities.find(c=>c.slug===route);
 const cityScope=cities.find(c=>route===c.slug||route.startsWith(c.slug+'/'))||null;
 const hook=config.hooks[route]||{};
 if(city){
  return {city,cityScope:city,brand:'WINF SELECT™',photo:cityPhotos[city.origin],lines:config.cityHooks[city.origin],
   subtitle:'GLASS + HOME / PELÍCULAS PARA VIDROS',label:'SITE OFICIAL WINF SELECT™'};
 }
 if(route==='catalogo'){
  const a=config.hooks.catalogo;
  return {brand:a.brand,photo:a.photo,lines:a.title.split('|'),subtitle:a.subtitle,label:'CATÁLOGO OFICIAL WINF™'};
 }
 const brand=hook.brand||(route.startsWith('aerocore/')?'AEROCORE™':route.startsWith('partners/')?'WINF PARTNERS™':route.startsWith('blog/')?'WINF JOURNAL™':'WINF™');
 const photo=hook.photo||(route.startsWith('aerocore/')?'images/aerocore/aerocore-car.webp':route.startsWith('partners/')?'partners/media/arquitetura.webp':'images/dualreflect-poster-1.webp');
 let lines=hook.title?.split('|');
 if(!lines){
  let title=textTitle(html).split(/[|—]/)[0].trim().toUpperCase();
  if(title.length>35)title=title.slice(0,35).trim();
  // Nunca divida uma palavra: isso gerava capas com "S" isolado antes de "YNTHWAVE.FM".
  const middle=Math.floor(title.length/2);
  const spaces=[...title.matchAll(/\s+/g)].map(m=>m.index);
  if(!spaces.length)lines=[title];
  else {
    const cut=spaces.reduce((best,x)=>Math.abs(x-middle)<Math.abs(best-middle)?x:best,spaces[0]);
    lines=[title.slice(0,cut).trim(),title.slice(cut).trim()].filter(Boolean);
  }
 }
 return {cityScope,brand:cityScope?'WINF SELECT™':brand,photo:cityScope?cityPhotos[cityScope.origin]:photo,lines,subtitle:hook.subtitle||textTitle(html).split(/[|—]/)[0].trim().toUpperCase(),label:hook.label||(cityScope?'SITE OFICIAL WINF SELECT™':'SITE OFICIAL WINF™')};
}
function filename(route,city){
 // Novo caminho de arquivo: o WhatsApp armazena a imagem anterior em cache.
 const version=String(config.visualSystem.previewVersion||'r2').replace(/[^a-z0-9-]/gi,'');
 const basename=city?'winf-select-'+city.origin:route==='catalogo'?'winf-catalogo':'winf-share-'+(route?route.replace(/[^a-z0-9]+/g,'-'):'oficial');
 return basename+'-1200x630-'+version+'.jpg';
}
function svgContent(d){
 // Composição editorial com área de segurança. O texto nunca fica no meio
 // da fotografia e nenhum nome de marca é separado no meio da palavra.
 const synth=/SYNTHWAVE/i.test(d.brand);
 const city=!!d.city;
 const loc=city?d.city.city.toUpperCase('pt-BR')+' / '+d.city.uf:d.brand;
 const lines=(d.lines||[]).map(v=>String(v).trim()).filter(Boolean).slice(0,2);
 if(!lines.length)lines.push('WINF');
 const estimate=(line)=>[...line].reduce((sum,ch)=>sum+('MW@%'.includes(ch)?0.86:'I1|'.includes(ch)?0.34:' .,-'.includes(ch)?0.32:0.64),0);
 const longest=Math.max(...lines.map(estimate));
 const fontSize=Math.max(29,Math.min(61,Math.floor(750/Math.max(longest,1))));
 const y=lines.length===1?[356]:[325,392];
 const color=synth?'#fff7e8':'#fafafa';
 const pale=synth?'#cfe0d4':'#d1d7da';
 const accent=synth?'#e9aa75':'#b7bec1';
 const shade0=synth?'#163b32':'#080b0f';
 const shade1=synth?'#1e483a':'#0d1014';
 const headline=lines.map((line,i)=>
  '<text x="74" y="'+y[i]+'" font-size="'+fontSize+'" font-weight="700" letter-spacing="-1.3" fill="'+color+'" font-family="DejaVu Sans,Arial,sans-serif">'+escape(line)+'</text>');
 const topLabel=city?'SELECT™ / GLASS + HOME':loc;
 const under=city?loc:d.subtitle;
 return [
 '<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">',
 '<defs><linearGradient id="shade" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="'+shade0+'" stop-opacity=".99"/><stop offset=".53" stop-color="'+shade1+'" stop-opacity=".95"/><stop offset=".78" stop-color="'+shade1+'" stop-opacity=".36"/><stop offset="1" stop-color="'+shade1+'" stop-opacity=".13"/></linearGradient>',
 '<linearGradient id="floor" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#060d0b" stop-opacity="0"/><stop offset="1" stop-color="#060d0b" stop-opacity=".75"/></linearGradient></defs>',
 '<rect width="1200" height="630" fill="url(#shade)"/><rect width="1200" height="630" fill="url(#floor)"/>',
 '<line x1="74" y1="151" x2="410" y2="151" stroke="'+accent+'" stroke-width="2" opacity=".72"/>',
 '<text x="262" y="92" fill="'+color+'" font-size="19" font-weight="600" letter-spacing="1.5" font-family="DejaVu Sans,Arial,sans-serif">'+escape(topLabel)+'</text>',
 '<text x="74" y="226" fill="'+pale+'" font-size="17" letter-spacing="1.4" font-family="DejaVu Sans,Arial,sans-serif">'+escape(under)+'</text>',
 ...headline,
 '<line x1="74" y1="446" x2="172" y2="446" stroke="'+accent+'" stroke-width="4" opacity=".88"/>',
 '<text x="74" y="488" fill="'+color+'" font-size="15" letter-spacing="1.0" font-family="DejaVu Sans,Arial,sans-serif">'+escape(d.subtitle)+'</text>',
 '<text x="74" y="575" fill="'+pale+'" font-size="12" letter-spacing="1.9" font-family="DejaVu Sans,Arial,sans-serif">'+escape(d.label)+'</text>',
 '</svg>'
 ].join('');
}
async function renderCover(file,d){
 if(!existsSync(resolve(root,d.photo)))throw Error('Foto ilustrativa ausente: '+d.photo+' ('+file+')');
 const dest=resolve(imgDir,file);
 const photo=await sharp(resolve(root,d.photo)).resize(1200,630,{fit:'cover',position:'attention'}).toBuffer();
 const composite=[{input:Buffer.from(svgContent(d)),left:0,top:0},{input:logo,left:70,top:53}];
 const scope=d.cityScope||d.city||null;
 const description=scope?'WINF_SELECT_CITY='+scope.id+' | WINF Select Glass + Home | '+scope.city+'/'+scope.uf+' | '+d.lines.join(' ')+' | Fotografia ilustrativa | '+file:'WINF™ '+d.brand+' — '+d.lines.join(' ')+' | fotografia ilustrativa';
 await sharp(photo).composite(composite).withMetadata({exif:{IFD0:{ImageDescription:description,
   Artist:'WINF.inc®',Copyright:'© WINF.inc® — composição editorial; foto ilustrativa'}}})
 .jpeg({quality:84,mozjpeg:true,progressive:true}).toFile(dest);
 const info=await sharp(dest).metadata();
 if(info.width!==1200||info.height!==630||info.format!=='jpeg'||!info.exif)throw Error('Capa inválida: '+file);
 if(scope&&!info.exif.includes(Buffer.from('WINF_SELECT_CITY='+scope.id)))throw Error('EXIF sem identificação regional: '+file);
}
const ogNames=['og:type','og:locale','og:site_name','og:title','og:description','og:url','og:image','og:image:secure_url','og:image:type','og:image:width','og:image:height','og:image:alt'];
const twitterNames=['twitter:card','twitter:title','twitter:description','twitter:image','twitter:image:alt'];
function normalize(html,route,d,file){
 const close=html.search(/<\/head\s*>/i);
 if(close<0)throw Error('HTML sem head: '+route);
 let head=html.slice(0,close),tail=html.slice(close);
 const title=textTitle(head);
 const baseDescription=meta(head,'name','description')||'Conheça o site oficial WINF™ e suas soluções para vidros, arquitetura e mobilidade.';
 const ogTitle=route===''?'WINF™ | Site Oficial — Premium Quality Window Film':(meta(head,'property','og:title')||title);
 const description=route===''?'Site oficial WINF™. O sol não manda no seu conforto. Conheça soluções premium para vidro, privacidade, arquitetura e proteção.':
  (meta(head,'property','og:description')||baseDescription);
 const canonicalMatch=[...(head.match(/<link\b[^>]*>/ig)||[])].find(tag=>attr(tag,'rel').toLowerCase()==='canonical');
 const originalCanonical=canonicalMatch?attr(canonicalMatch,'href'):'';
 const canonical=route==='winf-home'?'https://winf.com.br/': 'https://winf.com.br/'+(route?route+'/':'');
 if(canonicalMatch)head=head.replace(canonicalMatch,'<link rel="canonical" href="'+canonical+'">');
 else head+='\n<link rel="canonical" href="'+canonical+'">';
 const originalImage=meta(head,'property','og:image');
 const image='https://winf.com.br/images/og/'+file;
 const scope=d.cityScope||d.city||null;
 const alt='Imagem editorial WINF™ para '+(scope?scope.city+' / '+scope.uf:d.brand)+': '+d.lines.join(' ')+'. Fotografia ilustrativa.';
 const isArticle=meta(head,'property','og:type')==='article'||route.startsWith('blog/')||route.startsWith('aplicacoes/');
 head=head.replace(/<meta\b[^>]*>/ig,t=>{
  const property=attr(t,'property'),name=attr(t,'name');
  if(ogNames.includes(property)||twitterNames.includes(name))return '';
  return t;
 });
 if(originalImage&&originalImage!==image){
  head=head.replace(/<script\b[^>]*type=["']application\/ld\+json["'][^>]*>[\s\S]*?<\/script>/gi,s=>s.replaceAll(originalImage,image));
 }
 const property=(k,v)=>'<meta property="'+k+'" content="'+escape(v)+'">';
 const named=(k,v)=>'<meta name="'+k+'" content="'+escape(v)+'">';
 const entries=[
  property('og:type',isArticle?'article':'website'),property('og:locale','pt_BR'),property('og:site_name',d.brand),
  property('og:title',shorten(ogTitle,115)),property('og:description',shorten(description,195)),
  property('og:url',canonical),property('og:image',image),property('og:image:secure_url',image),
  property('og:image:type','image/jpeg'),property('og:image:width','1200'),property('og:image:height','630'),property('og:image:alt',shorten(alt,220)),
  named('twitter:card','summary_large_image'),named('twitter:title',shorten(ogTitle,115)),
  named('twitter:description',shorten(description,195)),named('twitter:image',image),named('twitter:image:alt',shorten(alt,220))
 ];
 head+='\n<!-- WINF social / previews oficiais e URLs canônicas sem parâmetros -->\n'+entries.join('\n')+'\n';
 return head+tail;
}
const files=allIndexes(root);
const report={generatedAt:'2026-11-09',domain:'https://winf.com.br/',indexPages:[],excluded:[]};
const cityRegistry={schema:'winf-city-media-v1',note:'Identidade regional e controle editorial; fotos de base podem ser ilustrativas. EXIF/IPTC pode ser removido por plataformas, por isso o arquivo e o cadastro definem a origem.',cities:cities.map(c=>({id:c.id,city:c.city,uf:c.uf,origin:c.origin,route:'/'+c.slug+'/',localStatus:c.origin==='campina-grande'?'pré-ativação':'atendimento a confirmar',folder:'assets/cidades/'+c.id+'/',images:[]}))};
for(const path of files){
 const html=read(path);
 const route=domainRoute(path);
 const isRedirect=/<meta\b[^>]*http-equiv\s*=\s*["']refresh/i.test(html);
 const blocked=meta(html,'name','robots').includes('noindex');
 if(isRedirect||blocked){report.excluded.push({route,reason:isRedirect?'redirecionamento':'noindex'});continue;}
 const d=details(route,html);
 const file=filename(route,d.city);
 await renderCover(file,d);
 const scope=d.cityScope||d.city||null;
 if(scope){const record=cityRegistry.cities.find(c=>c.id===scope.id);
 record.images.push({type:route===scope.slug?'capa-social-da-cidade':'guia-local',page:'https://winf.com.br/'+route+'/',image:'images/og/'+file,photoSource:d.photo,photoType:'imagem ilustrativa de arquitetura',cityTag:'WINF_SELECT_CITY='+scope.id,alt:'WINF Select '+scope.city+'/'+scope.uf+' — '+d.lines.join(' '),usage:['site','whatsapp-link-preview','redes-compartilhamento']});}
 const result=normalize(html,route,d,file);
 if(result!==html)writeFileSync(resolve(root,path),result,'utf8');
 report.indexPages.push({route:'/'+(route?route+'/':''),title:textTitle(result),ogImage:'/images/og/'+file,topic:d.brand,alt:d.lines.join(' ')});
 console.log('✓ PREVIEW:',path,'=>',file);
}
writeFileSync(resolve(root,'docs/seo/winf-social-audit.json'),JSON.stringify(report,null,2)+'\n','utf8');
mkdirSync(resolve(root,'docs/media'),{recursive:true});
writeFileSync(resolve(root,'docs/media/winf-city-image-registry.json'),JSON.stringify(cityRegistry,null,2)+'\n','utf8');
console.log('✓ WINF: '+report.indexPages.length+' páginas publicáveis com imagem própria; '+report.excluded.length+' redirecionamentos/noindex preservados.');
