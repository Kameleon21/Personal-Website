import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';

// One world unit is one millimetre. Every row totals 15u at 19.05 mm pitch.
export const PITCH = 19.05;
export const ROWS: [string, number][][] = [
 [['esc',1],...['1','2','3','4','5','6','7','8','9','0','−','='].map(k=>[k,1] as [string,number]),['back',2]],
 [['tab',1.5],...['Q','W','E','R','T','Y','U','I','O','P','[',']'].map(k=>[k,1] as [string,number]),['\\',1.5]],
 [['caps',1.75],...['A','S','D','F','G','H','J','K','L',';',"'"].map(k=>[k,1] as [string,number]),['enter',2.25]],
 [['shift',2.25],...['Z','X','C','V','B','N','M',',','.','/'].map(k=>[k,1] as [string,number]),['shift',2.75]],
 [['ctrl',1.25],['win',1.25],['alt',1.25],['',6.25],['alt',1.25],['fn',1.25],['menu',1.25],['ctrl',1.25]],
];
export function initKeyboard() {
 const host=document.getElementById('scene')!;
 const reduced=matchMedia('(prefers-reduced-motion: reduce)');
 const renderer=new THREE.WebGLRenderer({alpha:true,antialias:true,powerPreference:'low-power'});
 renderer.setPixelRatio(Math.min(devicePixelRatio,1.75));renderer.setClearColor(0x000000,0);
 renderer.shadowMap.enabled=true;renderer.shadowMap.type=THREE.PCFSoftShadowMap;
 renderer.outputColorSpace=THREE.SRGBColorSpace;renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.3;
 renderer.domElement.style.cssText='display:block;width:100%;height:100%;';renderer.domElement.setAttribute('aria-hidden','true');host.appendChild(renderer.domElement);
 const scene=new THREE.Scene();const camera=new THREE.PerspectiveCamera(35,1,1,2000);
 const rig=new THREE.Group();scene.add(rig);rig.rotation.set(.12,0,-.10);
 scene.add(new THREE.HemisphereLight(0xf2f0ff,0x565269,2.7));
 const sun=new THREE.DirectionalLight(0xfff4ed,4);sun.position.set(-130,300,150);sun.castShadow=true;sun.shadow.mapSize.set(2048,2048);Object.assign(sun.shadow.camera,{left:-270,right:270,top:270,bottom:-270,near:1,far:800});sun.shadow.bias=-.0004;sun.shadow.normalBias=.4;sun.shadow.radius=4;scene.add(sun);
 const fill=new THREE.DirectionalLight(0xaebfff,1.8);fill.position.set(200,100,-150);scene.add(fill);
 const caseMaterial=new THREE.MeshStandardMaterial({color:0x24242a,roughness:.48,metalness:.35});
 const plateMaterial=new THREE.MeshStandardMaterial({color:0x121216,roughness:.55,metalness:.25});
 const keyMaterial=new THREE.MeshStandardMaterial({color:0x38383f,roughness:.55,metalness:.08});
 const accentMaterial=new THREE.MeshStandardMaterial({color:0xe2557e,roughness:.4,metalness:.1});
 const caseGroup=new THREE.Group();rig.add(caseGroup);
 const chassis=new THREE.Mesh(new RoundedBoxGeometry(15*PITCH+14,19,5*PITCH+14,4,5),caseMaterial);chassis.position.y=-12;chassis.castShadow=true;chassis.receiveShadow=true;caseGroup.add(chassis);
 const plate=new THREE.Mesh(new RoundedBoxGeometry(15*PITCH+3,3,5*PITCH+3,3,2),plateMaterial);plate.position.y=-1;plate.receiveShadow=true;caseGroup.add(plate);
 const port=new THREE.Mesh(new RoundedBoxGeometry(12,4,2,2,1),plateMaterial);port.position.set(-110,-11,-55);caseGroup.add(port);
 const shadow=new THREE.Mesh(new THREE.PlaneGeometry(1100,1000),new THREE.ShadowMaterial({opacity:.17}));shadow.rotation.x=-Math.PI/2;shadow.position.y=-65;shadow.receiveShadow=true;scene.add(shadow);
 const keycaps:{group:THREE.Group;row:number;column:number;target:THREE.Vector3;scatter:THREE.Vector3;rotation:THREE.Euler;accent:boolean;label:string;material:THREE.MeshStandardMaterial}[]=[];
 const labels:{texture:THREE.CanvasTexture;context:CanvasRenderingContext2D;label:string;accent:boolean}[]=[];
 const hints:Record<string,string>={A:'ABOUT',S:'EXP',D:'BUILD',F:'STACK',G:'BLOG',H:'HELLO'};
 let seed=42;const random=()=>{seed=(seed*1664525+1013904223)>>>0;return seed/4294967296;};
 ROWS.forEach((row,r)=>{let x=-15*PITCH/2;row.forEach(([label,u],column)=>{
  const accent=Object.hasOwn(hints,label);const material=accent?accentMaterial.clone():keyMaterial;
  const group=new THREE.Group();const width=u*PITCH-1.4;
  const cap=new THREE.Mesh(new RoundedBoxGeometry(width,9,17.4,3,1.8),material);cap.castShadow=true;cap.receiveShadow=true;group.add(cap);
  // Smaller top deck gives the cap a stepped, sculpted silhouette.
  const deck=new THREE.Mesh(new RoundedBoxGeometry(width-2.2,1.8,14.6,3,.7),material);deck.position.y=4.2;deck.receiveShadow=true;group.add(deck);
  const canvas=document.createElement('canvas');canvas.width=256;canvas.height=128;const context=canvas.getContext('2d')!;
  const texture=new THREE.CanvasTexture(canvas);texture.colorSpace=THREE.SRGBColorSpace;texture.anisotropy=renderer.capabilities.getMaxAnisotropy();
  const legend=new THREE.Mesh(new THREE.PlaneGeometry(width-3,13),new THREE.MeshBasicMaterial({map:texture,transparent:true,depthWrite:false,polygonOffset:true,polygonOffsetFactor:-1}));legend.rotation.x=-Math.PI/2;legend.position.y=5.15;group.add(legend);labels.push({texture,context,label,accent});
  const target=new THREE.Vector3(x+u*PITCH/2,6,(r-2)*PITCH);x+=u*PITCH;
  keycaps.push({group,row:r,column,target,scatter:new THREE.Vector3((random()-.5)*34,40+random()*60+(4-r)*9,(random()-.5)*34),rotation:new THREE.Euler((random()-.5)*.7,(random()-.5)*.65,(random()-.5)*.65),accent,label,material});rig.add(group);
 });});
 function theme(){const light=document.body.dataset.theme==='light';caseMaterial.color.set(light?0xc9c3b7:0x24242a);plateMaterial.color.set(light?0xa6a096:0x121216);keyMaterial.color.set(light?0xeee9dc:0x38383f);labels.forEach(({texture,context,label,accent})=>{context.clearRect(0,0,256,128);context.fillStyle=accent?'#fff3f5':light?'#46433e':'#d0cfd8';context.font=`${label.length>2?22:34}px monospace`;context.textAlign='left';context.fillText(label,19,48);if(accent){context.font='15px monospace';context.fillStyle='#ffd7e1';context.fillText(hints[label],19,101);}texture.needsUpdate=true;});}
 theme();window.addEventListener('keyboard-theme',theme);
 function resize(){const w=host.clientWidth,h=host.clientHeight;renderer.setSize(w,h,false);camera.aspect=w/h;const distance=Math.max(460,340/(2*Math.tan(THREE.MathUtils.degToRad(17.5))*camera.aspect));camera.position.set(distance*.10,distance*.76,distance*.70);camera.lookAt(0,22,0);camera.updateProjectionMatrix();}
 const observer=new ResizeObserver(resize);observer.observe(host);resize();
 let mouseX=0,mouseY=0;window.addEventListener('pointermove',e=>{if(e.pointerType==='mouse'){mouseX=e.clientX/innerWidth-.5;mouseY=e.clientY/innerHeight-.5;}},{passive:true});
 const ease=(t:number)=>1-Math.pow(1-THREE.MathUtils.clamp(t,0,1),3);
 let frame=0;let previous=0;
 function animate(time:number){frame=requestAnimationFrame(animate);if(time-previous<32)return;previous=time;
  const progress=reduced.matches?1:THREE.MathUtils.clamp(scrollY/(innerHeight*1.4),0,1);
  caseGroup.position.y=-40*(1-ease(progress/.6));
  rig.rotation.y+=( (reduced.matches?0:mouseX*.12)-rig.rotation.y)*.06;
  rig.rotation.x+=((.12+(reduced.matches?0:mouseY*.07))-rig.rotation.x)*.06;
  keycaps.forEach(k=>{const t=ease((progress-k.row*.11-k.column*.003)/.5);k.group.position.copy(k.target).addScaledVector(k.scatter,1-t);k.group.rotation.set(k.rotation.x*(1-t),k.rotation.y*(1-t),k.rotation.z*(1-t));const active=k.accent&&k.label===document.body.dataset.activeKey;const lift=active?(12+(reduced.matches?0:Math.sin(time*.002)*1.5))*t:0;k.group.position.y+=lift;if(k.accent){k.material.emissive.set(0xe2557e);k.material.emissiveIntensity=active?.38:0;}});
  document.getElementById('assembly-percent')!.textContent=`${Math.round(progress*100)}%`;document.getElementById('assembly-bar')!.style.width=`${progress*100}%`;document.getElementById('assembly-label')!.textContent=progress>=1?'ALL SYSTEMS ASSEMBLED':'ASSEMBLY IN PROGRESS';renderer.render(scene,camera);
 }
 frame=requestAnimationFrame(animate);
 document.addEventListener('visibilitychange',()=>{cancelAnimationFrame(frame);if(!document.hidden)frame=requestAnimationFrame(animate);});
 renderer.domElement.addEventListener('webglcontextlost',e=>{e.preventDefault();cancelAnimationFrame(frame);document.getElementById('scene-fallback')!.hidden=false;});
}
