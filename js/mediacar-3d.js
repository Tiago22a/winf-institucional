// MediaCar™ 3D configurator — procedural geometry, not OEM vehicle models.
// Three.js ES modules + OrbitControls; no tracking, credentials, or remote project writes.
const root=document.getElementById("mc3dCanvas");
if(root){
const message=document.getElementById("mc3dMessage");
const status=document.getElementById("mc3dStatus");
try{
 const THREE=await import("https://esm.sh/three@0.169.0?bundle");
 const {OrbitControls}=await import("https://esm.sh/three@0.169.0/examples/jsm/controls/OrbitControls.js?bundle");
 const scene=new THREE.Scene();scene.background=new THREE.Color(0x0a1016);
 const camera=new THREE.PerspectiveCamera(36,1,.1,100);camera.position.set(7,4.2,8.8);
 const renderer=new THREE.WebGLRenderer({antialias:true,alpha:false,powerPreference:"high-performance"});
 renderer.setPixelRatio(Math.min(window.devicePixelRatio||1,2));
 renderer.shadowMap.enabled=true;renderer.shadowMap.type=THREE.PCFSoftShadowMap;
 renderer.outputColorSpace=THREE.SRGBColorSpace;
 root.replaceChildren(renderer.domElement);
 renderer.domElement.setAttribute("aria-label","Carro 3D. Arraste para girar e use dois dedos para aproximar.");
 const controls=new OrbitControls(camera,renderer.domElement);controls.enableDamping=true;controls.dampingFactor=.075;controls.minDistance=5;controls.maxDistance=18;controls.maxPolarAngle=Math.PI*.49;controls.target.set(0,.75,0);
 scene.add(new THREE.HemisphereLight(0xd9e9ff,0x25313a,2.2));
 const key=new THREE.DirectionalLight(0xffffff,3);key.position.set(4,9,6);key.castShadow=true;key.shadow.mapSize.set(1024,1024);key.shadow.camera.left=-9;key.shadow.camera.right=9;key.shadow.camera.top=9;key.shadow.camera.bottom=-9;scene.add(key);
 const rim=new THREE.DirectionalLight(0xd9ff40,1.2);rim.position.set(-5,3,-5);scene.add(rim);
 const ground=new THREE.Mesh(new THREE.PlaneGeometry(200,200),new THREE.MeshStandardMaterial({color:0x111a20,roughness:.78}));ground.rotation.x=-Math.PI/2;ground.receiveShadow=true;scene.add(ground);
 const grid=new THREE.GridHelper(24,24,0x344735,0x202a31);grid.position.y=.007;scene.add(grid);
 const paint=new THREE.MeshPhysicalMaterial({color:0x101820,metalness:.3,roughness:.22,clearcoat:1,clearcoatRoughness:.1});
 const glass=new THREE.MeshPhysicalMaterial({color:0x122733,metalness:.3,roughness:.1,transparent:true,opacity:.86});
 const black=new THREE.MeshStandardMaterial({color:0x080b10,roughness:.8});
 const rubber=new THREE.MeshStandardMaterial({color:0x0c1015,roughness:.95});
 const silver=new THREE.MeshStandardMaterial({color:0x9ca8ae,metalness:.9,roughness:.22});
 const lime=new THREE.MeshStandardMaterial({color:0xcfff30,emissive:0x364500,emissiveIntensity:.22});
 const white=new THREE.MeshStandardMaterial({color:0xf2f8ff,emissive:0xb5d9ff,emissiveIntensity:.45});
 const red=new THREE.MeshStandardMaterial({color:0xb90016,emissive:0x6a0010,emissiveIntensity:.5});
 let car, bodyGroup, wheelHubs=[];
 let heightPreset="low",wheelPreset="sport",tintPreset="medium";
 const hubMaterial=new THREE.MeshStandardMaterial({color:0x828c93,metalness:.85,roughness:.28});
 function applyHeight(){if(bodyGroup)bodyGroup.position.y=({extreme:-.29,low:-.15,stock:0})[heightPreset]||0;}
 function applyTint(){const cfg={clear:{color:0x718b9a,opacity:.42},medium:{color:0x273b49,opacity:.78},dark:{color:0x080e14,opacity:.97}}[tintPreset];glass.color.set(cfg.color);glass.opacity=cfg.opacity;glass.needsUpdate=true;}
 function applyWheels(){hubMaterial.color.set(({sport:0x828c93,dark:0x161c21,original:0xadb4b7})[wheelPreset]);wheelHubs.forEach(h=>h.scale.set(wheelPreset==="sport"?1.1:wheelPreset==="dark" ? .92 : 1,1,1));}
 function box(group,w,h,d,x,y,z,material,bevel=0){
  let geometry=new THREE.BoxGeometry(w,h,d);
  if(bevel){geometry=new THREE.BoxGeometry(w,h,d)}
  const mesh=new THREE.Mesh(geometry,material);mesh.position.set(x,y,z);mesh.castShadow=true;mesh.receiveShadow=true;group.add(mesh);return mesh;
 }
 function build(model){
  if(car){scene.remove(car);car.traverse(o=>{if(o.geometry)o.geometry.dispose()})}
  car=new THREE.Group();scene.add(car);bodyGroup=new THREE.Group();car.add(bodyGroup);wheelHubs=[];adPlanes=[];
  const suv=model==="suv",van=model==="van",sedan=model==="sedan";
  const length=van?6.1:suv?5.25:sedan?5.05:4.7;
  const width=van?2.12:2.02;
  const chassisY=van?1.05:suv?.93:.77;
  const height=van?2.65:suv?1.82:sedan?1.49:1.31;
  const front=length/2;
  // Longitudinal axis is Z; front is +Z.
  box(bodyGroup,width,.42,length,0,chassisY,0,paint);
  box(bodyGroup,width*.95,.12,length*.95,0,chassisY-.27,0,black);
  const cabLen=van?length*.72:suv?length*.65:sedan?length*.55:length*.48;
  const cabZ=van?-.2:suv?-.2:sedan?-.25:-.22;
  const cabY=chassisY+.21+(height-chassisY-.28)/2;
  box(bodyGroup,width*.83,height-chassisY-.28,cabLen,0,cabY,cabZ,glass);
  box(bodyGroup,width*.86,.1,cabLen,0,height-.05,cabZ,paint);
  // Roof edge and window pillars.
  for(const x of [-width*.43,width*.43]){
   box(bodyGroup,.075,height-chassisY-.05,.09,x,(height+chassisY)/2,cabZ-cabLen*.48,paint);
   box(bodyGroup,.075,height-chassisY-.05,.09,x,(height+chassisY)/2,cabZ+cabLen*.48,paint);
   if(suv||van||sedan)box(bodyGroup,.06,height-chassisY-.08,.08,x,(height+chassisY)/2,cabZ,paint);
  }
  // Hood, bumpers, glass bands, lights.
  box(bodyGroup,width*.94,.18,Math.max(.25,front-(cabZ+cabLen/2)),0,chassisY+.22,(front+cabZ+cabLen/2)/2,paint);
  box(bodyGroup,width*.91,.17,.17,0,chassisY-.1,front+.04,black);
  box(bodyGroup,width*.91,.17,.17,0,chassisY-.1,-front-.04,black);
  for(const x of [-width*.36,width*.36]){
   box(bodyGroup,.3,.09,.035,x,chassisY+.19,front+.06,white);
   box(bodyGroup,.34,.09,.035,x,chassisY+.19,-front-.06,red);
   box(bodyGroup,.09,.06,.4,x+Math.sign(x)*.1,chassisY+.4,.4,lime);
  }
  // Wheels: axle perpendicular to Z, spin around X.
  const wheelZ=length*.32;
  for(const z of [-wheelZ,wheelZ])for(const side of [-1,1]){
   const wheel=new THREE.Mesh(new THREE.CylinderGeometry(.43,.43,.26,32),rubber);
   wheel.rotation.z=Math.PI/2;wheel.position.set(side*(width/2+.07),.46,z);wheel.castShadow=true;car.add(wheel);
   const hub=new THREE.Mesh(new THREE.CylinderGeometry(.24,.24,.275,24),hubMaterial);wheelHubs.push(hub);
   hub.rotation.z=Math.PI/2;hub.position.copy(wheel.position);car.add(hub);
   const center=new THREE.Mesh(new THREE.CylinderGeometry(.09,.09,.29,16),black);
   center.rotation.z=Math.PI/2;center.position.copy(wheel.position);car.add(center);
  }
  // MediaCar 08 marker (3D plaque, no fabricated manufacturer logos).
  const canvas=document.createElement("canvas");canvas.width=512;canvas.height=256;
  const ctx=canvas.getContext("2d");ctx.fillStyle="#0b1117";ctx.fillRect(0,0,512,256);
  ctx.fillStyle="#d9ff3b";ctx.font="bold 144px Arial";ctx.textAlign="center";ctx.fillText("08",256,170);
  const texture=new THREE.CanvasTexture(canvas);texture.colorSpace=THREE.SRGBColorSpace;
  const plaque=new THREE.Mesh(new THREE.PlaneGeometry(.82,.41),new THREE.MeshBasicMaterial({map:texture,side:THREE.DoubleSide}));
  plaque.position.set(-width/2-.014,chassisY+.17,-.4);plaque.rotation.y=-Math.PI/2;bodyGroup.add(plaque);
  const plaqueOther=plaque.clone();plaqueOther.position.x=width/2+.014;plaqueOther.rotation.y=Math.PI/2;bodyGroup.add(plaqueOther);
  applyAd(adText);applyHeight();applyTint();applyWheels();syncUi();status.textContent="Modelo conceitual 3D · "+({coupe:"Coupé",sedan:"Sedã",suv:"SUV",van:"Van"}[model]);
 }
 const modelInput=document.getElementById("mc3dModel"),colorInput=document.getElementById("mc3dColor"),finishInput=document.getElementById("mc3dFinish");
 const adInput=document.getElementById("mc3dAdText");
 let adText="MEDIACAR";
 let adPlanes=[];
 function applyAd(value){
  adText=(value||"").trim().slice(0,22);
  adPlanes.forEach(mesh=>{bodyGroup.remove(mesh);mesh.geometry.dispose();mesh.material.map?.dispose();mesh.material.dispose()});adPlanes=[];
  if(!adText)return;
  const canvas=document.createElement("canvas");canvas.width=1024;canvas.height=256;
  const ctx=canvas.getContext("2d");ctx.clearRect(0,0,1024,256);
  ctx.fillStyle="#e1ff4c";ctx.fillRect(0,0,1024,256);
  ctx.fillStyle="#101820";ctx.textAlign="center";ctx.textBaseline="middle";ctx.font="bold 100px Arial";ctx.fillText(adText,512,128,960);
  const texture=new THREE.CanvasTexture(canvas);texture.colorSpace=THREE.SRGBColorSpace;
  for(const side of [-1,1]){
   const plane=new THREE.Mesh(new THREE.PlaneGeometry(2.1,.52),new THREE.MeshBasicMaterial({map:texture,side:THREE.DoubleSide,transparent:true}));
   plane.position.set(side*1.025,.88,0);plane.rotation.y=side*Math.PI/2;bodyGroup.add(plane);adPlanes.push(plane);
  }
 }
 document.querySelectorAll("[data-mc3d-tab]").forEach(btn=>btn.addEventListener("click",()=>{
  document.querySelectorAll("[data-mc3d-tab]").forEach(el=>{const active=el===btn;el.classList.toggle("is-active",active);el.setAttribute("aria-selected",String(active))});
  document.querySelectorAll("[data-mc3d-pane]").forEach(el=>{const active=el.dataset.mc3dPane===btn.dataset.mc3dTab;el.hidden=!active;el.classList.toggle("is-active",active)});
 }));
 document.querySelectorAll("[data-mc3d-model]").forEach(btn=>btn.addEventListener("click",()=>{modelInput.value=btn.dataset.mc3dModel;modelInput.dispatchEvent(new Event("change"))}));
 document.querySelectorAll("[data-mc3d-color]").forEach(btn=>btn.addEventListener("click",()=>{colorInput.value=btn.dataset.mc3dColor;colorInput.dispatchEvent(new Event("input"))}));
 document.querySelectorAll("[data-mc3d-finish]").forEach(btn=>btn.addEventListener("click",()=>{finishInput.value=btn.dataset.mc3dFinish;finishInput.dispatchEvent(new Event("change"))}));
 document.querySelectorAll("[data-mc3d-height]").forEach(btn=>btn.addEventListener("click",()=>{heightPreset=btn.dataset.mc3dHeight;applyHeight();syncUi()}));
 document.querySelectorAll("[data-mc3d-wheels]").forEach(btn=>btn.addEventListener("click",()=>{wheelPreset=btn.dataset.mc3dWheels;applyWheels();syncUi()}));
 document.querySelectorAll("[data-mc3d-tint]").forEach(btn=>btn.addEventListener("click",()=>{tintPreset=btn.dataset.mc3dTint;applyTint();syncUi()}));
 document.getElementById("mc3dApplyAd")?.addEventListener("click",()=>applyAd(adInput.value));
 document.getElementById("mc3dClearAd")?.addEventListener("click",()=>{adInput.value="";applyAd("")});
 function syncUi(){
  for(const [key,val] of [["height",heightPreset],["wheels",wheelPreset],["tint",tintPreset]])document.querySelectorAll("[data-mc3d-"+key+"]").forEach(el=>el.classList.toggle("is-active",el.dataset["mc3d"+key[0].toUpperCase()+key.slice(1)]===val));
  document.querySelectorAll("[data-mc3d-model]").forEach(el=>el.classList.toggle("is-active",el.dataset.mc3dModel===modelInput.value));
  document.querySelectorAll("[data-mc3d-finish]").forEach(el=>el.classList.toggle("is-active",el.dataset.mc3dFinish===finishInput.value));
  document.querySelectorAll("[data-mc3d-color]").forEach(el=>el.classList.toggle("is-active",el.dataset.mc3dColor.toLowerCase()===colorInput.value.toLowerCase()));
 }
 const localKey="winf-mediacar-3d-device-v1";
 document.getElementById("mc3dSaveDevice")?.addEventListener("click",()=>{try{localStorage.setItem(localKey,JSON.stringify(window.MediaCar3D.get()));status.textContent="Garagem salva neste aparelho ✓"}catch(e){status.textContent="Armazenamento indisponível"}});
 document.getElementById("mc3dLoadDevice")?.addEventListener("click",()=>{try{const saved=JSON.parse(localStorage.getItem(localKey)||"null");if(!saved)throw Error("Nenhuma garagem salva");window.MediaCar3D.set(saved);status.textContent="Garagem recuperada ✓"}catch(e){status.textContent=e.message}});

 modelInput.addEventListener("change",()=>build(modelInput.value));
 function finish(){paint.color.set(colorInput.value);const f=finishInput.value;paint.roughness=f==="matte"?.9:f==="metallic"?.3:.16;paint.metalness=f==="metallic"?.8:.24;paint.clearcoat=f==="matte"?0:1;syncUi()}
 colorInput.addEventListener("input",finish);finishInput.addEventListener("change",finish);
 document.getElementById("mc3dReset").addEventListener("click",()=>{camera.position.set(7,4.2,8.8);controls.target.set(0,.75,0);controls.update()});
 window.MediaCar3D={
 get:function(){return {model:modelInput.value,color:colorInput.value,finish:finishInput.value,camera:[camera.position.x,camera.position.y,camera.position.z],adText,heightPreset,wheelPreset,tintPreset};},
 set:function(saved){if(!saved||!["coupe","sedan","suv","van"].includes(saved.model)||!/^#[0-9a-fA-F]{6}$/.test(saved.color)||!["gloss","matte","metallic"].includes(saved.finish))throw Error("Configuração 3D inválida");modelInput.value=saved.model;colorInput.value=saved.color;finishInput.value=saved.finish;heightPreset=["stock","low","extreme"].includes(saved.heightPreset)?saved.heightPreset:"low";wheelPreset=["sport","dark","original"].includes(saved.wheelPreset)?saved.wheelPreset:"sport";tintPreset=["clear","medium","dark"].includes(saved.tintPreset)?saved.tintPreset:"medium";build(saved.model);finish();if(adInput){adInput.value=typeof saved.adText==="string"?saved.adText.slice(0,22):"MEDIACAR";applyAd(adInput.value)}if(Array.isArray(saved.camera)&&saved.camera.length===3&&saved.camera.every(Number.isFinite)){camera.position.set(...saved.camera);controls.update();}}
};
build("coupe");finish();
 const observer=new ResizeObserver(()=>{const w=root.clientWidth,h=root.clientHeight;if(!w||!h)return;camera.aspect=w/h;camera.updateProjectionMatrix();renderer.setSize(w,h,false)});observer.observe(root);
 let running=true;function loop(){if(!running)return;requestAnimationFrame(loop);controls.update();renderer.render(scene,camera)}loop();
 window.addEventListener("pagehide",()=>{running=false;observer.disconnect();renderer.dispose()},{once:true});
}catch(error){message&&(message.textContent="Não foi possível iniciar o 3D neste navegador. Confira a conexão e o suporte WebGL.");status.textContent="Visualizador indisponível";console.error("[MediaCar 3D]",error)}
}
