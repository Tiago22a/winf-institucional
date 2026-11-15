"use strict";
(()=>{
  const form=document.querySelector('[data-quote]');
  if(!form)return;
  const city=form.getAttribute('data-city');
  const id=form.getAttribute('data-territory-id');
  const phone='5513981113001';
  function link(partial){
    const get=(name)=>String(form.elements.namedItem(name)?.value||'').trim().slice(0,240);
    const service=get('service')||'Películas arquitetônicas';
    const neighborhood=get('neighborhood')||'A informar';
    const project=get('project')||'A informar';
    const size=get('size')||'A informar';
    const msg=['Olá, Central WINF! Gostaria de orientação e orçamento.','Cidade: '+city+'/SP','Território: '+id,'Serviço: '+service,'Bairro/região: '+neighborhood,'Ambiente: '+project,'Medidas aproximadas: '+size,'Podem confirmar cobertura, parceiro e disponibilidade de agenda?'].join('\n');
    return 'https://wa.me/'+phone+'?text='+encodeURIComponent(msg);
  }
  form.addEventListener('submit',e=>{e.preventDefault();window.location.assign(link())});
})();
