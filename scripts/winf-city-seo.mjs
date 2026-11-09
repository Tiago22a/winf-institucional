// SEO WINF Select™: padrão central por cidade, sem inventar endereços físicos.
export const CITY_SEO={
  "santos": {
    "title": "Películas para Sacadas e Vidros em Santos SP | WINF Select™",
    "description": "Películas de controle solar e insulfilm residencial em Santos para sacadas, varandas e fachadas. Conheça as linhas WINF Select™ e consulte a central.",
    "socialTitle": "WINF Select™ Santos | Conforto, vidro e privacidade",
    "socialDesc": "Soluções arquitetônicas para sacadas, apartamentos e fachadas em Santos. Conheça a WINF Select™ e solicite orientação."
  },
  "praia-grande": {
    "title": "Película de Controle Solar em Praia Grande SP | WINF Select™",
    "description": "Película de controle solar e insulfilm residencial em Praia Grande para sacadas, janelas e apartamentos. Compare WINF Select™ e consulte agenda.",
    "socialTitle": "WINF Select™ Praia Grande | Proteção para vidros",
    "socialDesc": "Conforto térmico, luminosidade e privacidade para imóveis em Praia Grande. Catálogo WINF Select™ e atendimento regional."
  },
  "guaruja": {
    "title": "Películas para Sacadas e Vidros no Guarujá SP | WINF Select™",
    "description": "Películas para vidros e insulfilm residencial no Guarujá: sacadas, casas e fachadas. Conheça a WINF Select™ e consulte a central da Baixada.",
    "socialTitle": "WINF Select™ Guarujá | Arquitetura e conforto",
    "socialDesc": "Películas para vidros de sacadas, residências e fachadas no Guarujá. Explore soluções e solicite avaliação técnica."
  },
  "sorocaba": {
    "title": "Películas Residenciais e Controle Solar em Sorocaba SP | WINF Select™",
    "description": "Insulfilm residencial e películas de controle solar em Sorocaba para casas, apartamentos e escritórios. Compare as opções WINF Select™.",
    "socialTitle": "WINF Select™ Sorocaba | Películas para vidros",
    "socialDesc": "Conforto térmico, privacidade e controle solar em Sorocaba. Conheça as películas WINF Select™ e fale com a central regional."
  },
  "pilar-do-sul": {
    "title": "Películas para Vidros em Pilar do Sul SP | WINF Select™",
    "description": "Películas de controle solar e insulfilm residencial em Pilar do Sul para casas, chácaras e janelas. Conheça WINF Select™ e consulte a central.",
    "socialTitle": "WINF Select™ Pilar do Sul | Conforto para vidros",
    "socialDesc": "Películas arquitetônicas para residências e projetos em Pilar do Sul. Conheça opções para luz, calor e privacidade."
  },
  "cuiaba": {
    "title": "Película de Controle Solar em Cuiabá MT | WINF Select™",
    "description": "Películas para vidros e insulfilm residencial em Cuiabá MT. Conheça soluções para sacadas, janelas e fachadas e consulte a cobertura local.",
    "socialTitle": "WINF Select™ Cuiabá | Películas arquitetônicas",
    "socialDesc": "Controle solar, luminosidade e privacidade para vidros em Cuiabá. Conheça a WINF Select™ e consulte disponibilidade."
  },
  "campina-grande": {
    "title": "Película de Controle Solar em Campina Grande PB | WINF Select™",
    "description": "Películas para vidros e controle solar em Campina Grande. Conheça WINF Select™ e consulte a central; unidade local em pré-ativação.",
    "socialTitle": "WINF Select™ Campina Grande | Catálogo de películas",
    "socialDesc": "Conheça soluções WINF Select™ para vidros em Campina Grande. Atendimento e disponibilidade local sujeitos a confirmação."
  }
};
export function applyCitySeo(html,city){
  const text=CITY_SEO[city.origin];
  if(!text)throw new Error('Cidade sem texto SEO: '+city.origin);
  const esc=s=>String(s).replace(/&/g,'&amp;').replace(/"/g,'&quot;').replace(/</g,'&lt;');
  const uri='https://winf.com.br/'+city.slug+'/';
  const image='https://winf.com.br/images/og/winf-select-'+city.origin+'-1200x630.jpg';
  const imageAlt='Imagem ilustrativa de arquitetura premium com vidros amplos para a WINF Select™ em '+city.city+'/'+city.uf;
  const putMeta=(kind,key,value)=>{
     const rx=new RegExp('<meta\\s+'+kind+'="'+key.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')+'"\\s+content="[^"]*"\\s*\\/?>','g');
     const tag='<meta '+kind+'="'+key+'" content="'+esc(value)+'" />';
     if(rx.test(html))html=html.replace(rx,tag);
     else html=html.replace('</head>','  '+tag+'\n</head>');
  };
  html=html.replace(/<title>[\s\S]*?<\/title>/,'<title>'+esc(text.title)+'</title>');
  for(const [key,val] of Object.entries({
     description:text.description,'geo.region':'BR-'+city.uf,'geo.placename':city.city,
     'twitter:card':'summary_large_image','twitter:title':text.socialTitle,
     'twitter:description':text.socialDesc,'twitter:image':image,'twitter:image:alt':imageAlt
  }))putMeta('name',key,val);
  for(const [key,val] of Object.entries({
     'og:type':'website','og:locale':'pt_BR','og:site_name':'WINF Select™','og:title':text.socialTitle,
     'og:description':text.socialDesc,'og:url':uri,'og:image':image,
     'og:image:secure_url':image,'og:image:type':'image/jpeg','og:image:width':'1200','og:image:height':'630',
     'og:image:alt':imageAlt
  }))putMeta('property',key,val);
  // Dados geo legados eram duplicados; deixar somente uma cópia por página.
  for(const key of ['geo.region','geo.placename']){
    let first=true;
    html=html.replace(new RegExp('^\\s*<meta name="'+key.replace('.','\\.')+'" content="[^"]*"\\s*\\/?>\\s*\\n','gm'),m=>{
       if(first){first=false;return m}
       return '';
    });
  }
  const contact={ '@type':'ContactPoint',telephone:city.phone==='5515997909049'?'+55-15-99790-9049':'+55-13-98111-3001',
    contactType:'atendimento e orçamentos',availableLanguage:'pt-BR',areaServed:{'@type':'City',name:city.city},
    hoursAvailable:{'@type':'OpeningHoursSpecification',dayOfWeek:['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'],opens:'07:00',closes:'22:00'}
  };
  const citySchema={'@context':'https://schema.org','@graph':[
    {'@type':'Organization','@id':'https://winf.com.br/#organization',name:'WINF™',url:'https://winf.com.br/',logo:{'@type':'ImageObject',url:'https://winf.com.br/winf-logo.svg'},sameAs:['https://www.instagram.com/winf.ofc/']},
    {'@type':'Organization','@id':uri+'#organizacao',name:'WINF Select™ '+city.city,url:uri,parentOrganization:{'@id':'https://winf.com.br/#organization'},contactPoint:contact,
      ...(city.instagram?{sameAs:['https://www.instagram.com/'+city.instagram+'/']}:{} )},
    {'@type':'WebPage','@id':uri+'#webpage',url:uri,name:text.title,description:text.description,inLanguage:'pt-BR',
       isPartOf:{'@id':'https://winf.com.br/#website'},
       primaryImageOfPage:{'@type':'ImageObject',url:image,width:1200,height:630,caption:imageAlt}},
    {'@type':'Service','@id':uri+'#servico',name:'Películas arquitetônicas WINF Select™ — '+city.city,
      serviceType:'Orientação e aplicação de películas de controle solar, privacidade e proteção para vidros',
      description:text.description,
      provider:{'@id':uri+'#organizacao'},
      areaServed:{'@type':'City',name:city.city,containedInPlace:{'@type':'AdministrativeArea',name:city.uf}},
      mainEntityOfPage:{'@id':uri+'#webpage'}},
    {'@type':'BreadcrumbList','@id':uri+'#breadcrumb',itemListElement:[
      {'@type':'ListItem',position:1,name:'WINF™',item:'https://winf.com.br/'},
      {'@type':'ListItem',position:2,name:'WINF Select™',item:'https://winf.com.br/aerocore/winf-select/'},
      {'@type':'ListItem',position:3,name:city.city,item:uri}
    ]}
  ]};
  const script='<script type="application/ld+json">'+JSON.stringify(citySchema)+'</script>';
  if(!/<script type="application\/ld\+json">[\s\S]*?<\/script>/.test(html))throw new Error('JSON-LD ausente '+city.city);
  html=html.replace(/<script type="application\/ld\+json">[\s\S]*?<\/script>/,script);
  return html;
}
