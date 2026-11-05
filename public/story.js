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
  <p class="story-kicker">01 / THE PERSON</p><div class="split-statement"><h2>I like knowing<br>how things work.</h2><h2>And making them<br>look good.</h2></div><p class="story-footnote">LEARNING AND BUILDING</p>
</section>
<section class="story-panel story-background" data-center="3" aria-label="My background" aria-hidden="true" inert>
  <h2>I like knowing how things work.<br><span>And making them look good.</span></h2><p class="story-side-copy">I'm Griz. My background is computer science, web design, and graphic design, so I care as much about how something works under the hood as how it looks and feels to use. I spend a chunk of every day learning about AI and building apps and small tools to help with my own day-to-day. When one actually makes my routine easier, I package it up and put it in my Etsy shop for others.</p><span class="story-corner-label">MOVE TO EXPLORE · CLICK TO SEND A SIGNAL</span>
</section>
<section class="story-panel story-interests" data-center="4.5" aria-label="AI and technology interests" aria-hidden="true" inert>
  <p class="story-kicker">02 / FOLLOWING THE QUESTIONS</p><h2>Less standing still.</h2><div class="story-giant">More what if?</div><div class="floating-topics"><span>Artificial intelligence</span><span>Connected systems</span><span>Ideas → experiments</span><span>Learning by doing</span><span>People & technology</span><span>What comes next?</span></div><p class="story-footnote">What I spend my time learning and building.</p>
</section>
<section class="story-panel story-projects" data-center="7" aria-label="Project explorations" aria-hidden="true" inert>
  <div class="story-gallery-heading"><p class="story-kicker">APPS, TOOLS &amp; DIGITAL STUFF</p><h2>Some things<br> I've <em>built.</em></h2><p>AI apps I built for my own day-to-day life, and digital products I make for others.</p></div>
  <div class="story-gallery-track"><button class="story-project" data-open-project="0"><span class="story-project-art story-art-ai"><i class="glass-cube"></i><small>THOUGHT → SYSTEM</small></span><span class="story-project-meta"><small>APP / DAILY HELPER</small><strong>Personal AI App</strong><span>An app I built for myself that uses AI to take the headache out of everyday tasks and get them done quicker.</span></span></button><button class="story-project" data-open-project="1"><span class="story-project-art story-art-tech"><i class="rings"></i><small>CONNECT THE DOTS</small></span><span class="story-project-meta"><small>ETSY SHOP / DIGITAL PRODUCTS</small><strong>Digital Routine Tools</strong><span>My Etsy shop, where I design digital planners, templates, and tools to help people get a bit more organized.</span></span></button></div>
  <div class="story-glass-note"><small>THE EXPLORATION</small><p class="story-project-note">An idea, made useful.</p><span>Keep scrolling to explore →</span></div>
</section>
<section class="story-panel story-history" data-center="9.4" aria-label="Experience" aria-hidden="true" inert>
  <p class="story-kicker">04 / THE BACKGROUND</p><h2>Built on <em>technology</em> <span>and design.<br>AI keeps me learning.</span></h2><div class="story-timeline"><article><small>THE BACKGROUND / IT &amp; DESIGN</small><h3>CS, Web &amp; Graphic Design</h3><p>Code · Websites · Visuals</p><p>With a background in both computer science and design, I can make something work and make it look good, and I build both from scratch.</p></article><article><small>THE SIDE HUSTLE / ETSY</small><h3>Digital Product Creator</h3><p>Online Business · Routine Helpers</p><p>I run a digital shop on Etsy selling simple, useful downloads that help people organize their routines.</p></article><article><small>THE DAILY HABIT / AI</small><h3>Always Learning AI</h3><p>Self-Taught · Building Apps · Experimenting</p><p>I teach myself about AI every day. Rather than only reading about it, I build apps and tools I use in real life.</p></article></div><p class="story-history-note">HOW IT ALL CONNECTS</p>
</section>
<section class="story-panel story-connect" data-center="11.2" aria-label="Connect with Griz" aria-hidden="true" inert>
  <p class="story-kicker">05 / SAY HELLO</p><p>Always down to chat about tech, AI, design, or cool digital tools.</p><h2>What could<br>we make?</h2><button class="story-connect-button">Let’s connect <span>↗</span></button><small>grizville.chand@gmail.com</small>
</section>`;
const M=window.GrizMotion;
const extraScenes=[
 ['workspace',11.2,'THE WAY I THINK','See the whole system.','Connections matter as much as the individual pieces.'],
 ['signal',12.8,'FOLLOW THE SIGNAL','Find what matters.','Ask better questions. Make the complicated feel clear.'],
 ['quiet',14.4,'BUILT WITH INTENTION','Less noise.<br>More useful.','Technology should make room for people.'],
 ['night',16,'ROOM TO THINK','A little space.<br>A new perspective.','Some ideas arrive when you stop chasing them.'],
 ['notes',17.6,'NOTES FROM THE EXPLORATION','Small ideas.<br>Worth keeping.','A few things I keep coming back to.'],
 ['principles',19.2,'PLAINLY PUT','Stay curious.<br>Make things.<br>Keep learning.','A technical background. An open-ended future.'],
 ['toolkit',20.8,'A GROWING TOOLKIT','Where curiosity lands.','Three connected interests. One ongoing exploration.']
];
for(const [name,center,kicker,title,copy] of extraScenes){
 const section=document.createElement('section');section.className='story-panel story-'+name;section.dataset.center=center;section.setAttribute('aria-label',name);section.setAttribute('aria-hidden','true');section.inert=true;
 section.innerHTML=`<p class="story-kicker">${kicker}</p><h2>${title}</h2><p class="scene-description">${copy}</p>`;layer.append(section);
}
const notes=['Build stuff you actually use.','Make the routine easier.','Connect the dots.','Make the useful thing.','Keep the human in the loop.','Try it. Then improve it.','Follow the interesting part.','Leave room for what comes next.'];
const wall=document.createElement('div');wall.className='note-wall';wall.innerHTML=notes.map((text,i)=>`<article class="wall-card"><p>${text}</p><small><i></i> GRIZ · NOTE ${String(i+1).padStart(2,'0')}</small></article>`).join('');layer.querySelector('.story-notes').append(wall);
const toolkit=layer.querySelector('.story-toolkit');toolkit.insertAdjacentHTML('beforeend',`<div class="toolkit-picker" role="tablist" aria-label="Explore my interests"><button role="tab" id="tool-ai" aria-controls="tool-detail" aria-selected="true" data-tool="0">AI</button><button role="tab" id="tool-systems" aria-controls="tool-detail" aria-selected="false" tabindex="-1" data-tool="1">Systems</button><button role="tab" id="tool-experiments" aria-controls="tool-detail" aria-selected="false" tabindex="-1" data-tool="2">Experiments</button></div><div class="toolkit-detail" id="tool-detail" role="tabpanel" aria-labelledby="tool-ai"><h3></h3><p></p><small>WHAT I SPEND MY TIME LEARNING AND BUILDING</small></div>`);
const toolData=[["Everyday AI","I learn something new about AI every day and build apps that help me get daily tasks done faster."],["Design & Code","My computer science background plus web and graphic design, so what I build looks good and works smoothly."],["Easier Routines","My Etsy shop sells digital products I make to help with daily routines."]];
const toolButtons=[...toolkit.querySelectorAll('[role=tab]')];
function selectTool(index){toolButtons.forEach((b,i)=>{b.setAttribute('aria-selected',String(i===index));b.tabIndex=i===index?0:-1});const detail=toolkit.querySelector('.toolkit-detail');detail.setAttribute('aria-labelledby',toolButtons[index].id);detail.querySelector('h3').textContent=toolData[index][0];detail.querySelector('p').textContent=toolData[index][1];detail.animate([{opacity:0,filter:'blur(8px)'},{opacity:1,filter:'blur(0)'}],{duration:420});}
toolButtons.forEach((b,i)=>{b.addEventListener('click',()=>selectTool(i));b.addEventListener('keydown',e=>{let next;if(e.key==='ArrowRight')next=(i+1)%3;if(e.key==='ArrowLeft')next=(i+2)%3;if(e.key==='Home')next=0;if(e.key==='End')next=2;if(next!==undefined){e.preventDefault();selectTool(next);toolButtons[next].focus()}})});selectTool(0);
layer.querySelector('.story-connect').dataset.center='22.4';
const panels=[...layer.querySelectorAll('.story-panel')];
const bloom=document.createElement('div');bloom.className='story-bloom';bloom.setAttribute('aria-hidden','true');hero.append(bloom);
layer.querySelectorAll('[data-open-project]').forEach(button=>button.addEventListener('click',()=>document.querySelector(`.project[data-project="${button.dataset.openProject}"]`).click()));
layer.querySelector('.story-connect-button').addEventListener('click',()=>document.querySelector('.contact-button').click());
const navigation=document.createElement('nav');navigation.className='story-navigation';navigation.setAttribute('aria-label','Story chapters');
const chapters=[['Opening',0],['The person',1.5],['Background',3],['Interests',4.5],['Projects',6.8],['Experience',9.4],['Systems',11.2],['Signal',12.8],['Intention',14.4],['Perspective',16],['Notes',17.6],['Principles',19.2],['Toolkit',20.8],['Connect',22.4]];
navigation.innerHTML=`<span class="story-current">01 / OPENING</span><div>${chapters.map(([name,position])=>`<button aria-label="Go to ${name}" data-position="${position}"><i></i></button>`).join('')}</div><span class="story-progress"><i></i></span>`;hero.append(navigation);
const chapterButtons=[...navigation.querySelectorAll('button')];chapterButtons.forEach(button=>button.addEventListener('click',()=>go(Number(button.dataset.position))));
function go(position){window.scrollTo({top:runway.offsetTop+M.toScroll(position)*hero.clientHeight,behavior:'smooth'})}
const destinations={about:1.5,focus:4.5,work:6.8,experience:9.4,contact:22.4};
document.addEventListener('click',e=>{const link=e.target.closest('a[href^="#"]');if(!link)return;const id=link.getAttribute('href').slice(1);if(!id){e.preventDefault();go(0)}else if(id in destinations){e.preventDefault();go(destinations[id]);history.replaceState(null,'',`#${id}`)}});
const source=new Image();source.src=innerWidth<760?'assets/reference-scene-tall.webp':'assets/reference-scene-wide.webp';
const composite=document.createElement('canvas');composite.width=composite.height=2048;const ctx=composite.getContext('2d');
const orbStage=document.querySelector('.orb-stage'),orb=document.querySelector('.orb');
let width=hero.clientWidth,height=hero.clientHeight,position=0,target=0,last=performance.now(),raf=0,previousDraw=-100,activeChapter=-1;
const clamp=n=>Math.max(0,Math.min(1,n)),mix=(a,b,t)=>a+(b-a)*t,smooth=(a,b,n)=>{const t=clamp((n-a)/(b-a));return t*t*(3-2*t)};
const keys=[
 {at:0,x:.5,y:.52,r:1,m:0,w:1,h:1},
 {at:1.5,x:.5,y:.51,r:1.12,m:0,w:1,h:1},
 {at:3,x:.5,y:.49,r:.52,m:0,w:1,h:1},
 {at:4.5,x:.5,y:.52,r:.92,m:0,w:1,h:1},
 {at:6.1,x:.69,y:.72,r:.92,m:1,w:2.1,h:.9},
 {at:7.8,x:.69,y:.72,r:.92,m:1,w:2.1,h:.9},
 {at:9.4,x:.27,y:.54,r:1.35,m:0,w:1,h:1},
 {at:11.2,x:.66,y:.55,r:1.1,m:0,w:1,h:1},
 {at:12.8,x:.67,y:.56,r:1.0,m:0,w:1,h:1},
 {at:14.4,x:.68,y:.55,r:1.1,m:1,w:1.8,h:.9},
 {at:16,x:.67,y:.48,r:.85,m:0,w:1,h:1},
 {at:17.6,x:.5,y:.52,r:.55,m:0,w:1,h:1},
 {at:19.2,x:.77,y:.56,r:1.2,m:0,w:1,h:1},
 {at:20.8,x:.76,y:.56,r:1.2,m:0,w:1,h:1},
 {at:22.4,x:.74,y:.49,r:1.4,m:0,w:1,h:1},
 {at:23.2,x:.74,y:.49,r:1.4,m:0,w:1,h:1}
];
function covered(image){if(!image.complete||!image.naturalWidth)return;const scale=Math.max(width/image.naturalWidth,height/image.naturalHeight);ctx.drawImage(image,(width-image.naturalWidth*scale)/2,(height-image.naturalHeight*scale)/2,image.naturalWidth*scale,image.naturalHeight*scale)}
function dark(){ctx.fillStyle='#1f1611';ctx.fillRect(0,0,width,height);const glow=ctx.createRadialGradient(width*.51,height*.95,0,width*.51,height*.95,width*.65);glow.addColorStop(0,'#8e4f2438');glow.addColorStop(1,'#25170c00');ctx.fillStyle=glow;ctx.fillRect(0,0,width,height)}
function artwork(x,y,w,h,kind){ctx.save();ctx.beginPath();ctx.rect(x,y,w,h);ctx.clip();const gradient=ctx.createLinearGradient(x,y,x+w,y+h);gradient.addColorStop(0,kind?'#e9d7bb':'#d8dec5');gradient.addColorStop(1,kind?'#a58d70':'#768b6d');ctx.fillStyle=gradient;ctx.fillRect(x,y,w,h);ctx.translate(x+w*.5,y+h*.46);if(kind){ctx.strokeStyle='#fff8dd9c';ctx.lineWidth=Math.min(w,h)*.09;ctx.beginPath();ctx.ellipse(0,0,w*.22,h*.24,-.35,0,Math.PI*2);ctx.stroke();ctx.strokeStyle='#5f695e55';ctx.lineWidth=2;ctx.stroke()}else{ctx.rotate(-.35);ctx.fillStyle='#f1f6dc55';ctx.strokeStyle='#fff9dbaa';ctx.lineWidth=2;ctx.beginPath();ctx.roundRect(-w*.18,-h*.16,w*.36,h*.32,25);ctx.fill();ctx.stroke()}ctx.restore()}

const topicLabels=['Artificial intelligence','Connected systems','Ideas → experiments','Learning by doing','People & technology','What comes next?','Build a prototype','Ask better questions','Find the signal','Make it useful','Keep exploring','Connect the dots'];
let pointer={x:-10000,y:-10000},clock=0,paperPulse=null;
hero.addEventListener('pointermove',e=>{const box=hero.getBoundingClientRect();pointer={x:e.clientX-box.left,y:e.clientY-box.top};request()},{passive:true});hero.addEventListener('pointerleave',()=>{pointer={x:-10000,y:-10000};request()});
hero.addEventListener('pointerdown',e=>{const box=hero.getBoundingClientRect();paperPulse={x:e.clientX-box.left,y:e.clientY-box.top,time:performance.now()/1000};request()},{passive:true});
function topics(value){
 const show=smooth(3.6,4.1,value)*(1-smooth(5.25,5.8,value));if(show<=0)return;
 topicLabels.forEach((label,i)=>{
  const pose=M.paper(i,topicLabels.length,value,width,height,clock);if(pose.alpha<.002)return;
  const dx=pose.x-pointer.x,dy=pose.y-pointer.y,dist=Math.hypot(dx,dy);let repel=Math.exp(-dist*dist/14000)*14;
  if(paperPulse){const age=clock-paperPulse.time,px=pose.x-paperPulse.x,py=pose.y-paperPulse.y,d=Math.hypot(px,py)||1;if(age<2){const force=Math.exp(-Math.pow((d-age*350)/90,2))*Math.exp(-age*1.5)*50;pose.x+=px/d*force;pose.y+=py/d*force;pose.rotation+=force*.003}}
  ctx.save();ctx.globalAlpha=pose.alpha;ctx.translate(pose.x+dx/(dist||1)*repel,pose.y+dy/(dist||1)*repel);ctx.rotate(pose.rotation);ctx.scale(pose.scale,pose.scale);
  ctx.font='11px Manrope, sans-serif';const w=ctx.measureText(label).width+39,h=42;
  ctx.shadowColor='#0005';ctx.shadowBlur=14;ctx.shadowOffsetY=5;ctx.fillStyle='#f6f1ea';ctx.beginPath();ctx.roundRect(-w/2,-h/2,w,h,2);ctx.fill();ctx.shadowColor='transparent';
  ctx.strokeStyle='#79766c';ctx.lineWidth=.7;ctx.strokeRect(-w/2+10,-4,8,8);ctx.fillStyle='#302b25';ctx.textAlign='left';ctx.textBaseline='middle';ctx.fillText(label,-w/2+24,1);
  if(pose.heat>0){const g=ctx.createLinearGradient(-w/2-9,0,-w/2+12,0);g.addColorStop(0,'#ee842700');g.addColorStop(.45,'#ffb950');g.addColorStop(.6,'#fff8d4');g.addColorStop(1,'#ee842700');ctx.globalAlpha*=pose.heat;ctx.shadowColor='#ff9d31';ctx.shadowBlur=20;ctx.fillStyle=g;ctx.fillRect(-w/2-9,-h/2-6,21,h+12)}ctx.restore();
 });
}
// One canvas text composition continues from the papers into the gallery.
function paperTypography(value){
 if(value<3.6||value>7.35)return;
 const state=M.paperText(value),mobile=width<800,large='More what if?',small='Less standing still.';
 const left=width*(mobile?.07:.05),dockY=height*(mobile?.17:.31),kickerY=height*(mobile?.13:.25);
 let size=mobile?width*.29:Math.min(width*.26,height*.46);
 ctx.save();ctx.font=`300 ${size}px Manrope, sans-serif`;ctx.letterSpacing=`${-.06*size}px`;
 let measured=ctx.measureText(large).width;if(measured>width*.94){size*=width*.94/measured;ctx.font=`300 ${size}px Manrope, sans-serif`;ctx.letterSpacing=`${-.06*size}px`;measured=ctx.measureText(large).width}
 const finalSize=mobile?28:Math.min(40,width*.033),fontSize=mix(size,finalSize,state.dock);
 const x=mix(mix(width*1.02,(width-measured)/2,state.slide),left,state.dock),y=mix(height*.5,dockY,state.dock);
 if(state.enter>0){
  ctx.textAlign='left';ctx.textBaseline='middle';ctx.font=`300 ${fontSize}px Manrope, sans-serif`;ctx.letterSpacing=`${mix(-.06,-.03,state.dock)*fontSize}px`;
  const heat=state.glow;
  if(heat>0){const light=ctx.createRadialGradient(width*.5,y,0,width*.5,y,Math.max(width,height)*.55);light.addColorStop(0,`rgba(214,110,40,${.32*heat*state.exit})`);light.addColorStop(1,'#d66e2800');ctx.fillStyle=light;ctx.fillRect(0,0,width,height)}
  ctx.globalAlpha=state.exit*.94;ctx.fillStyle=`rgb(${Math.round(mix(244,255,heat))},${Math.round(mix(238,196,heat))},${Math.round(mix(229,140,heat))})`;ctx.fillText(large,x,y);
  if(heat>0){ctx.globalCompositeOperation='lighter';ctx.globalAlpha=state.exit*heat*.45;ctx.fillStyle='#f27a28';ctx.filter=`blur(${fontSize*.05}px)`;ctx.fillText(large,x,y);ctx.globalAlpha=state.exit*heat*.35;ctx.filter=`blur(${fontSize*.16}px)`;ctx.fillText(large,x,y);ctx.globalCompositeOperation='source-over';ctx.filter='none'}
 }
 let topSize=mobile?Math.min(44,Math.max(30,width*.095)):Math.min(84,Math.max(44,width*.05));
 ctx.font=`400 ${topSize}px Manrope, sans-serif`;ctx.letterSpacing=`${-.03*topSize}px`;let tw=ctx.measureText(small).width;if(tw>width*.88){topSize*=width*.88/tw;tw=width*.88}
 const topFont=mix(topSize,mobile?10:16,state.topDock),topX=mix((width-tw)/2,left,state.topDock),topY=mix(height*(mobile?.2:.17),kickerY,state.topDock);
 ctx.font=`400 ${topFont}px Manrope, sans-serif`;ctx.letterSpacing=`${mix(-.03,-.01,state.topDock)*topFont}px`;ctx.textAlign='left';ctx.textBaseline='middle';ctx.fillStyle='#f4eee5';
 for(let i=0;i<small.length;i++){const focus=M.focus(i,small.length,state.topReveal,0);ctx.globalAlpha=focus.alpha*state.exit*mix(.92,.7,state.topDock);ctx.filter=focus.blur>.3?`blur(${focus.blur}px)`:'none';ctx.fillText(small[i],topX+ctx.measureText(small.slice(0,i)).width,topY)}
 ctx.restore();
}
function systemScene(value){
 const amount=smooth(10.35,10.95,value)*(1-smooth(13.2,13.65,value));if(!amount)return;
 ctx.save();ctx.globalAlpha=amount;const cx=width*(width<800?.5:.67),cy=height*.57,size=Math.min(width*.7,height*.65);ctx.translate(cx,cy);
 const heat=smooth(11.8,12.6,value);
 ctx.strokeStyle='#b6c4bd44';ctx.lineWidth=1;
 for(let row=0;row<4;row++)for(let col=0;col<5;col++){
  const x=(col-2)*size*.18,y=(row-1.5)*size*.18;
  ctx.fillStyle='#c6d4ca12';ctx.strokeStyle='#ccd6cc55';ctx.beginPath();ctx.roundRect(x-size*.065,y-size*.065,size*.13,size*.13,3);ctx.fill();ctx.stroke();
  if(col<4){ctx.beginPath();ctx.moveTo(x+size*.065,y);ctx.lineTo(x+size*.115,y);ctx.stroke()}
  if(row<3){ctx.beginPath();ctx.moveTo(x,y+size*.065);ctx.lineTo(x,y+size*.115);ctx.stroke()}
  const hot=(row===1&&col===3)||(row===2&&col===1);if(hot&&heat){const glow=ctx.createRadialGradient(x,y,0,x,y,size*.17);glow.addColorStop(0,'#ffb858');glow.addColorStop(.25,'#df6b3655');glow.addColorStop(1,'#b4401600');ctx.globalAlpha=amount*heat*(.8+.2*Math.sin(clock*1.8+col));ctx.fillStyle=glow;ctx.fillRect(x-size*.17,y-size*.17,size*.34,size*.34);ctx.globalAlpha=amount}
 }ctx.restore();
}

function paint(value){
ctx.setTransform(2048/width,0,0,2048/height,0,0);ctx.globalAlpha=1;ctx.filter='none';dark();
const opening=1-smooth(.2,1.05,value);if(opening>0){ctx.save();ctx.globalAlpha=opening;ctx.filter=`blur(${smooth(.15,.95,value)*15}px)`;covered(source);ctx.restore()}
const interest=smooth(3.65,4.25,value)*(1-smooth(5.15,5.8,value));if(interest>0){ctx.save();ctx.globalAlpha=interest*.14;ctx.strokeStyle='#ebc49c';ctx.lineWidth=1;ctx.setLineDash([2,5]);const r=Math.min(width,height)*.24;ctx.strokeRect(width*.5-r,height*.52-r,r*2,r*2);ctx.beginPath();ctx.arc(width*.5,height*.52,r*.88,0,Math.PI*2);ctx.stroke();ctx.restore()}
paperTypography(value);topics(value);
const gallery=smooth(5.25,5.9,value)*(1-smooth(8.1,8.8,value));if(gallery>0){ctx.save();ctx.globalAlpha=gallery;const mobile=width<800,w=mobile?width*.78:width*.4,h=height*(mobile?.51:.67),galleryY=height*(mobile?.30:.16);const slide=smooth(6.8,7.9,value);const x=(mobile?width*.11:width*.34)-slide*(w+width*.06);[0,1].forEach(i=>{const scale=mobile?1:.48+.52*(i?slide:1-slide);ctx.save();ctx.translate(x+i*(w+width*.06),galleryY+h/2);ctx.scale(scale,scale);artwork(0,-h/2,w,h,i);ctx.restore()});ctx.restore()}
const history=smooth(8.25,9,value)*(1-smooth(10.05,10.8,value));if(history>0){ctx.save();ctx.globalAlpha=history;ctx.fillStyle='#eeece2';ctx.fillRect(0,0,width,height);ctx.strokeStyle='#b7b8a845';ctx.lineWidth=1;for(let i=0;i<9;i++){ctx.beginPath();ctx.arc(width*.25,height*.54,40+i*22,0,Math.PI*2);ctx.stroke()}ctx.restore()}
systemScene(value);
const quiet=smooth(13.3,14,value)*(1-smooth(14.95,15.5,value));if(quiet){ctx.save();ctx.globalAlpha=quiet;const g=ctx.createLinearGradient(0,0,width,height);g.addColorStop(0,'#182735');g.addColorStop(1,'#789998');ctx.fillStyle=g;ctx.fillRect(0,0,width,height);ctx.restore()}
const night=smooth(14.95,15.65,value)*(1-smooth(16.35,16.95,value));if(night){ctx.save();ctx.globalAlpha=night;ctx.fillStyle='#111b21';ctx.fillRect(0,0,width,height);for(let i=0;i<90;i++){const x=(Math.sin(i*127.1)*43758.5453%1+1)%1*width,y=(Math.sin(i*311.7)*19341.12%1+1)%1*height*.8;ctx.globalAlpha=night*(.25+.35*(1+Math.sin(clock*.3+i))*.5);ctx.fillStyle='#ebd7b7';ctx.fillRect(x,y,1.4,1.4)}ctx.restore()}
const closing=smooth(21.5,22.2,value);if(closing>0){ctx.save();ctx.globalAlpha=closing;covered(source);ctx.fillStyle='#1b190acc';ctx.fillRect(0,0,width,height);ctx.restore()}
hero._storyCanvas=composite;hero.dispatchEvent(new CustomEvent('story-background',{detail:{canvas:composite,width,height}}));
}
function key(value){
const frames=width<800?keys.map(p=>{if(p.at===6.1||p.at===7.8)return {...p,x:.58,y:.76,w:1.8,h:.83};if(p.at===9.4)return {...p,x:.23,y:.43,r:.7};if(p.at===14.4)return {...p,x:.5,y:.57,r:1,w:1.8,h:.9};if(p.at===20.8)return {...p,x:.82,y:.81,r:.55};if(p.at===11.2||p.at===12.8)return {...p,x:.5,y:.57,r:1};if(p.at>=22.4)return {...p,x:.78,y:.66,r:.85};return p}):keys;
let a=frames[0],b=frames.at(-1);for(let i=0;i<frames.length-1;i++){if(value>=frames[i].at&&value<=frames[i+1].at){a=frames[i];b=frames[i+1];break}}const t=smooth(a.at,b.at,value),out={};for(const prop of ['x','y','r','m','w','h'])out[prop]=mix(a[prop],b[prop],t);return out}
function panelOpacity(panel,value){const center=Number(panel.dataset.center);if(panel.classList.contains('story-projects'))return smooth(5.25,5.9,value)*(1-smooth(8.05,8.65,value));if(panel.classList.contains('story-connect'))return smooth(21.55,22.2,value);return smooth(center-.8,center-.25,value)*(1-smooth(center+.35,center+.9,value))}
function update(now){
raf=0;const dt=Math.min(.05,(now-last)/1000);last=now;position+=(target-position)*(1-Math.exp(-dt/.1));if(Math.abs(target-position)<.0003)position=target;
clock=now/1000;const value=Math.max(0,Math.min(M.end,position)),mobile=width<800,base=Math.min(width,height)*(mobile?.19:.14),pose=key(value);

const radius=base*pose.r,cw=mix(radius*2,radius*pose.w*2,pose.m),ch=mix(radius*2,radius*pose.h*2,pose.m);
orbStage.style.left=`${pose.x*100}%`;orbStage.style.top=`${pose.y*100}%`;orbStage.style.width=`${cw}px`;orbStage.style.height=`${ch}px`;
hero._story={radius,morph:pose.m,half:[pose.w,pose.h],water:1-smooth(.15,.7,value),progress:value};
const opening=1-smooth(.05,.65,value);for(const el of hero.querySelectorAll('.hero-top,.hero-bottom,.orb-caption')){el.style.setProperty('--opening',opening);el.style.pointerEvents=opening>.1?'':'none';el.inert=opening<.1}
panels.forEach(panel=>{const alpha=panelOpacity(panel,value);panel.style.opacity=alpha;panel.style.visibility=alpha>.005?'visible':'hidden';panel.inert=alpha<.5;panel.setAttribute('aria-hidden',String(alpha<.5));if(alpha<.005)return;const local=value-Number(panel.dataset.center);panel.style.setProperty('--travel',`${local}`);const enter=M.range(-.8,-.2,local),exit=panel.classList.contains('story-connect')?0:panel.classList.contains('story-projects')?M.range(1.05,1.65,local):M.range(.35,.9,local);(panel._chars||[]).forEach((char,index)=>{const f=M.focus(index,panel._chars.length,enter,exit);char.style.opacity=f.alpha;char.style.filter=f.blur<.08?'none':`blur(${f.blur.toFixed(1)}px)`})});
const shift=smooth(6.8,7.9,value),cardWidth=mobile?width*.78:width*.4;layer.querySelector('.story-gallery-track').style.transform=`translateX(${-shift*(cardWidth+width*.06)}px)`;layer.querySelector('.story-project-note').textContent=shift>.5?'Digital Routine Tools':'Personal AI App';layer.querySelectorAll('.story-project').forEach((card,i)=>{card.style.transform=`scale(${mobile?1:.48+.52*(i?shift:1-shift)})`;card.setAttribute('aria-label',i?'Open Digital Routine Tools':'Open Personal AI App')});
layer.querySelector('.story-gallery-heading').style.opacity=1-smooth(6.85,7.35,value);const note=layer.querySelector('.story-glass-note');hero._storyNote=note;note.style.left=`${pose.x*width}px`;note.style.top=`${pose.y*height}px`;note.style.width=`${cw*.83}px`;note.style.opacity=smooth(.6,.95,pose.m);note.style.pointerEvents='none';
const quietNote=layer.querySelector('.quiet-note');if(quietNote){quietNote.style.left=`${pose.x*width}px`;quietNote.style.top=`${pose.y*height}px`;quietNote.style.width=`${cw*.8}px`;if(value>13.3&&value<15.5)hero._storyNote=quietNote}
const wallEntry=M.range(16.8,17.5,value),wallExit=M.range(18,18.5,value);
wall.querySelectorAll('.wall-card').forEach((card,i)=>{const t=M.ease((wallEntry*1.45-i*.055)),out=M.ease(wallExit);card.style.opacity=t*(1-out);card.style.transform=`translate3d(${(1-t)*(i%2?170:-170)+out*(i%2?120:-120)}px,${(1-t)*260-out*180}px,0) rotate(${(1-t)*(i%2?18:-18)+out*(i%2?12:-12)}deg) scale(${.72+t*.28-out*.1})`});
bloom.style.opacity=(smooth(3.25,3.55,value)*(1-smooth(3.55,3.85,value))*.8).toFixed(3);
const historyAmount=smooth(8.25,9,value)*(1-smooth(10.05,10.8,value));hero.classList.toggle('story-light',historyAmount>.55);modeButton.style.color=historyAmount>.55?'#6f7366':'#ddd0bb88';document.querySelector('header').classList.toggle('story-dark-ink',value<.6||historyAmount>.55);
let chapter=0;chapters.forEach((c,i)=>{if(value>=c[1]-.5)chapter=i});if(chapter!==activeChapter){activeChapter=chapter;navigation.querySelector('.story-current').textContent=`${String(chapter+1).padStart(2,'0')} / ${chapters[chapter][0].toUpperCase()}`;chapterButtons.forEach((button,i)=>button.setAttribute('aria-current',i===chapter?'step':'false'))}
navigation.querySelector('.story-progress i').style.transform=`scaleX(${value/M.end})`;hero.dataset.storyChapter=String(chapter);
const alive=value>3.6&&value<5.8||value>10.35&&value<16.95;if(Math.abs(value-previousDraw)>.002||alive&&now-(hero._lastPaint||0)>40){paint(value);previousDraw=value;hero._lastPaint=now}
hero._particles?.draw(value,now,width,height);if(position!==target||alive||hero._particles?.live(value))raf=requestAnimationFrame(update);
}
function request(){if(!raf){last=performance.now();raf=requestAnimationFrame(update)}}
function scroll(){target=Math.max(0,Math.min(M.end,M.toScene((window.scrollY-runway.offsetTop)/height)));request()}
function resize(){width=hero.clientWidth;height=hero.clientHeight;previousDraw=-100;const expected=innerWidth<760?'assets/reference-scene-tall.webp':'assets/reference-scene-wide.webp';if(!source.src.endsWith(expected))source.src=expected;scroll()}
for(const panel of panels){panel._chars=[];for(const heading of panel.querySelectorAll('h2,.story-kicker,.scene-description,.story-side-copy,.story-footnote')){if(heading.matches('h2')){const readable=heading.cloneNode(true);readable.querySelectorAll('br').forEach(br=>br.replaceWith(' '));heading.setAttribute('aria-label',readable.textContent.trim());}const walker=document.createTreeWalker(heading,NodeFilter.SHOW_TEXT),nodes=[];while(walker.nextNode())nodes.push(walker.currentNode);for(const node of nodes){const fragment=document.createDocumentFragment();for(const word of node.textContent.split(/(\s+)/)){if(!word.trim()){fragment.append(word);continue}const span=document.createElement('span');span.className='story-word';if(heading.matches('h2'))span.setAttribute('aria-hidden','true');for(const letter of word){const char=document.createElement('span');char.className='story-char';char.textContent=letter;span.append(char);panel._chars.push(char)}fragment.append(span)}node.replaceWith(fragment)}}}
layer.querySelector('.story-quiet').insertAdjacentHTML('beforeend','<div class="quiet-note"><small>GRIZ / A WORKING PRINCIPLE</small><p>Useful technology.<br>A little more room to think.</p></div>');
runway.style.height=`${(M.toScroll(M.end)+1)*100}svh`;

source.onload=()=>{previousDraw=-100;request()};hero.addEventListener('scene-ready',()=>{previousDraw=-100;request()});window.addEventListener('scroll',scroll,{passive:true});window.addEventListener('resize',resize,{passive:true});
document.addEventListener('visibilitychange',()=>{if(!document.hidden)request()});document.body.classList.add('story-ready');scroll();const hash=location.hash.slice(1);if(hash in destinations)setTimeout(()=>go(destinations[hash]),100);
}
if(hero.classList.contains('shared-scene-ready'))initialise();else hero.addEventListener('scene-ready',initialise,{once:true});
})();

