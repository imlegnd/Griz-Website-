(()=>{
const hero=document.querySelector('.hero'),motion=matchMedia('(prefers-reduced-motion: reduce)');
let reading=false;try{reading=sessionStorage.getItem('griz-reading')==='1'}catch{}
const modeButton=document.createElement('button');modeButton.className='reading-toggle';modeButton.textContent=reading?'Enable animated story':'Read as a page';modeButton.addEventListener('click',()=>{try{sessionStorage.setItem('griz-reading',reading?'0':'1')}catch{}location.reload()});document.body.append(modeButton);
if(reading||motion.matches)return;
function initialise(){
if(document.body.classList.contains('story-ready'))return;
const runway=document.createElement('div');runway.className='story-runway';hero.before(runway);runway.append(hero);
const layer=document.createElement('div');layer.className='story-layer';hero.append(layer);
layer.innerHTML=`
<section class="story-panel story-introduction" data-center="1.5" aria-label="The person" aria-hidden="true" inert>
  <p class="story-kicker">01 / THE PERSON</p><div class="split-statement"><h2>Technology is<br>the background.</h2><h2>Curiosity is<br>the driving force.</h2></div><p class="story-footnote">Griz. A technical background.<br>An interest in what comes next.</p>
</section>
<section class="story-panel story-background" data-center="3" aria-label="My background" aria-hidden="true" inert>
  <h2>A technical background.<br><span>An open mind.</span></h2><p class="story-side-copy">I’m Griz. I have a tech background and an interest in AI. This is a place for the things I explore, the things I make, and whatever comes next.</p><span class="story-corner-label">ALWAYS A WORK IN PROGRESS</span>
</section>
<section class="story-panel story-interests" data-center="4.5" aria-label="AI and technology interests" aria-hidden="true" inert>
  <p class="story-kicker">02 / FOLLOWING THE QUESTIONS</p><h2>Less standing still.</h2><div class="story-giant">More what if?</div><div class="floating-topics"><span>Artificial intelligence</span><span>Connected systems</span><span>Ideas → experiments</span><span>Learning by doing</span><span>People & technology</span><span>What comes next?</span></div><p class="story-footnote">Exploring how AI changes<br>the way we think, create, and work.</p>
</section>
<section class="story-panel story-projects" data-center="7" aria-label="Project explorations" aria-hidden="true" inert>
  <div class="story-gallery-heading"><p class="story-kicker">03 / SELECTED EXPLORATIONS</p><h2>Ideas deserve<br> to get out.</h2><p>Project placeholders.<br>Ready for the real work.</p></div>
  <div class="story-gallery-track"><button class="story-project" data-open-project="0"><span class="story-project-art story-art-ai"><i class="glass-cube"></i><small>THOUGHT → SYSTEM</small></span><span class="story-project-meta"><small>EXPLORATION 001 / AI</small><strong>An idea, made useful.</strong><span>Open this project ↗</span></span></button><button class="story-project" data-open-project="1"><span class="story-project-art story-art-tech"><i class="rings"></i><small>CONNECT THE DOTS</small></span><span class="story-project-meta"><small>EXPLORATION 002 / TECHNOLOGY</small><strong>Making the pieces click.</strong><span>Open this project ↗</span></span></button></div>
  <div class="story-glass-note"><small>THE EXPLORATION</small><p class="story-project-note">An idea, made useful.</p><span>Keep scrolling to explore →</span></div>
</section>
<section class="story-panel story-history" data-center="9.4" aria-label="Experience" aria-hidden="true" inert>
  <p class="story-kicker">04 / THE BACKGROUND</p><h2>A foundation<br>in technology.</h2><div class="story-timeline"><article><small>EXPERIENCE / TO ADD</small><h3>Your most recent role</h3><p>Company · Dates</p><p>Add the problems you solved and what you learned.</p></article><article><small>EXPERIENCE / TO ADD</small><h3>The chapter before that</h3><p>Company · Dates</p><p>The work that shaped your technical background.</p></article><article><small>LEARNING / TO ADD</small><h3>Always adding to the toolkit</h3><p>Education, certifications, and what you’re learning now.</p></article></div><p class="story-history-note">The details belong here.<br>The next chapter is open.</p>
</section>
<section class="story-panel story-connect" data-center="11.2" aria-label="Connect with Griz" aria-hidden="true" inert>
  <p class="story-kicker">05 / THE NEXT CHAPTER</p><p>Good things start with curiosity.</p><h2>What could<br>we make?</h2><button class="story-connect-button">Let’s connect <span>↗</span></button><small>Contact details coming soon.</small>
</section>`;
const panels=[...layer.querySelectorAll('.story-panel')];
layer.querySelectorAll('[data-open-project]').forEach(button=>button.addEventListener('click',()=>document.querySelector(`.project[data-project="${button.dataset.openProject}"]`).click()));
layer.querySelector('.story-connect-button').addEventListener('click',()=>document.querySelector('.contact-button').click());
const navigation=document.createElement('nav');navigation.className='story-navigation';navigation.setAttribute('aria-label','Story chapters');
const chapters=[['Opening',0],['The person',1.5],['Background',3],['Interests',4.5],['Projects',6.8],['Experience',9.4],['Connect',11.2]];
navigation.innerHTML=`<span class="story-current">01 / OPENING</span><div>${chapters.map(([name,position])=>`<button aria-label="Go to ${name}" data-position="${position}"><i></i></button>`).join('')}</div><span class="story-progress"><i></i></span>`;hero.append(navigation);
const chapterButtons=[...navigation.querySelectorAll('button')];chapterButtons.forEach(button=>button.addEventListener('click',()=>go(Number(button.dataset.position))));
function go(position){window.scrollTo({top:runway.offsetTop+position*hero.clientHeight,behavior:'smooth'})}
const destinations={about:1.5,focus:4.5,work:6.8,experience:9.4,contact:11.2};
document.addEventListener('click',e=>{const link=e.target.closest('a[href^="#"]');if(!link)return;const id=link.getAttribute('href').slice(1);if(!id){e.preventDefault();go(0)}else if(id in destinations){e.preventDefault();go(destinations[id]);history.replaceState(null,'',`#${id}`)}});
const source=new Image();source.src=innerWidth<760?'assets/reference-scene-tall.webp':'assets/reference-scene-wide.webp';
const composite=document.createElement('canvas');composite.width=composite.height=2048;const ctx=composite.getContext('2d');
const orbStage=document.querySelector('.orb-stage'),orb=document.querySelector('.orb');
let width=hero.clientWidth,height=hero.clientHeight,position=0,target=0,last=performance.now(),raf=0,previousDraw=-100,activeChapter=-1;
const clamp=n=>Math.max(0,Math.min(1,n)),mix=(a,b,t)=>a+(b-a)*t,smooth=(a,b,n)=>{const t=clamp((n-a)/(b-a));return t*t*(3-2*t)};
const keys=[
 {at:0,x:.5,y:.52,r:1,m:0,w:1,h:1},
 {at:1.5,x:.5,y:.51,r:1.12,m:0,w:1,h:1},
 {at:3,x:.5,y:.45,r:1.06,m:0,w:1,h:1},
 {at:4.5,x:.5,y:.52,r:.92,m:0,w:1,h:1},
 {at:6.1,x:.69,y:.72,r:.92,m:1,w:2.1,h:.9},
 {at:7.8,x:.69,y:.72,r:.92,m:1,w:2.1,h:.9},
 {at:9.4,x:.27,y:.54,r:1.35,m:0,w:1,h:1},
 {at:11.2,x:.74,y:.49,r:1.4,m:0,w:1,h:1},
 {at:12.5,x:.74,y:.49,r:1.4,m:0,w:1,h:1}
];
function covered(image){if(!image.complete||!image.naturalWidth)return;const scale=Math.max(width/image.naturalWidth,height/image.naturalHeight);ctx.drawImage(image,(width-image.naturalWidth*scale)/2,(height-image.naturalHeight*scale)/2,image.naturalWidth*scale,image.naturalHeight*scale)}
function dark(){ctx.fillStyle='#1f1611';ctx.fillRect(0,0,width,height);const glow=ctx.createRadialGradient(width*.51,height*.95,0,width*.51,height*.95,width*.65);glow.addColorStop(0,'#8e4f2438');glow.addColorStop(1,'#25170c00');ctx.fillStyle=glow;ctx.fillRect(0,0,width,height)}
function artwork(x,y,w,h,kind){ctx.save();ctx.beginPath();ctx.rect(x,y,w,h);ctx.clip();const gradient=ctx.createLinearGradient(x,y,x+w,y+h);gradient.addColorStop(0,kind?'#e9d7bb':'#d8dec5');gradient.addColorStop(1,kind?'#a58d70':'#768b6d');ctx.fillStyle=gradient;ctx.fillRect(x,y,w,h);ctx.translate(x+w*.5,y+h*.46);if(kind){ctx.strokeStyle='#fff8dd9c';ctx.lineWidth=Math.min(w,h)*.09;ctx.beginPath();ctx.ellipse(0,0,w*.22,h*.24,-.35,0,Math.PI*2);ctx.stroke();ctx.strokeStyle='#5f695e55';ctx.lineWidth=2;ctx.stroke()}else{ctx.rotate(-.35);ctx.fillStyle='#f1f6dc55';ctx.strokeStyle='#fff9dbaa';ctx.lineWidth=2;ctx.beginPath();ctx.roundRect(-w*.18,-h*.16,w*.36,h*.32,25);ctx.fill();ctx.stroke()}ctx.restore()}

const topicLabels=['Artificial intelligence','Connected systems','Ideas → experiments','Learning by doing','People & technology','What comes next?'];
const topicEnds=[[-310,-155,-17],[120,-145,12],[135,90,9],[-240,140,-7],[-375,20,14],[95,-230,-4]];
const topicDirections=[[-1,-.7],[1,-.8],[1,.7],[-.7,1],[-1,.25],[.3,-1]];
function topics(value){
 const scale=width<800?.6:1;
 const show=smooth(3.65,4.15,value)*(1-smooth(5.2,5.8,value));
 if(show<=0)return;
 ctx.save();ctx.globalAlpha=show;
 ctx.fillStyle='#f4eee5';ctx.textAlign='center';ctx.textBaseline='top';
 const titleSize=width<800?width*.16:Math.min(220,Math.max(70,width*.14));
 ctx.font='400 '+titleSize+'px Manrope, sans-serif';ctx.letterSpacing=width<800?'-3px':'-9px';ctx.fillText('More what if?',width*.5,height*.38);ctx.letterSpacing='0px';
 ctx.restore();
 topicLabels.forEach((label,i)=>{
   const entry=smooth(3.65+i*.075,4.25+i*.045,value),exit=smooth(4.95+i*.045,5.48+i*.045,value);
   const t=entry-1,settle=1+2.70158*t*t*t+1.70158*t*t;
   const end=topicEnds[i],dir=topicDirections[i];
   const startX=dir[0]*(width*.75+240),startY=dir[1]*(height*.7+200);
   const arc=Math.sin(entry*Math.PI)*(i%2?100:-100);
   let x=mix(startX,end[0]*scale,settle)+arc,y=mix(startY,end[1]*scale,settle)-Math.sin(entry*Math.PI)*90;
   x*=1-exit;y*=1-exit;
   const rotation=mix(end[2]+(i%2?100:-100),end[2],entry)+exit*(i%2?90:-90);
   const alpha=smooth(0,.25,entry)*(1-smooth(.65,1,exit));if(alpha<=0)return;
   ctx.save();ctx.globalAlpha=alpha;ctx.translate(width*.5+x,height*.52+y);ctx.rotate(rotation*Math.PI/180);ctx.scale(scale*(1-exit*.92),scale*(1-exit*.92));
   ctx.font=(width<800?'14':'10')+'px Manrope, sans-serif';ctx.textBaseline='middle';ctx.textAlign='left';
   const w=ctx.measureText(label).width+42,h=width<800?48:43;
   ctx.shadowColor='#0004';ctx.shadowBlur=18;ctx.shadowOffsetY=6;ctx.fillStyle='#f5efe4';ctx.beginPath();ctx.roundRect(0,0,w,h,2);ctx.fill();
   ctx.shadowColor='transparent';ctx.strokeStyle='#a9a194';ctx.lineWidth=.8;ctx.strokeRect(12,h/2-4,8,8);ctx.fillStyle='#342e26';ctx.fillText(label,27,h/2+.5);ctx.restore();
 });
}

function paint(value){
ctx.setTransform(2048/width,0,0,2048/height,0,0);ctx.globalAlpha=1;ctx.filter='none';dark();
const opening=1-smooth(.2,1.05,value);if(opening>0){ctx.save();ctx.globalAlpha=opening;ctx.filter=`blur(${smooth(.15,.95,value)*15}px)`;covered(source);ctx.restore()}
const interest=smooth(3.65,4.25,value)*(1-smooth(5.15,5.8,value));if(interest>0){ctx.save();ctx.globalAlpha=interest*.14;ctx.strokeStyle='#ebc49c';ctx.lineWidth=1;ctx.setLineDash([2,5]);const r=Math.min(width,height)*.24;ctx.strokeRect(width*.5-r,height*.52-r,r*2,r*2);ctx.beginPath();ctx.arc(width*.5,height*.52,r*.88,0,Math.PI*2);ctx.stroke();ctx.restore()}
topics(value);
const gallery=smooth(5.25,5.9,value)*(1-smooth(8.1,8.8,value));if(gallery>0){ctx.save();ctx.globalAlpha=gallery;const mobile=width<800,w=mobile?width*.78:width*.4,h=height*(mobile?.51:.67),galleryY=height*(mobile?.30:.16);const slide=smooth(6.8,7.9,value);const x=(mobile?width*.11:width*.34)-slide*(w+width*.06);artwork(x,galleryY,w,h,0);artwork(x+w+width*.06,galleryY,w,h,1);ctx.restore()}
const history=smooth(8.25,9,value)*(1-smooth(10.05,10.8,value));if(history>0){ctx.save();ctx.globalAlpha=history;ctx.fillStyle='#eeece2';ctx.fillRect(0,0,width,height);ctx.strokeStyle='#b7b8a845';ctx.lineWidth=1;for(let i=0;i<9;i++){ctx.beginPath();ctx.arc(width*.25,height*.54,40+i*22,0,Math.PI*2);ctx.stroke()}ctx.restore()}
const closing=smooth(10.1,10.9,value);if(closing>0){ctx.save();ctx.globalAlpha=closing;covered(source);ctx.fillStyle='#1b190acc';ctx.fillRect(0,0,width,height);ctx.restore()}
hero._storyCanvas=composite;hero.dispatchEvent(new CustomEvent('story-background',{detail:{canvas:composite,width,height}}));
}
function key(value){
const frames=width<800?keys.map(p=>{if(p.at===6.1||p.at===7.8)return {...p,x:.58,y:.76,w:1.8,h:.83};if(p.at===9.4)return {...p,x:.23,y:.43,r:.7};if(p.at>=11.2)return {...p,x:.78,y:.66,r:.85};return p}):keys;
let a=frames[0],b=frames.at(-1);for(let i=0;i<frames.length-1;i++){if(value>=frames[i].at&&value<=frames[i+1].at){a=frames[i];b=frames[i+1];break}}const t=smooth(a.at,b.at,value),out={};for(const prop of ['x','y','r','m','w','h'])out[prop]=mix(a[prop],b[prop],t);return out}
function panelOpacity(panel,value){const center=Number(panel.dataset.center);if(panel.classList.contains('story-projects'))return smooth(5.25,5.9,value)*(1-smooth(8.05,8.65,value));if(panel.classList.contains('story-connect'))return smooth(10.25,10.95,value);return smooth(center-.8,center-.25,value)*(1-smooth(center+.35,center+.9,value))}
function update(now){
raf=0;const dt=Math.min(.05,(now-last)/1000);last=now;position+=(target-position)*(1-Math.exp(-dt/.1));if(Math.abs(target-position)<.0003)position=target;
const value=Math.max(0,Math.min(12.5,position)),mobile=width<800,base=Math.min(width,height)*(mobile?.19:.14),pose=key(value);

const radius=base*pose.r,cw=mix(radius*2,radius*pose.w*2,pose.m),ch=mix(radius*2,radius*pose.h*2,pose.m);
orbStage.style.left=`${pose.x*100}%`;orbStage.style.top=`${pose.y*100}%`;orbStage.style.width=`${cw}px`;orbStage.style.height=`${ch}px`;
hero._story={radius,morph:pose.m,half:[pose.w,pose.h],water:1-smooth(.15,.7,value),progress:value};
const opening=1-smooth(.05,.65,value);for(const el of hero.querySelectorAll('.hero-top,.hero-bottom,.orb-caption')){el.style.setProperty('--opening',opening);el.style.pointerEvents=opening>.1?'':'none';el.inert=opening<.1}
panels.forEach(panel=>{const alpha=panelOpacity(panel,value);panel.style.opacity=alpha;panel.style.visibility=alpha>.005?'visible':'hidden';panel.inert=alpha<.5;panel.setAttribute('aria-hidden',String(alpha<.5));const local=value-Number(panel.dataset.center);panel.style.setProperty('--travel',`${local}`);panel.querySelectorAll('.story-word').forEach((word,index)=>{const reveal=smooth(-.78+index*.022,-.3+index*.022,local);word.style.opacity=reveal;word.style.filter=`blur(${(1-reveal)*10}px)`})});
const shift=smooth(6.8,7.9,value),cardWidth=mobile?width*.78:width*.4;layer.querySelector('.story-gallery-track').style.transform=`translateX(${-shift*(cardWidth+width*.06)}px)`;layer.querySelector('.story-project-note').textContent=shift>.5?'Making the pieces click.':'An idea, made useful.';
layer.querySelector('.story-gallery-heading').style.opacity=1-smooth(6.85,7.35,value);const note=layer.querySelector('.story-glass-note');hero._storyNote=note;note.style.left=`${pose.x*width}px`;note.style.top=`${pose.y*height}px`;note.style.width=`${cw*.83}px`;note.style.opacity=smooth(.6,.95,pose.m);note.style.pointerEvents='none';
const historyAmount=smooth(8.25,9,value)*(1-smooth(10.05,10.8,value));hero.classList.toggle('story-light',historyAmount>.55);modeButton.style.color=historyAmount>.55?'#6f7366':'#ddd0bb88';document.querySelector('header').classList.toggle('story-dark-ink',value<.6||historyAmount>.55);
let chapter=0;chapters.forEach((c,i)=>{if(value>=c[1]-.5)chapter=i});if(chapter!==activeChapter){activeChapter=chapter;navigation.querySelector('.story-current').textContent=`${String(chapter+1).padStart(2,'0')} / ${chapters[chapter][0].toUpperCase()}`;chapterButtons.forEach((button,i)=>button.setAttribute('aria-current',i===chapter?'step':'false'))}
navigation.querySelector('.story-progress i').style.transform=`scaleX(${value/12.5})`;hero.dataset.storyChapter=String(chapter);
if(Math.abs(value-previousDraw)>.002){paint(value);previousDraw=value}
hero._particles?.draw(value,now,width,height);if(position!==target||hero._particles?.live(value))raf=requestAnimationFrame(update);
}
function request(){if(!raf){last=performance.now();raf=requestAnimationFrame(update)}}
function scroll(){target=Math.max(0,Math.min(12.5,(window.scrollY-runway.offsetTop)/height));request()}
function resize(){width=hero.clientWidth;height=hero.clientHeight;previousDraw=-100;const expected=innerWidth<760?'assets/reference-scene-tall.webp':'assets/reference-scene-wide.webp';if(!source.src.endsWith(expected))source.src=expected;scroll()}
for(const heading of layer.querySelectorAll('h2,.story-giant')){const walker=document.createTreeWalker(heading,NodeFilter.SHOW_TEXT);const text=[];while(walker.nextNode())text.push(walker.currentNode);text.forEach(node=>{const fragment=document.createDocumentFragment();node.textContent.split(/(\s+)/).forEach(word=>{if(!word.trim())fragment.append(word);else{const span=document.createElement('span');span.className='story-word';span.textContent=word;fragment.append(span)}});node.replaceWith(fragment)})}
source.onload=()=>{previousDraw=-100;request()};hero.addEventListener('scene-ready',()=>{previousDraw=-100;request()});window.addEventListener('scroll',scroll,{passive:true});window.addEventListener('resize',resize,{passive:true});
document.addEventListener('visibilitychange',()=>{if(!document.hidden)request()});document.body.classList.add('story-ready');scroll();const hash=location.hash.slice(1);if(hash in destinations)setTimeout(()=>go(destinations[hash]),100);
}
if(hero.classList.contains('shared-scene-ready'))initialise();else hero.addEventListener('scene-ready',initialise,{once:true});
})();
