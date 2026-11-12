// MediaCar™ 3D configurator — procedural geometry, not OEM vehicle models.
// Three.js ES modules + OrbitControls; no tracking, credentials, or remote project writes.
const root=document.getElementById("mc3dCanvas");
if(root){
const message=document.getElementById("mc3dMessage");
const status=document.getElementById("mc3dStatus");
try{
 const THREE=await import("https://esm.sh/three@0.169.0");
 const {OrbitControls}=await import("https://esm.sh/three@0.169.0/examples/jsm/controls/OrbitControls.js");
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
 let car;
 function box(group,w,h,d,x,y,z,material,bevel=0){
  let geometry=new THREE.BoxGeometry(w,h,d);
  if(bevel){geometry=new THREE.BoxGeometry(w,h,d)}
  const mesh=new THREE.Mesh(geometry,material);mesh.position.set(x,y,z);mesh.castShadow=true;mesh.receiveShadow=true;group.add(mesh);return mesh;
 }
 function build(model){
  if(car){scene.remove(car);car.traverse(o=>{if(o.geometry)o.geometry.dispose()})}
  car=new THREE.Group();scene.add(car);
  const suv=model==="suv",van=model==="van",sedan=model==="sedan";
  const length=van?6.1:suv?5.25:sedan?5.05:4.7;
  const width=van?2.12:2.02;
  const chassisY=van?1.05:suv?.93:.77;
  const height=van?2.65:suv?1.82:sedan?1.49:1.31;
  const front=length/2;
  // Longitudinal axis is Z; front is +Z.
  box(car,width,.42,length,0,chassisY,0,paint);
  box(car,width*.95,.12,length*.95,0,chassisY-.27,0,black);
  const cabLen=van?length*.72:suv?length*.65:sedan?length*.55:length*.48;
  const cabZ=van?-.2:suv?-.2:sedan?-.25:-.22;
  const cabY=chassisY+.21+(height-chassisY-.28)/2;
  box(car,width*.83,height-chassisY-.28,cabLen,0,cabY,cabZ,glass);
  box(car,width*.86,.1,cabLen,0,height-.05,cabZ,paint);
  // Roof edge and window pillars.
  for(const x of [-width*.43,width*.43]){
   box(car,.075,height-chassisY-.05,.09,x,(height+chassisY)/2,cabZ-cabLen*.48,paint);
   box(car,.075,height-chassisY-.05,.09,x,(height+chassisY)/2,cabZ+cabLen*.48,paint);
   if(suv||van||sedan)box(car,.06,height-chassisY-.08,.08,x,(height+chassisY)/2,cabZ,paint);
  }
  // Hood, bumpers, glass bands, lights.
  box(car,width*.94,.18,Math.max(.25,front-(cabZ+cabLen/2)),0,chassisY+.22,(front+cabZ+cabLen/2)/2,paint);
  box(car,width*.91,.17,.17,0,chassisY-.1,front+.04,black);
  box(car,width*.91,.17,.17,0,chassisY-.1,-front-.04,black);
  for(const x of [-width*.36,width*.36]){
   box(car,.3,.09,.035,x,chassisY+.19,front+.06,white);
   box(car,.34,.09,.035,x,chassisY+.19,-front-.06,red);
   box(car,.09,.06,.4,x+Math.sign(x)*.1,chassisY+.4,.4,lime);
  }
  // Wheels: axle perpendicular to Z, spin around X.
  const wheelZ=length*.32;
  for(const z of [-wheelZ,wheelZ])for(const side of [-1,1]){
   const wheel=new THREE.Mesh(new THREE.CylinderGeometry(.43,.43,.26,32),rubber);
   wheel.rotation.z=Math.PI/2;wheel.position.set(side*(width/2+.07),.46,z);wheel.castShadow=true;car.add(wheel);
   const hub=new THREE.Mesh(new THREE.CylinderGeometry(.24,.24,.275,24),silver);
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
  plaque.position.set(-width/2-.014,chassisY+.17,-.4);plaque.rotation.y=-Math.PI/2;car.add(plaque);
  const plaqueOther=plaque.clone();plaqueOther.position.x=width/2+.014;plaqueOther.rotation.y=Math.PI/2;car.add(plaqueOther);
  status.textContent="Modelo conceitual 3D · "+({coupe:"Coupé",sedan:"Sedã",suv:"SUV",van:"Van"}[model]);
 }
 const modelInput=document.getElementById("mc3dModel"),colorInput=document.getElementById("mc3dColor"),finishInput=document.getElementById("mc3dFinish");
 modelInput.addEventListener("change",()=>build(modelInput.value));
 function finish(){paint.color.set(colorInput.value);const f=finishInput.value;paint.roughness=f==="matte"?.9:f==="metallic"?.3:.16;paint.metalness=f==="metallic"?.8:.24;paint.clearcoat=f==="matte"?0:1}
 colorInput.addEventListener("input",finish);finishInput.addEventListener("change",finish);
 document.getElementById("mc3dReset").addEventListener("click",()=>{camera.position.set(7,4.2,8.8);controls.target.set(0,.75,0);controls.update()});
 build("coupe");finish();
 const observer=new ResizeObserver(()=>{const w=root.clientWidth,h=root.clientHeight;if(!w||!h)return;camera.aspect=w/h;camera.updateProjectionMatrix();renderer.setSize(w,h,false)});observer.observe(root);
 let running=true;function loop(){if(!running)return;requestAnimationFrame(loop);controls.update();renderer.render(scene,camera)}loop();
 window.addEventListener("pagehide",()=>{running=false;observer.disconnect();renderer.dispose()},{once:true});
}catch(error){message&&(message.textContent="Não foi possível iniciar o 3D neste navegador. Confira a conexão e o suporte WebGL.");status.textContent="Visualizador indisponível";console.error("[MediaCar 3D]",error)}
}
