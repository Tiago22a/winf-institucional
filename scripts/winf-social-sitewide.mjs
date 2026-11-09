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
 'campina-grande':'images/blackpro-poster-1.webp'
};
const imgDir=resolve(root,'images/og');
mkdirSync(imgDir,{recursive:true});
const logo=await sharp(resolve(root,'winf-logo.svg')).resize({width:151}).png().toBuffer();
const escape=s=>String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&apos;');
const attr=(tag,key)=>tag.match(new RegExp('(?:^|\\s)'+key+'\\s*=\\s*(?:"([^"]*)"|\\'([^\\']*)\\')','i'))?.slice(1).find(v=>v!==undefined)||'';
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
 const hook=config.hooks[route]||{};
 if(city){
  return {city,brand:'WINF SELECT™',photo:cityPhotos[city.origin],lines:config.cityHooks[city.origin],
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
  const mid=Math.max(1,title.lastIndexOf(' ',Math.ceil(title.length*.55)));
  lines=[title.slice(0,mid),title.slice(mid).trim()];
 }
 return {brand,photo,lines,subtitle:hook.subtitle||textTitle(html).split(/[|—]/)[0].trim().toUpperCase(),label:hook.label||'SITE OFICIAL WINF™'};
}
function filename(route,city){
 if(city)return 'winf-select-'+city.origin+'-1200x630.jpg';
 if(route==='catalogo')return 'winf-catalogo-1200x630.jpg';
 return 'winf-share-'+(route?route.replace(/[^a-z0-9]+/g,'-'):'oficial')+'-1200x630.jpg';
}
function svgContent(d){
 const city=!!d.city,loc=city?d.city.city.toUpperCase()+' / '+d.city.uf:d.brand;
 const lines=d.lines.slice(0,2);
 const longest=Math.max(...lines.map(s=>s.length));
 const fontSize=longest>27?34:longest>22?39:longest>17?44:longest>13?50:57;
 const x=70;
 const labels=lines.map((line,i)=>'<text x="'+x+'" y="'+(city?338:325+i*63 + (i?0:0))+'" font-size="'+fontSize+'" font-weight="400" letter-spacing="-1.3" fill="#f5f5f6" font-family="DejaVu Sans,Arial,sans-serif">'+escape(line)+'</text>');
 // The city headline needs a second independent line, aligned with the first.
 if(city&&labels.length>1)labels[1]='<text x="'+x+'" y="399" font-size="'+fontSize+'" font-weight="400" letter-spacing="-1.3" fill="#f5f5f6" font-family="DejaVu Sans,Arial,sans-serif">'+escape(lines[1])+'</text>';
 const topLabel=city?'SELECT™ / GLASS + HOME':loc;
 const under=city?loc:d.subtitle;
 const yTitle=city?276:217;
 return [
 '<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">',
 '<defs><linearGradient id="black" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#08090b" stop-opacity=".99"/><stop offset=".39" stop-color="#0b0c0e" stop-opacity=".92"/><stop offset=".71" stop-color="#14171b" stop-opacity=".37"/><stop offset="1" stop-color="#1c2024" stop-opacity=".15"/></linearGradient>',
 '<linearGradient id="floor" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#050607" stop-opacity=".05"/><stop offset="1" stop-color="#050607" stop-opacity=".62"/></linearGradient></defs>',
 '<rect width="1200" height="630" fill="url(#black)"/><rect width="1200" height="630" fill="url(#floor)"/>',
 '<line x1="70" y1="148" x2="400" y2="148" stroke="#d6d9de" stroke-width="1" opacity=".50"/>',
 '<text x="258" y="95" fill="#e9e9ec" font-size="18" font-weight="400" letter-spacing="2" font-family="DejaVu Sans,Arial,sans-serif">'+escape(topLabel)+'</text>',
 '<text x="72" y="'+yTitle+'" fill="#bfc4cb" font-size="'+(city?24:16)+'" letter-spacing="'+(city?2:3)+'" font-family="DejaVu Sans,Arial,sans-serif">'+escape(under)+'</text>',
 ...labels,
 '<line x1="72" y1="456" x2="158" y2="456" stroke="#e5e6e8" stroke-width="2" opacity=".72"/>',
 '<text x="72" y="497" fill="#c4c7cc" font-size="15" letter-spacing="1.3" font-family="DejaVu Sans,Arial,sans-serif">'+escape(d.subtitle)+'</text>',
 '<text x="72" y="580" fill="#dcdee1" font-size="11" letter-spacing="3" font-family="DejaVu Sans,Arial,sans-serif">'+escape(d.label)+'</text>',
 '</svg>'
 ].join('');
}
async function renderCover(file,d){
 if(!existsSync(resolve(root,d.photo)))throw Error('Foto ilustrativa ausente: '+d.photo+' ('+file+')');
 const dest=resolve(imgDir,file);
 const photo=await sharp(resolve(root,d.photo)).resize(1200,630,{fit:'cover',position:'attention'}).toBuffer();
 const composite=[{input:Buffer.from(svgContent(d)),left:0,top:0},{input:logo,left:70,top:53}];
 await sharp(photo).composite(composite).withMetadata({exif:{IFD0:{ImageDescription:'WINF™ '+d.brand+' — '+d.lines.join(' ')+' | fotografia ilustrativa',
   Artist:'WINF.inc®',Copyright:'© WINF.inc® — composição editorial; foto ilustrativa'}}})
 .jpeg({quality:84,mozjpeg:true,progressive:true}).toFile(dest);
 const info=await sharp(dest).metadata();
 if(info.width!==1200||info.height!==630||info.format!=='jpeg'||!info.exif)throw Error('Capa inválida: '+file);
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
 const alt='Imagem editorial WINF™ para '+(d.city?d.city.city+' / '+d.city.uf:d.brand)+': '+d.lines.join(' ')+'. Fotografia ilustrativa.';
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
for(const path of files){
 const html=read(path);
 const route=domainRoute(path);
 const isRedirect=/<meta\b[^>]*http-equiv\s*=\s*["']refresh/i.test(html);
 const blocked=meta(html,'name','robots').includes('noindex');
 if(isRedirect||blocked){report.excluded.push({route,reason:isRedirect?'redirecionamento':'noindex'});continue;}
 const d=details(route,html);
 const file=filename(route,d.city);
 await renderCover(file,d);
 const result=normalize(html,route,d,file);
 if(result!==html)writeFileSync(resolve(root,path),result,'utf8');
 report.indexPages.push({route:'/'+(route?route+'/':''),title:textTitle(result),ogImage:'/images/og/'+file,topic:d.brand,alt:d.lines.join(' ')});
 console.log('✓ PREVIEW:',path,'=>',file);
}
writeFileSync(resolve(root,'docs/seo/winf-social-audit.json'),JSON.stringify(report,null,2)+'\n','utf8');
console.log('✓ WINF: '+report.indexPages.length+' páginas publicáveis com imagem própria; '+report.excluded.length+' redirecionamentos/noindex preservados.');
