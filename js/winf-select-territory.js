(()=>{
"use strict";
const videos=[...document.querySelectorAll(".wst-product video")];
if("IntersectionObserver" in window){const ob=new IntersectionObserver(entries=>{for(const e of entries){const v=e.target;if(e.isIntersecting){let changed=false;for(const s of v.querySelectorAll("source[data-src]")){s.src=s.dataset.src;s.removeAttribute("data-src");changed=true;}if(changed)v.load();const p=v.play?.();if(p&&p.catch)p.catch(()=>{});}else v.pause?.();}},{rootMargin:"150px"});videos.forEach(v=>ob.observe(v));}
const m=location.pathname.match(/^\/winf-select\/cidades\/([a-z0-9-]+)\/?$/);if(!m)return;const id=m[1];
const a=(url,label,cls)=>{const n=document.createElement("a");n.href=url;n.textContent=label;n.className=cls;n.target="_blank";n.rel="noopener noreferrer";return n;};
const p=(tag,cls,text)=>{const n=document.createElement(tag);n.className=cls;n.textContent=text;return n;};
function setup(t){
if(!t)return;
const active=t.statusOperacional==="ativa"&&/^55[0-9]{10,11}$/.test(t.whatsappAtivo||"");
const phone=active?t.whatsappAtivo:"5513981113001";
const city=t.municipio+"/"+t.uf;
const msg=active?"Olá! Vim pelo site WINF Select de "+city+" e desejo solicitar um orçamento.":"Olá! Vim pelo site WINF Select de "+city+". Este território está em expansão. Gostaria de informações e de verificar possibilidades de atendimento. Código: "+id+".";
const wa="https://wa.me/"+phone+"?text="+encodeURIComponent(msg);
const hero=document.querySelector(".wst-hero .wst-cta");
if(hero)hero.prepend(a(wa,active?"PEDIR ORÇAMENTO ↗":"FALAR COM CENTRAL 013 ↗","wst-btn wst-contact"));
const close=document.querySelector(".wst-close .wst-cta");if(close)close.prepend(a(wa,"WHATSAPP CENTRAL WINF ↗","wst-btn wst-contact"));
const fixed=document.querySelector(".wst-floater a");if(fixed){fixed.href=wa;fixed.textContent="WHATSAPP WINF ↗";fixed.target="_blank";fixed.rel="noopener noreferrer";}
const slot=document.querySelector(".wst-local .wst-shell");if(!slot)return;
const wrap=p("div","wst-social-local",""),title=p("h3","","CENTRAL WINF · "+city),description=p("p","","Enquanto este território não tiver operação local homologada, informações e consultas são recebidas pela Central WINF no WhatsApp (13) 98111-3001. Confirme a possibilidade de atendimento.");
wrap.append(title,description);
const links=p("div","wst-social-links","");
links.append(a(wa,"WHATSAPP · (13) 98111-3001 ↗","wst-social-link"));
links.append(a("https://www.instagram.com/winf.ofc/","INSTAGRAM OFICIAL · @winf.ofc ↗","wst-social-link"));
if(t.instagramLocalPlanejado&&/^winfselect\.[a-z0-9._]+$/.test(t.instagramLocalPlanejado)){
 const local=a("https://www.instagram.com/"+t.instagramLocalPlanejado+"/","PERFIL LOCAL PLANEJADO · @"+t.instagramLocalPlanejado+" ↗","wst-social-link");
 local.title="Nome proposto, titularidade não confirmada";links.append(local);
 wrap.append(links,p("p","wst-social-note","O perfil local é apenas um nome previsto, não verificado. Até confirmação, a conta oficial da marca é @winf.ofc."));
}else wrap.append(links);
slot.append(wrap);
}
fetch("/config/winf-territory-contacts.json",{cache:"no-store"}).then(r=>r.ok?r.json():Promise.reject()).then(c=>{setup((c.territorios||[]).find(x=>x.id===id));}).catch(()=>{setup({municipio:document.querySelector('meta[name="geo.placename"]')?.content||id,uf:document.querySelector('meta[name="geo.region"]')?.content?.slice(3)||"BR",statusOperacional:"inativo"});});
})();