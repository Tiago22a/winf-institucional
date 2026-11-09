/* WINF™ — capas OG 1200x630 com fotos internas e logomarca vetorial oficial.
 * Social cards por território configurado e catálogo global.
 * Imagens de arquitetura ilustrativas, não fotografias de obras executadas.
 */
import {readFileSync,mkdirSync} from 'node:fs';
import {resolve,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';
import sharp from 'sharp';
const root=resolve(dirname(fileURLToPath(import.meta.url)),'..');
const cfg=JSON.parse(readFileSync(resolve(root,'config/winf-active-cities.json'),'utf8'));
const source={
 santos:'images/dualreflect-poster-2.webp',
 'praia-grande':'images/invisible-poster-2.webp',
 guaruja:'images/dualreflect-poster-3.webp',
 sorocaba:'images/invisible-poster-1.webp',
 'pilar-do-sul':'images/blackpro-poster-2.webp',
 'campina-grande':'images/blackpro-poster-1.webp',
 cuiaba:'images/dualreflect-poster-1.webp',
 catalogo:'images/dualreflect-poster-1.webp'
};
const xml=v=>String(v).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
const officialLogo=await sharp(readFileSync(resolve(root,'winf-logo.svg'))).resize({width:151}).png().toBuffer();
async function buildOne(city){
 const global=city.origin==='catalogo';
 const heading=global?'CATÁLOGO':city.city.toLocaleUpperCase('pt-BR');
 const words=global?'ARQUITETURA · AEROCORE · NEOSKIN':'PELÍCULAS ARQUITETÔNICAS · GLASS + HOME';
 const rootLine=global?'UNIVERSO DE TECNOLOGIAS WINF™':'WINF SELECT™ / GLASS + HOME';
 const subtitle=global?'SOLUÇÕES PARA VIDROS E SUPERFÍCIES':'CONFORTO · PRIVACIDADE · CONTROLE SOLAR';
 const svgParts=[
 '<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">',
 '<defs><linearGradient id="shade" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#040708" stop-opacity=".97"/><stop offset=".40" stop-color="#06090b" stop-opacity=".89"/><stop offset=".72" stop-color="#06090b" stop-opacity=".27"/><stop offset="1" stop-color="#06090b" stop-opacity=".02"/></linearGradient>',
 '<linearGradient id="floor" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#07090b" stop-opacity="0"/><stop offset="1" stop-color="#07090b" stop-opacity=".78"/></linearGradient></defs>',
 '<rect width="1200" height="630" fill="url(#shade)"/><rect width="1200" height="630" fill="url(#floor)"/>',
 '<line x1="70" y1="153" x2="428" y2="153" stroke="#fff" opacity=".35"/>',
 '<text x="263" y="99" fill="white" font-family="Arial,sans-serif" font-size="34" letter-spacing="7">'+xml(global?'CATÁLOGO':'SELECT™')+'</text>',
 '<text x="70" y="209" fill="#cdd1d7" font-family="Arial,sans-serif" font-size="16" letter-spacing="3">'+xml(rootLine)+'</text>',
 '<text x="68" y="335" fill="#fff" font-family="Arial,sans-serif" font-weight="700" font-size="'+(heading.length>12?52:70)+'">'+xml(heading)+'</text>',
 (global?'':'<text x="72" y="381" fill="#dadde3" font-family="Arial,sans-serif" font-size="23" letter-spacing="5">'+xml(city.uf)+'</text>'),
 '<line x1="72" y1="416" x2="179" y2="416" stroke="#f4f4f4" stroke-width="3" opacity=".8"/>',
 '<text x="70" y="459" fill="#fff" font-family="Arial,sans-serif" font-size="20" font-weight="600" letter-spacing="2">'+xml(subtitle)+'</text>',
 '<text x="70" y="491" fill="#c6c9d0" font-family="Arial,sans-serif" font-size="13" letter-spacing="1.7">'+xml(words)+'</text>',
 '<text x="70" y="584" fill="#d9dade" font-family="Arial,sans-serif" font-size="12" letter-spacing="3">DO BRASIL PARA O MUNDO.</text>',
 '</svg>'
 ];
 const svg=svgParts.join('');
 const file='images/og/'+(global?'winf-catalogo':'winf-select-'+city.origin)+'-1200x630.jpg';
 const output=resolve(root,file);
 mkdirSync(dirname(output),{recursive:true});
 const photo=await sharp(resolve(root,source[city.origin])).resize(1200,630,{fit:'cover',position:'attention'}).toBuffer();
 await sharp(photo).composite([{input:Buffer.from(svg),top:0,left:0},{input:officialLogo,left:70,top:54}])
   .jpeg({quality:83,mozjpeg:true,progressive:true}).toFile(output);
 const size=await sharp(output).metadata();
 if(size.width!==1200||size.height!==630||size.format!=='jpeg')throw new Error('Dimensões inválidas: '+file);
 console.log('OG OK',file,size.width+'x'+size.height);
}
for(const city of cfg.cities)await buildOne(city);
await buildOne({city:'WINF',uf:'',origin:'catalogo'});
