(()=>{
const reduced=matchMedia('(prefers-reduced-motion: reduce)'),hero=document.querySelector('.hero'),orb=document.querySelector('.orb'),stage=document.querySelector('.orb-stage');
orb.setAttribute('aria-label','Drag the glass orb; release to let it spring back. Arrow keys also move it.');
document.querySelector('.orb-caption').textContent='Grab g-orb or scroll';
// The entrance tracks font readiness, with a short visual settling period.
const loader=document.querySelector('.entrance'),pct=loader.querySelector('.entrance-pct'),fill=loader.querySelector('.entrance-fill'),bar=loader.querySelector('.entrance-bar b');
let seen=false;try{seen=sessionStorage.getItem('griz-intro-seen')==='1'}catch{}
let ready=false,fontsReady=false,sceneReady=false,finished=false,progress=0,begin=performance.now(),last=begin;
hero.addEventListener('scene-ready',()=>{sceneReady=true;ready=fontsReady},{once:true});
const minimum=reduced.matches?0:seen?600:1900;
Promise.race([document.fonts.ready,new Promise(r=>setTimeout(r,3500))]).then(()=>{fontsReady=true;ready=sceneReady});
setTimeout(()=>ready=true,4500);
const diameter=()=>Math.round(Math.min(innerWidth,innerHeight)*(innerWidth<760?.38:.28));
loader.querySelector('.entrance-dim').textContent=`${diameter()} × ${diameter()}`;
function complete(){if(finished)return;finished=true;loader.classList.add('leaving');document.body.classList.remove('intro-loading');document.body.classList.add('intro-ready');try{sessionStorage.setItem('griz-intro-seen','1')}catch{}setTimeout(()=>loader.remove(),reduced.matches?0:700)}
function loadFrame(now){const dt=Math.min(.05,(now-last)/1000);last=now;const target=Math.min(minimum?(now-begin)/minimum:1,ready?1:.86);progress+=(target-progress)*(1-Math.exp(-dt/.12));if(ready&&target===1&&progress>.995)progress=1;pct.textContent=String(Math.round(progress*100)).padStart(3,'0');fill.style.transform=`translateY(${(1-progress)*105}%)`;bar.style.transform=`scaleX(${progress})`;if(progress===1)complete();else requestAnimationFrame(loadFrame)}
requestAnimationFrame(loadFrame);
// Reveal individual words through blur as the scene comes into focus.
const title=document.querySelector('.hero h1');let delay=0;
function wrap(node){[...node.childNodes].forEach(child=>{if(child.nodeType===3){const fragment=document.createDocumentFragment();child.textContent.split(/(\s+)/).forEach(word=>{if(!word.trim())fragment.append(document.createTextNode(word));else{const s=document.createElement('span');s.className='entrance-word';s.textContent=word;s.style.setProperty('--delay',`${delay++*95}ms`);fragment.append(s)}});child.replaceWith(fragment)}else if(child.nodeType===1)wrap(child)})}wrap(title);
// Soft-body spring: the same observed stiffness, damping and idle bob timing.
let x=0,y=0,vx=0,vy=0,drag=null,px=0,py=0,hover=false,mouseX=0,mouseY=0,energy=0,previous=performance.now(),visible=true,frame=0,lastWake=0;
const draw=(t,e,a,b)=>hero.dispatchEvent(new CustomEvent('orb-motion',{detail:{energy:e,vx:a,vy:b}}));
function ripple(strength){const r=orb.getBoundingClientRect();hero.dispatchEvent(new CustomEvent('orb-ripple',{detail:{x:r.left+r.width/2,y:r.bottom,strength}}))}
function stop(){if(!drag)return;drag=null;orb.classList.remove('dragging');energy=Math.min(2,energy+1.2);ripple(1.5)}
orb.addEventListener('pointerdown',e=>{if(e.button!==0)return;const r=hero.getBoundingClientRect();drag={x:e.clientX-x,y:e.clientY-y,width:r.width,height:r.height};orb.setPointerCapture(e.pointerId);orb.classList.add('dragging');energy+=.5;e.preventDefault()});
orb.addEventListener('pointermove',e=>{if(!drag)return;const nx=e.clientX-drag.x,ny=e.clientY-drag.y;x=nx;y=ny;energy=Math.min(2,energy+.1)});
orb.addEventListener('pointerup',stop);orb.addEventListener('pointercancel',stop);orb.addEventListener('lostpointercapture',stop);window.addEventListener('blur',stop);
hero.addEventListener('pointermove',e=>{const r=stage.getBoundingClientRect();mouseX=(e.clientX-r.left-r.width/2)*.035;mouseY=(e.clientY-r.top-r.height/2)*.035;hover=true},{passive:true});hero.addEventListener('pointerleave',()=>hover=false);
orb.addEventListener('keydown',e=>{const d={ArrowLeft:[-65,0],ArrowRight:[65,0],ArrowUp:[0,-65],ArrowDown:[0,65]}[e.key];if(!d)return;e.preventDefault();x+=d[0];y+=d[1];energy=1;ripple(1)});
function animate(now){frame=0;if(!visible||document.hidden)return;const dt=Math.min(.033,(now-previous)/1000);previous=now;if(!drag){vx+=(-x*90-vx*9)*dt;vy+=(-y*90-vy*9)*dt;x+=vx*dt;y+=vy*dt}energy*=Math.exp(-dt*2.4);const float=reduced.matches?0:Math.sin(now/1150)*orb.offsetWidth*.0175;const tx=x+(hover&&!drag&&!reduced.matches?mouseX:0),ty=y+float+(hover&&!drag&&!reduced.matches?mouseY:0);orb.style.transform=`translate3d(${tx}px,${ty}px,0)`;if(hero._storyNote)hero._storyNote.style.transform=`translate(-50%,-50%) translate3d(${tx}px,${ty}px,0)`;orb.style.setProperty('--bend',`${Math.min(8,Math.abs(vx)/100)}deg`);draw(reduced.matches?0:now/1000,reduced.matches?0:energy,vx,vy);if((Math.hypot(tx-px,ty-py)>4||energy>.6)&&now-lastWake>180){ripple(.7);lastWake=now}if(now-lastWake>2400){ripple(.28);lastWake=now}px=tx;py=ty;if(!reduced.matches||drag||Math.abs(x)+Math.abs(y)>.1)frame=requestAnimationFrame(animate)}
function resume(){if(!frame){previous=performance.now();frame=requestAnimationFrame(animate)}}
orb.addEventListener('pointerdown',resume);orb.addEventListener('keydown',resume);new IntersectionObserver(e=>{visible=e[0].isIntersecting;if(visible)resume();else{cancelAnimationFrame(frame);frame=0}}).observe(hero);document.addEventListener('visibilitychange',resume);reduced.addEventListener('change',resume);resume();
})();
