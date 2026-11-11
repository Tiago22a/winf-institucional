/* MediaCar™ / 08 — Biblioteca de prompts para renders por carro e vista.
 * Não substitui fotografias nem autoriza logotipos de terceiros;
 * as marcas institucionais e cotas são aplicadas pelo editor.
 */
(function(){
  "use strict";
  var specs={
    bmw:{label:"BMW M4 / MediaCar",body:"BMW M4 de quatro portas, carroceria esportiva escura, rodas de liga leves, proporções reais da versão apresentada. Preservar silhueta e elementos do carro original aprovado",venue:"estúdio automotivo premium com piso de concreto polido e parede grafite"},
    porsche:{label:"Porsche 911 / GT",body:"Porsche 911 coupé esportivo contemporâneo, acabamento grafite metálico, rodas pretas, linhas aerodinâmicas reconhecíveis sem distorções de carroceria",venue:"garagem de alta performance com reflexos em piso preto"},
    volvo:{label:"Volvo EX90 / elétrico",body:"SUV elétrico Volvo EX90 de linhas escandinavas, tom grafite, rodas aerodinâmicas, frente moderna e proporções naturais de utilitário de luxo",venue:"arquitetura urbana moderna com vidro e concreto cinza"},
    mustang:{label:"Mustang Fastback / clássico",body:"Ford Mustang Fastback clássico de coleção, carroceria verde-escuríssima, detalhes de época, rodas vintage e proporções reais de muscle car",venue:"galpão automotivo clássico e sofisticado com luz lateral"},
    sprinter:{label:"Sprinter / hub móvel",body:"Mercedes-Benz Sprinter furgão moderno de teto alto, pintura grafite, portas e superfícies laterais amplas, acabamento impecável",venue:"showroom empresarial minimalista com piso industrial"},
    custom:{label:"Veículo do licenciado",body:"veículo real de propriedade do licenciado, mantendo exatamente a marca, modelo, ano, cor e proporções das fotos de referência fornecidas",venue:"ambiente profissional neutro, coerente com o uso do veículo"}
  };
  var views={
    left:"vista lateral ESQUERDA completa e rigorosamente ortogonal, quatro rodas (conforme veículo) e portas aparentes, sem corte, sem perspectiva frontal",
    right:"vista lateral DIREITA completa e rigorosamente ortogonal, com adesivação e proporções consistentes com a lateral esquerda; não espelhar letras ou posição do volante",
    front:"vista FRONTAL centralizada, perfeitamente simétrica, faróis e grade inteiros, carro completo da ponta do teto ao assoalho",
    back:"vista TRASEIRA centralizada, perfeitamente simétrica, lanternas e tampa visíveis, sem cortar para-choques",
    roof:"vista SUPERIOR vertical (drone nadiral 90 graus), incluindo todo o teto e contorno completo do veículo"
  };
  function buildPrompt(model,view){
    var v=specs[model]||specs.custom,angle=views[view]||views.left;
    return [
      "MEDIACAR™ / WINF PARTNERS™ — PROJETO NÚMERO 08",
      "OBJETIVO: criar uma fotografia conceitual base para inserção no simulador comercial de cotas publicitárias, sem patrocínios fictícios.",
      "VEÍCULO: "+v.body+".",
      "CÂMERA / ENQUADRAMENTO: "+angle+".",
      "DIREÇÃO DE ARTE: fotografia automotiva ultrarrealista, textura e reflexos plausíveis, iluminação cinematográfica controlada, "+v.venue+". Priorizar legibilidade da carroceria e áreas planas para aplicação de cotas.",
      "PALETA: grafite, preto premium, reflexos metálicos discretos; pequenos reflexos verde-lima são permitidos no ambiente, não em logomarcas.",
      "CONSISTÊNCIA: repetir identidade, cor, rodas, ambiente e distância focal nas cinco vistas; geometria e número de portas coerentes, sem esticar superfícies.",
      "COMPOSIÇÃO: proporção horizontal 16:9, todo o veículo enquadrado, margem de 8% ao redor, centro do carro na área útil, fundo elegante com contraste, resolução mínima 1920 × 1080.",
      "NÃO INSERIR: textos, logotipos, GHOST, WINF, número 08, AeroCore, NeoSkin, marca do patrocinador, placas legíveis, marca-d’água, pessoas ou cotas desenhadas; o aplicativo adicionará a comunicação nas posições corretas.",
      "IMPORTANTE: conceito visual independente, não fotografia de veículo real da frota ou parceria oficial do fabricante. Conferir fidelidade do modelo antes da publicação."
    ].join("\n\n");
  }
  function copy(text){
    if(navigator.clipboard&&navigator.clipboard.writeText)return navigator.clipboard.writeText(text);
    return Promise.reject(new Error("Sem permissão de copiar"));
  }
  function init(){
    var m=document.getElementById("mcPromptModel"),v=document.getElementById("mcPromptView"),output=document.getElementById("mcPromptOutput"),copyBtn=document.getElementById("mcPromptCopy"),download=document.getElementById("mcPromptDownload"),notice=document.getElementById("mcPromptNotice");
    if(!m||!v||!output||!copyBtn||!download)return;
    Object.keys(specs).forEach(function(id){var option=document.createElement("option");option.value=id;option.textContent=specs[id].label;m.append(option)});
    Object.keys(views).forEach(function(id){var option=document.createElement("option");option.value=id;option.textContent=({left:"Lateral esquerda",right:"Lateral direita",front:"Frente",back:"Traseira",roof:"Teto"})[id];v.append(option)});
    function update(){output.value=buildPrompt(m.value,v.value);notice.textContent="Pronto para copiar ou salvar. Crie cinco vistas coerentes antes de anunciar o veículo.";}
    m.addEventListener("change",update);v.addEventListener("change",update);
    copyBtn.addEventListener("click",function(){copy(output.value).then(function(){notice.textContent="Prompt copiado."}).catch(function(){output.focus();output.select();notice.textContent="Selecione o texto acima e copie manualmente.";})});
    download.addEventListener("click",function(){
      var url=URL.createObjectURL(new Blob([output.value],{type:"text/plain;charset=utf-8"})),a=document.createElement("a");a.href=url;a.download="mediacar-08-"+m.value+"-"+v.value+"-prompt.txt";document.body.append(a);a.click();a.remove();setTimeout(function(){URL.revokeObjectURL(url)},2000);
    });
    document.querySelectorAll("[data-mc-model]").forEach(function(button){
      button.addEventListener("click",function(){if(specs[button.dataset.mcModel]){m.value=button.dataset.mcModel;update()}});
    });
    update();
  }
  if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",init,{once:true});else init();
  window.MediaCarPromptLibrary={buildPrompt:buildPrompt,models:Object.keys(specs),views:Object.keys(views)};
})();