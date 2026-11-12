// WINF™ | MediaCar™ — premium 3D studio v2.
// Shared Three.js import map prevents OrbitControls/THREE module duplication.
// Conceptual geometric cars; approved manufacturer meshes can be swapped later.
const root = document.getElementById("mc3dCanvas");
if (root) {
 const status = document.getElementById("mc3dStatus");
 const msg = document.getElementById("mc3dMessage");
 const $ = id => document.getElementById(id);
 const active = (selector, match) => document.querySelectorAll(selector).forEach(el => {
   const yes = match(el);
   el.classList.toggle("is-active", yes);
   if (el.getAttribute("role") === "tab") el.setAttribute("aria-selected", String(yes));
 });
 const tabs = ["vehicle", "paint", "ads", "project"];
 let currentTab = "vehicle";
 function selectTab(tab) {
   if (!tabs.includes(tab)) return;
   currentTab = tab;
   active("[data-mc3d-tab]", el => el.dataset.mc3dTab === tab);
   document.querySelectorAll("[data-mc3d-pane]").forEach(el => el.hidden = el.dataset.mc3dPane !== tab);
   const next = $("mc3dNext");
   if (next) next.innerHTML = tab === "project" ? "Abrir editor comercial <span>↗</span>" : "Continuar <span>→</span>";
 }
 document.querySelectorAll("[data-mc3d-tab]").forEach(el => el.addEventListener("click", () => selectTab(el.dataset.mc3dTab)));
 $("mc3dNext")?.addEventListener("click", () => {
   const index = tabs.indexOf(currentTab);
   if (index < tabs.length-1) { selectTab(tabs[index+1]); return; }
   const details = document.querySelector(".mc3-legacy");
   if (details) { details.open = true; details.scrollIntoView({behavior:"smooth",block:"start"}); }
 });
 try {
   const THREE = await import("three");
   const { OrbitControls } = await import("three/addons/controls/OrbitControls.js");
   const { GLTFLoader } = await import("three/addons/loaders/GLTFLoader.js");
   const scene = new THREE.Scene();
   scene.background = new THREE.Color(0xdde2e8);
   const camera = new THREE.PerspectiveCamera(36, 1, .1, 90);
   camera.position.set(7,3.7,8);
   const renderer = new THREE.WebGLRenderer({antialias:true,alpha:false,powerPreference:"default"});
   renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.65));
   renderer.outputColorSpace = THREE.SRGBColorSpace;
   renderer.toneMapping = THREE.ACESFilmicToneMapping;
   renderer.toneMappingExposure = 1.36;
   renderer.shadowMap.enabled = true;
   renderer.shadowMap.type = THREE.PCFSoftShadowMap;
   renderer.domElement.setAttribute("aria-label", "Visualizador do veículo em 360 graus. Arraste para girar e faça pinça para zoom.");
   root.replaceChildren(renderer.domElement);
   const orbit = new OrbitControls(camera,renderer.domElement);
   orbit.enableDamping = true;orbit.dampingFactor = .078;
   orbit.target.set(0,.9,0);
   orbit.minDistance = 4.3;orbit.maxDistance = 18;
   orbit.minPolarAngle = .06;orbit.maxPolarAngle = Math.PI/2-.025;
   orbit.enablePan = false;
   const hemi = new THREE.HemisphereLight(0xffffff,0x858c94,3.2);scene.add(hemi);
   const key = new THREE.DirectionalLight(0xffffff,3.2);
   key.position.set(3.5,10,5);key.castShadow=true;
   key.shadow.mapSize.set(1024,1024);
   key.shadow.camera.left=-11;key.shadow.camera.right=11;key.shadow.camera.top=11;key.shadow.camera.bottom=-11;
   key.shadow.bias = -.0005;scene.add(key);
   const rim = new THREE.DirectionalLight(0xf5f7fd,2.1);rim.position.set(-7,3,-6);scene.add(rim);
   
   // Immersive showroom: a curved horizon, polished floor and soft contact shadow.
   const backdropCanvas=document.createElement("canvas");
   backdropCanvas.width=16;backdropCanvas.height=512;
   const bg=backdropCanvas.getContext("2d");
   const fade=bg.createLinearGradient(0,0,0,512);
   fade.addColorStop(0,"#d5dae2");fade.addColorStop(.55,"#e9ebef");fade.addColorStop(.73,"#f6f7f8");fade.addColorStop(1,"#e2e5e8");
   bg.fillStyle=fade;bg.fillRect(0,0,16,512);
   const backdropTexture=new THREE.CanvasTexture(backdropCanvas);backdropTexture.colorSpace=THREE.SRGBColorSpace;
   const backdrop=new THREE.Mesh(new THREE.CylinderGeometry(19,19,22,64,1,true),new THREE.MeshBasicMaterial({map:backdropTexture,side:THREE.BackSide,depthWrite:false}));
   backdrop.position.y=8;scene.add(backdrop);
   const ground = new THREE.Mesh(new THREE.PlaneGeometry(200,200),new THREE.MeshPhysicalMaterial({color:0xe8eaee,roughness:.33,metalness:.12,clearcoat:.45,clearcoatRoughness:.30}));
   ground.rotation.x=-Math.PI/2;ground.position.y=-.02;ground.receiveShadow=true;scene.add(ground);
   const shadowCanvas=document.createElement("canvas");shadowCanvas.width=256;shadowCanvas.height=256;
   const sx=shadowCanvas.getContext("2d"),sg=sx.createRadialGradient(128,128,8,128,128,124);
   sg.addColorStop(0,"rgba(30,40,48,.35)");sg.addColorStop(.6,"rgba(30,40,48,.10)");sg.addColorStop(1,"rgba(30,40,48,0)");
   sx.fillStyle=sg;sx.fillRect(0,0,256,256);
   const contactShadow=new THREE.Mesh(new THREE.PlaneGeometry(8,6.5),new THREE.MeshBasicMaterial({map:new THREE.CanvasTexture(shadowCanvas),transparent:true,depthWrite:false}));
   contactShadow.rotation.x=-Math.PI/2;contactShadow.position.y=.004;scene.add(contactShadow);

   const paint = new THREE.MeshPhysicalMaterial({color:"#101820",metalness:.48,roughness:.18,clearcoat:1,clearcoatRoughness:.11});
   const glass = new THREE.MeshPhysicalMaterial({color:0x273b49,metalness:.32,roughness:.17,transparent:true,opacity:.79,depthWrite:false});
   const trim = new THREE.MeshStandardMaterial({color:0x131619,metalness:.2,roughness:.6});
   const tire = new THREE.MeshStandardMaterial({color:0x131617,metalness:.05,roughness:.9});
   const rimMat = new THREE.MeshStandardMaterial({color:0x879199,metalness:.83,roughness:.19});
   const frontLight = new THREE.MeshStandardMaterial({color:0xf4f9fc,emissive:0xb0cadd,emissiveIntensity:.7});
   const rearLight = new THREE.MeshStandardMaterial({color:0x970a15,emissive:0x9a0611,emissiveIntensity:.55});
   const templateMat = new THREE.MeshBasicMaterial({color:0x151a1e,transparent:true,opacity:.6,side:THREE.DoubleSide});
   let car=null,carBody=null,bodyInfo=null;
   let activeImported=null,importToken=0,importPaint=[],importGlass=[];
   const loader=new GLTFLoader();
   const assetBase="https://cdn.jsdelivr.net/gh/pedrosoandre/carros@2d18dfd9db96bbf0d9cffa949deaf7f571388cbf/assets/";
   const models={
     coupe:{name:"Porsche 911 C4S",file:"porsche-911-c4s.glb",author:"JK3Dstudios",source:"https://sketchfab.com/3d-models/none-ee69c474a1cc4085944cde4cb7ae87db",paint:null},
     sedan:{name:"BMW M4 CSL",file:"bmw-m4-csl.glb",author:"Black Snow",source:"https://sketchfab.com/3d-models/none-26d05968e63b4fc28205cbb9abb0ea41",paint:null},
     suv:{name:"Volvo XC90",file:"volvo-xc90.glb",author:"Spiicy",source:"https://github.com/pedrosoandre/carros/blob/main/CREDITS.md",paint:["Material_0"]},
     van:{name:"Mercedes-Benz Sprinter",file:"mercedes-benz-sprinter.glb",author:"Savelliy 07",source:"https://github.com/pedrosoandre/carros/blob/main/CREDITS.md",paint:["Color_A10"]}
   };
   function setSource(model,loaded){
     const el=$("mc3dSource"),meta=models[model];
     if(!el||!meta)return;
     const line=loaded?"3D detalhado • arte original: ":"Prévia geométrica • modelo detalhado indisponível • crédito: ";
     const link=document.createElement("a");
     link.href=meta.source;link.target="_blank";link.rel="noopener noreferrer";link.textContent=meta.author+" ↗";
     const license=document.createElement("a");
     license.href="https://creativecommons.org/licenses/by/4.0/";
     license.target="_blank";license.rel="noopener noreferrer";license.textContent="CC BY 4.0";
     el.replaceChildren(document.createTextNode(line),link,document.createTextNode(" · "),license);
   }
   function applyImportedMaterials(){
     for(const mat of importPaint){mat.color?.set(config.color);mat.roughness=config.finish==="matte"?.83:.27;mat.metalness=config.finish==="metallic"?.73:.4;mat.needsUpdate=true}
     const tint={clear:{c:"#677781",o:.30},medium:{c:"#1b2b35",o:.64},dark:{c:"#081218",o:.90}}[config.tintPreset];
     for(const mat of importGlass){mat.transparent=true;mat.depthWrite=false;mat.opacity=tint.o;mat.color?.set(tint.c);mat.needsUpdate=true}
   }
   function loadDetailedModel(kind){
     const serial=++importToken,meta=models[kind];
     setSource(kind,false);
     status.textContent="Carregando "+meta.name+" em 3D…";
     loader.load(assetBase+meta.file,gltf=>{
       if(serial!==importToken)return;
       try{
         const model=gltf.scene;
         const rawBox=new THREE.Box3().setFromObject(model);
         const dims=new THREE.Vector3();rawBox.getSize(dims);
         if(dims.x>dims.z*1.14)model.rotation.y=Math.PI/2;
         model.updateMatrixWorld(true);
         const orientedBox=new THREE.Box3().setFromObject(model);
         const size=new THREE.Vector3();orientedBox.getSize(size);
         if(Math.max(size.x,size.z)<.01)throw Error("Geometria 3D vazia");
         const scale=(kind==="van"?5.8:kind==="suv"?5.0:4.75)/Math.max(size.x,size.z);
         model.scale.multiplyScalar(scale);
         model.updateMatrixWorld(true);
         const finalBox=new THREE.Box3().setFromObject(model);
         const min=finalBox.min,max=finalBox.max;
         model.position.set(-(min.x+max.x)/2,-min.y+.035,-(min.z+max.z)/2);
         model.updateMatrixWorld(true);
         const bounded=new THREE.Box3().setFromObject(model),width=bounded.max.x-bounded.min.x,length=bounded.max.z-bounded.min.z,height=bounded.max.y-bounded.min.y;
         // Only replace the procedural fallback after the real model is ready.
         if(car){scene.remove(car);car.traverse(o=>{if(o.geometry)o.geometry.dispose()})}
         car=new THREE.Group();carBody=new THREE.Group();scene.add(car);car.add(carBody);carBody.add(model);
         activeImported=model;importPaint=[];importGlass=[];
         const paintedNames=(meta.paint||[]).map(s=>s.toLowerCase());
         model.traverse(node=>{
           if(!node.isMesh)return;
           node.castShadow=true;node.receiveShadow=true;
           const mats=Array.isArray(node.material)?node.material:[node.material];
           const copy=mats.map(m=>m?.clone?.()||m);
           node.material=Array.isArray(node.material)?copy:copy[0];
           for(const mat of copy){
             if(!mat)return;
             const name=((mat.name||"")+" "+(node.name||"")).toLowerCase();
             if(/glass|window|windshield|windscreen|vidro|parabrisa/.test(name))importGlass.push(mat);
             else if(paintedNames.some(x=>name.includes(x))||/car.?paint|body.?paint|carroceria|exterior.?paint/.test(name))importPaint.push(mat);
           }
         });
         const y=Math.min(.95,Math.max(.65,height*.56));
         bodyInfo=[width,length,y,height];
         addBrands(width,length,y,height);
         renderSponsors();
         applyImportedMaterials();
         setSource(kind,true);
         status.textContent=meta.name+" · showroom 360°";
       }catch(err){console.error("[MediaCar] GLB",err);build(kind,true);status.textContent="Prévia 3D simplificada disponível";}
     },undefined,error=>{
       if(serial!==importToken)return;
       console.warn("[MediaCar] 3D download failed",error);
       setSource(kind,false);status.textContent="Usando prévia 3D enquanto o modelo detalhado não carrega.";
     });
   }

   let config={model:"coupe",color:"#101820",finish:"gloss",tintPreset:"medium",camera:[7,3.7,8],slots:{}};
   const id = v => typeof v==="string" && /^[a-z0-9-]{1,25}$/.test(v);
   const validSlot = v => ["left","right","rear","roof"].includes(v);
   const modelInput=$("mc3dModel"),colorInput=$("mc3dColor"),finishInput=$("mc3dFinish");
   const slotInput=$("mc3dSlotSelect"),sponsorName=$("mc3dSponsorName"),sponsorFile=$("mc3dSponsorFile");
   const sponsorSurfaces={};
   const box=(group,w,h,d,x,y,z,mat)=>{
     const mesh=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),mat);
     mesh.position.set(x,y,z);mesh.castShadow=true;mesh.receiveShadow=true;group.add(mesh);return mesh;
   };
   function labelTexture(str,accent=false) {
     const canvas=document.createElement("canvas");canvas.width=1024;canvas.height=256;
     const cx=canvas.getContext("2d");cx.clearRect(0,0,1024,256);
     cx.fillStyle=accent?"#b6c5a8":"#ffffff";
     cx.textAlign="center";cx.textBaseline="middle";
     cx.font="700 150px Arial, sans-serif";cx.fillText(str,512,128,978);
     const tex=new THREE.CanvasTexture(canvas);tex.colorSpace=THREE.SRGBColorSpace;tex.anisotropy=4;return tex;
   }
   function logoPlate(texture,w,h,x,y,z,rotY=0,rotX=0){
     const mesh=new THREE.Mesh(new THREE.PlaneGeometry(w,h),new THREE.MeshBasicMaterial({map:texture,transparent:true,side:THREE.DoubleSide,depthWrite:false,polygonOffset:true,polygonOffsetFactor:-1}));
     mesh.position.set(x,y,z);mesh.rotation.set(rotX,rotY,0);carBody.add(mesh);return mesh;
   }
   let officialLogoTexture=null;
   async function loadOfficialLogo() {
     const src="/briefing/media/winf-logo-black-official.png";
     return new Promise(resolve=>{
       const im=new Image();im.onload=()=>{
         try {
           const canvas=document.createElement("canvas");canvas.width=768;canvas.height=256;
           const c=canvas.getContext("2d",{willReadFrequently:true});c.clearRect(0,0,768,256);
           const scale=Math.min(740/im.width,224/im.height);
           const w=im.width*scale,h=im.height*scale;c.drawImage(im,(768-w)/2,(256-h)/2,w,h);
           const data=c.getImageData(0,0,768,256),p=data.data;
           // Keep the original logo geometry; convert monochrome black mark into a white vehicle decal.
           for(let i=0;i<p.length;i+=4){
             if(p[i+3]===0)continue;
             const darkness=1-((p[i]+p[i+1]+p[i+2])/765);
             const a=Math.round(p[i+3]*Math.max(0,Math.min(1,(darkness-.13)*1.6)));
             p[i]=248;p[i+1]=249;p[i+2]=250;p[i+3]=a;
           }
           c.putImageData(data,0,0);
           const tex=new THREE.CanvasTexture(canvas);tex.colorSpace=THREE.SRGBColorSpace;tex.anisotropy=4;resolve(tex);
         }catch(_){resolve(labelTexture("WINF"))}
       };im.onerror=()=>resolve(labelTexture("WINF"));im.src=src;
     });
   }
   const brandLabels={
     select:labelTexture("WINF SELECT"),aero:labelTexture("AeroCore"),
     neo:labelTexture("NeoSkin"),number:labelTexture("08")
   };
   function addBrands(w,l,y,roofY) {
     const official=officialLogoTexture||labelTexture("WINF");
     // Main WINF identity: bonnet and front door, both sides.
     logoPlate(official,1.4,.39,0,y+.43,l*.30,0,-Math.PI/2);
     for(const side of [-1,1]){
       const xx=side*(w/2+.028),rot=side*Math.PI/2;
       logoPlate(official,1.16,.35,xx,y+.14,l*.17,rot);
       logoPlate(brandLabels.aero,.83,.23,xx,y+.28,-l*.17,rot);
       logoPlate(brandLabels.neo,.83,.20,xx,y+.055,-l*.17,rot);
       logoPlate(brandLabels.number,.40,.25,xx,y+.14,-l*.34,rot);
     }
     logoPlate(brandLabels.select,.80,.22,0,roofY+.08,.15,0,-Math.PI/2);
   }
   function surfaceFor(slot,w,l,y,roofY) {
     if(slot==="left") return {pos:[-w/2-.043,y-.11,l*.03],rotation:[0,-Math.PI/2,0],size:[.80,.25]};
     if(slot==="right")return {pos:[w/2+.043,y-.11,l*.03],rotation:[0,Math.PI/2,0],size:[.80,.25]};
     if(slot==="rear") return {pos:[0,y+.10,-l/2-.105],rotation:[0,Math.PI,0],size:[.88,.27]};
     return {pos:[0,roofY+.085,-.35],rotation:[-Math.PI/2,0,0],size:[1.10,.65]};
   }
   function renderSponsors(){
     Object.values(sponsorSurfaces).forEach(mesh=>{carBody.remove(mesh);mesh.geometry.dispose();mesh.material.map?.dispose();mesh.material.dispose()});
     Object.keys(sponsorSurfaces).forEach(k=>delete sponsorSurfaces[k]);
     if(!bodyInfo)return;
     for(const key of ["left","right","rear","roof"]){
       const s=surfaceFor(key,...bodyInfo);
       const assigned=config.slots[key];
       const empty=!assigned;
       const mesh=new THREE.Mesh(new THREE.PlaneGeometry(s.size[0],s.size[1]),empty?templateMat:new THREE.MeshBasicMaterial({map:labelTexture(assigned.name||"PATROCINADOR"),transparent:true,side:THREE.DoubleSide,depthWrite:false}));
       mesh.position.set(...s.pos);mesh.rotation.set(...s.rotation);
       mesh.userData.slot=key;carBody.add(mesh);sponsorSurfaces[key]=mesh;
       if(empty){mesh.material=new THREE.MeshBasicMaterial({color:0xa9b2ba,transparent:true,opacity:.11,side:THREE.DoubleSide,depthWrite:false});}
       if(assigned?.image){
         const img=new Image();
         img.onload=()=>{
           if(sponsorSurfaces[key]!==mesh)return;
           const tex=new THREE.Texture(img);tex.needsUpdate=true;tex.colorSpace=THREE.SRGBColorSpace;
           mesh.material.dispose();mesh.material=new THREE.MeshBasicMaterial({map:tex,transparent:true,side:THREE.DoubleSide,depthWrite:false});
         };
         img.src=assigned.image;
       }
     }
     const list=$("mc3dSlotList");
     if(list)list.replaceChildren(...Object.entries({left:"Lateral esquerda",right:"Lateral direita",rear:"Traseira",roof:"Teto"}).map(([key,title])=>{
       const el=document.createElement("span");if(config.slots[key])el.className="mc3-taken";
       el.textContent=title+" · "+(config.slots[key]?.name||"disponível");return el;
     }));
   }
   function build(model,skipDownload=false){
     if(!skipDownload)importToken++;
     activeImported=null;importPaint=[];importGlass=[];
     if(car){scene.remove(car);car.traverse(o=>{if(o.geometry)o.geometry.dispose()})}
     const van=model==="van",suv=model==="suv",sedan=model==="sedan";
     const l=van?6.15:suv?5.2:sedan?5.05:4.75;
     const w=van?2.05:1.98;
     const y=van?1.07:suv?.96:.83;
     const roofY=van?2.73:suv?1.91:sedan?1.56:1.44;
     car=new THREE.Group();carBody=new THREE.Group();car.add(carBody);scene.add(car);
     bodyInfo=[w,l,y,roofY];
     // Smooth-edged shell; original manufacturer models are a separate asset tier.
     const shape=new THREE.Shape();
     shape.moveTo(-w*.47,y-.24);shape.quadraticCurveTo(-w*.51,y-.20,-w*.50,y-.08);
     shape.lineTo(-w*.50,y+.17);shape.quadraticCurveTo(-w*.48,y+.27,-w*.38,y+.30);
     shape.lineTo(w*.38,y+.30);shape.quadraticCurveTo(w*.48,y+.27,w*.50,y+.17);
     shape.lineTo(w*.50,y-.08);shape.quadraticCurveTo(w*.51,y-.20,w*.47,y-.24);shape.closePath();
     const bodyGeometry=new THREE.ExtrudeGeometry(shape,{depth:l-.12,steps:1,bevelEnabled:true,bevelSegments:3,bevelThickness:.065,bevelSize:.065,curveSegments:5});
     const bodyMesh=new THREE.Mesh(bodyGeometry,paint);bodyMesh.position.z=-(l-.12)/2;bodyMesh.castShadow=true;bodyMesh.receiveShadow=true;carBody.add(bodyMesh);
     const cabLen=van?l*.67:suv?l*.59:sedan?l*.53:l*.45, cabZ=van?-.24:-.20;
     const cabHeight=roofY-y-.27, cabCenter=y+.26+cabHeight/2;
     const cab=box(carBody,w*.83,cabHeight,cabLen,0,cabCenter,cabZ,glass);
     cab.castShadow=false;cab.material=glass;
     box(carBody,w*.86,.095,cabLen,0,roofY-.05,cabZ,paint);
     for(const side of [-1,1]){
       const x=side*w*.435;
       box(carBody,.075,cabHeight,.085,x,cabCenter,cabZ-cabLen*.47,paint);
       box(carBody,.075,cabHeight,.085,x,cabCenter,cabZ+cabLen*.47,paint);
       if(van||suv||sedan)box(carBody,.055,cabHeight,.07,x,cabCenter,cabZ,paint);
       box(carBody,.16,.095,.32,side*w*.55,y+.46,cabZ+cabLen*.39,paint);
     }
     box(carBody,w*.90,.16,.12,0,y-.09,l/2+.035,trim);
     box(carBody,w*.91,.18,.12,0,y-.08,-l/2-.035,trim);
     for(const side of [-1,1]){
       box(carBody,.37,.075,.04,side*w*.36,y+.19,l/2+.085,frontLight);
       box(carBody,.40,.07,.04,side*w*.35,y+.20,-l/2-.085,rearLight);
     }
     const wheelZ=l*.33;
     for(const z of [-wheelZ,wheelZ])for(const side of [-1,1]){
       const x=side*(w/2+.075),centerY=.465;
       const wheel=new THREE.Mesh(new THREE.CylinderGeometry(.44,.44,.29,40),tire);
       wheel.rotation.z=Math.PI/2;wheel.position.set(x,centerY,z);wheel.castShadow=true;car.add(wheel);
       const rim=new THREE.Mesh(new THREE.CylinderGeometry(.265,.265,.31,32),rimMat);
       rim.rotation.z=Math.PI/2;rim.position.set(x,centerY,z);car.add(rim);
       const hub=new THREE.Mesh(new THREE.CylinderGeometry(.10,.10,.33,16),trim);
       hub.rotation.z=Math.PI/2;hub.position.set(x,centerY,z);car.add(hub);
       for(let n=0;n<8;n++){
         const a=n*Math.PI/4;box(car,.04,.21,.035,x+side*.17,centerY+.14*Math.cos(a),z+.14*Math.sin(a),rimMat).rotation.x=a;
       }
     }
     addBrands(w,l,y,roofY);renderSponsors();refreshUi();
     status.textContent="Preparando "+models[model].name+"…";
     if(!skipDownload)loadDetailedModel(model);
   }
   function finish(){
     paint.color.set(config.color);
     paint.roughness=config.finish==="matte"?.82:config.finish==="metallic"?.25:.15;
     paint.metalness=config.finish==="metallic"?.76:.4;
     paint.clearcoat=config.finish==="matte"?0:1;
     const t={clear:{c:0x718b97,o:.48},medium:{c:0x263845,o:.81},dark:{c:0x071017,o:.97}}[config.tintPreset]||{c:0x263845,o:.81};
     glass.color.set(t.c);glass.opacity=t.o;glass.needsUpdate=true;
     applyImportedMaterials();refreshUi();
   }
   function refreshUi(){
     active("[data-mc3d-model]",el=>el.dataset.mc3dModel===config.model);
     active("[data-mc3d-color]",el=>el.dataset.mc3dColor===config.color);
     active("[data-mc3d-tint]",el=>el.dataset.mc3dTint===config.tintPreset);
     active("[data-mc3d-finish]",el=>el.dataset.mc3dFinish===config.finish);
   }
   function setView(v){
     const points={perspective:[7,3.7,8],front:[0,2.1,9],rear:[0,2.1,-9],left:[-9,2.1,.02],right:[9,2.1,.02],roof:[.015,10,.015]};
     if(!points[v])return;
     orbit.target.set(0,.9,0);camera.position.set(...points[v]);orbit.update();
     active("[data-mc3d-view]",el=>el.dataset.mc3dView===v);
   }
   document.querySelectorAll("[data-mc3d-view]").forEach(el=>el.addEventListener("click",()=>setView(el.dataset.mc3dView)));
   $("mc3dReset")?.addEventListener("click",()=>setView("perspective"));
   function changeModel(m){if(!["coupe","sedan","suv","van"].includes(m))return;config.model=m;modelInput.value=m;build(m)}
   document.querySelectorAll("[data-mc3d-model]").forEach(el=>el.addEventListener("click",()=>changeModel(el.dataset.mc3dModel)));
   modelInput.addEventListener("change",()=>changeModel(modelInput.value));
   document.querySelectorAll("[data-mc3d-color]").forEach(el=>el.addEventListener("click",()=>{config.color=el.dataset.mc3dColor;colorInput.value=config.color;finish()}));
   colorInput.addEventListener("input",()=>{config.color=colorInput.value;finish()});
   document.querySelectorAll("[data-mc3d-tint]").forEach(el=>el.addEventListener("click",()=>{config.tintPreset=el.dataset.mc3dTint;finish()}));
   document.querySelectorAll("[data-mc3d-finish]").forEach(el=>el.addEventListener("click",()=>{config.finish=el.dataset.mc3dFinish;finishInput.value=config.finish;finish()}));
   finishInput.addEventListener("change",()=>{config.finish=finishInput.value;finish()});
   async function imageToData(file){
     if(!file||!["image/png","image/webp"].includes(file.type))throw Error("Selecione um arquivo PNG ou WEBP.");
     if(file.size>2_000_000)throw Error("A imagem deve ter até 2 MB.");
     const objectUrl=URL.createObjectURL(file);
     try{
       const im=await new Promise((resolve,reject)=>{const img=new Image();img.onload=()=>resolve(img);img.onerror=()=>reject(Error("Imagem inválida"));img.src=objectUrl});
       const canvas=document.createElement("canvas"),max=512,scale=Math.min(1,max/Math.max(im.naturalWidth,im.naturalHeight));
       canvas.width=Math.max(1,Math.round(im.naturalWidth*scale));canvas.height=Math.max(1,Math.round(im.naturalHeight*scale));
       canvas.getContext("2d").drawImage(im,0,0,canvas.width,canvas.height);
       const data=canvas.toDataURL("image/png");
       if(data.length>140000)throw Error("Logo muito detalhada. Envie um PNG mais leve.");
       return data;
     }finally{URL.revokeObjectURL(objectUrl)}
   }
   async function applySponsor(){
     const slot=slotInput.value,name=sponsorName.value.trim().slice(0,60),file=sponsorFile.files?.[0];
     if(!validSlot(slot))throw Error("Selecione uma cota válida.");
     if(!name)throw Error("Informe o nome do patrocinador.");
     const image=file?await imageToData(file):config.slots[slot]?.image||null;
     config.slots[slot]={name,image};
     renderSponsors();status.textContent=name+" aplicada à cota "+slot+".";
   }
   $("mc3dSponsorApply")?.addEventListener("click",()=>applySponsor().catch(e=>status.textContent=e.message));
   $("mc3dSponsorRemove")?.addEventListener("click",()=>{delete config.slots[slotInput.value];renderSponsors();status.textContent="Cota liberada."});
   slotInput?.addEventListener("change",()=>{const data=config.slots[slotInput.value];sponsorName.value=data?.name||"";sponsorFile.value=""});
   const localKey="winf-mediacar-3d-device-v2";
   function snapshot(){return JSON.parse(JSON.stringify({...config,camera:[camera.position.x,camera.position.y,camera.position.z]}))}
   function restore(state){
     if(!state||!["coupe","sedan","suv","van"].includes(state.model)||typeof state.color!=="string"||!/^#[a-fA-F0-9]{6}$/.test(state.color))throw Error("Projeto 3D inválido");
     config={model:state.model,color:state.color,finish:["gloss","matte","metallic"].includes(state.finish)?state.finish:"gloss",tintPreset:["clear","medium","dark"].includes(state.tintPreset)?state.tintPreset:"medium",slots:{},camera:[7,3.7,8]};
     if(state.slots&&typeof state.slots==="object")for(const s of ["left","right","rear","roof"]){
       const item=state.slots[s];if(item&&typeof item.name==="string"&&item.name.length<=60)config.slots[s]={name:item.name,image:typeof item.image==="string"&&item.image.startsWith("data:image/png;base64,")&&item.image.length<=140000?item.image:null};
     }
     modelInput.value=config.model;colorInput.value=config.color;finishInput.value=config.finish;
     build(config.model);finish();
     if(Array.isArray(state.camera)&&state.camera.length===3&&state.camera.every(n=>typeof n==="number"&&Number.isFinite(n)&&Math.abs(n)<100)){camera.position.set(...state.camera);orbit.update()}
   }
   $("mc3dSaveDevice")?.addEventListener("click",()=>{try{localStorage.setItem(localKey,JSON.stringify(snapshot()));status.textContent="Projeto salvo neste aparelho."}catch(e){status.textContent="Não foi possível salvar. Reduza o tamanho das logos."}});
   $("mc3dLoadDevice")?.addEventListener("click",()=>{try{const s=JSON.parse(localStorage.getItem(localKey)||"null");if(!s)throw Error("Nenhum projeto local salvo.");restore(s);status.textContent="Projeto recuperado."}catch(e){status.textContent=e.message}});
   window.MediaCar3D={get:snapshot,set:restore,setView,selectTab};
   officialLogoTexture=await loadOfficialLogo();
   build(config.model);finish();
   const observer=new ResizeObserver(()=>{
     const w=root.clientWidth,h=root.clientHeight;if(!w||!h)return;
     camera.aspect=w/h;camera.updateProjectionMatrix();renderer.setSize(w,h,false);
   });observer.observe(root);
   let running=true;
   function draw(){if(!running)return;requestAnimationFrame(draw);orbit.update();renderer.render(scene,camera)}
   draw();
   window.addEventListener("pagehide",()=>{running=false;observer.disconnect();orbit.dispose();renderer.dispose()},{once:true});
 } catch(error) {
   if(msg)msg.textContent="Não foi possível iniciar o 3D. Verifique o navegador, a conexão e o WebGL.";
   if(status)status.textContent="Visualizador 3D indisponível.";
   console.error("[MediaCar 3D]",error);
 }
}
