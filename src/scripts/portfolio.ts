const mobile = matchMedia('(max-width: 899px)');
const reduced = matchMedia('(prefers-reduced-motion: reduce)');
function layout() {
 const small = mobile.matches;
 document.getElementById('header-nav')!.style.display=small?'none':'flex';
 document.getElementById('keyboard-slot')!.style.height=small?'330px':'500px';
 document.getElementById('about')!.style.paddingTop=small?'120px':'140px';
 document.getElementById('scene-caption')!.style.display=small?'none':'block';
 document.getElementById('scene-bottom')!.style.display=small?'none':'block';
 document.querySelectorAll<HTMLElement>('[data-responsive-grid]').forEach(el=>{
  const kind=el.dataset.responsiveGrid;
  if(kind==='hero-foot'){el.style.flexDirection=small?'column':'row';el.style.alignItems=small?'flex-start':'center';return;}
  el.style.gridTemplateColumns=small?'1fr':kind==='section'?'1fr 1.65fr':kind==='project'?'45px 1fr 1.4fr 110px':'1fr 1fr';
  el.style.gap=small?'24px':kind==='section'?'8%':'24px';
  if(kind==='hero') (el.lastElementChild as HTMLElement).style.justifySelf=small?'start':'end';
 });
 dockKeyboard();
}
function dockKeyboard(){
 const panel=document.getElementById('keyboard-panel')!;
 const slot=document.getElementById('keyboard-slot')!;
 const docked=slot.getBoundingClientRect().bottom<90;
 const small=mobile.matches;
 Object.assign(panel.style,docked?{position:'fixed',inset:'auto 18px 18px auto',width:small?'145px':'230px',height:small?'110px':'165px',background:'var(--surface)',border:'1px solid var(--border)',borderRadius:'8px',boxShadow:'0 8px 30px #00000010',zIndex:'15'}:{position:'absolute',inset:'0',width:'100%',height:'100%',background:'transparent',border:'0',borderRadius:'0',boxShadow:'none',zIndex:'5'});
 document.getElementById('dock-label')!.hidden=!docked;
}
layout();mobile.addEventListener('change',layout);
window.addEventListener('scroll',dockKeyboard,{passive:true});
document.documentElement.style.scrollBehavior=reduced.matches?'auto':'smooth';
const colors={dark:{bg:'#121215',surface:'#1a1a1f',text:'#ececf0',muted:'#9c9ca8',accent:'#e2557e',success:'#4fd18b',border:'#ffffff15'},light:{bg:'#f6f4ef',surface:'#eeece6',text:'#1a1a1f',muted:'#696974',accent:'#d9436f',success:'#228352',border:'#1a1a1f20'}};
let theme:'dark'|'light'='light';
try {theme=localStorage.getItem('kbd-editorial-theme')==='dark'?'dark':'light';}catch{}
function applyTheme(){Object.entries(colors[theme]).forEach(([k,v])=>document.body.style.setProperty(`--${k}`,v));document.body.dataset.theme=theme;document.getElementById('theme-label')!.textContent=theme;const button=document.getElementById('theme-toggle')!;button.setAttribute('aria-label',`Switch to ${theme==='dark'?'light':'dark'} theme`);button.setAttribute('aria-pressed',String(theme==='light'));window.dispatchEvent(new Event('keyboard-theme'));}
applyTheme();
document.getElementById('theme-toggle')!.addEventListener('click',()=>{theme=theme==='dark'?'light':'dark';applyTheme();try{localStorage.setItem('kbd-editorial-theme',theme);}catch{}});
const sections=Array.from(document.querySelectorAll<HTMLElement>('[data-section]'));
window.addEventListener('keydown',e=>{if(e.repeat||e.altKey||e.ctrlKey||e.metaKey||e.target instanceof HTMLElement&&e.target.closest('input,textarea,select,button,[contenteditable="true"]'))return;const target=sections.find(s=>s.dataset.section===e.key.toUpperCase());if(target){e.preventDefault();target.scrollIntoView({behavior:reduced.matches?'instant':'smooth'});}});
function activeSection(){const center=innerHeight*.5;const active=sections.reduce((best,s)=>{const r=s.getBoundingClientRect(),b=best.getBoundingClientRect();return Math.abs((r.top+r.bottom)/2-center)<Math.abs((b.top+b.bottom)/2-center)?s:best;});document.getElementById('active-key')!.textContent=`[${active.dataset.section}] ${active.id}`;document.body.dataset.activeKey=active.dataset.section;document.getElementById('dock-label')!.textContent=`[${active.dataset.section}] ${active.id}`;document.querySelectorAll<HTMLElement>('[data-key-link]').forEach(a=>{const selected=a.dataset.keyLink===active.dataset.section;a.style.color=selected?'var(--text)':'var(--muted)';if(selected)a.setAttribute('aria-current','location');else a.removeAttribute('aria-current');});}
window.addEventListener('scroll',activeSection,{passive:true});window.addEventListener('resize',activeSection);activeSection();
const form=document.getElementById('portfolio-form') as HTMLFormElement;
form.addEventListener('submit',async e=>{e.preventDefault();if(!form.reportValidity())return;const button=form.querySelector('button')!;const status=document.getElementById('form-status')!;button.disabled=true;button.textContent='POST /message · sending';status.textContent='Sending your message…';try{const response=await fetch(form.action,{method:'POST',body:new FormData(form),headers:{Accept:'application/json'}});const result=await response.json();if(!response.ok||!result.success)throw new Error('Submission failed');status.textContent='200 OK — message delivered. Thanks for reaching out.';form.reset();}catch{status.textContent='Message could not be sent. Please retry or use the email link above.';}finally{button.disabled=false;button.textContent='POST /message →';}});
import('./keyboard').then(m=>m.initKeyboard()).catch(()=>{document.getElementById('scene-fallback')!.hidden=false;});
