// Interactive inference sculpture. Visual metaphor, not measured AI activity.
(()=>{
const hero=document.querySelector('.hero'),canvas=document.createElement('canvas'),ctx=canvas.getContext('2d');
const clamp=n=>Math.max(0,Math.min(1,n)),mix=(a,b,t)=>a+(b-a)*t;
const smooth=(a,b,v)=>{const t=clamp((v-a)/(b-a));return t*t*(3-2*t)};
const tau=Math.PI*2,layers=7,perLayer=12;
const nodes=Array.from({length:layers*perLayer},(_,i)=>({layer:Math.floor(i/perLayer),slot:i%perLayer}));
const edges=[];for(let l=0;l<layers-1;l++)for(let j=0;j<perLayer;j++)for(const offset of [0,1,5])edges.push([l*perLayer+j,(l+1)*perLayer+(j+offset)%perLayer]);
const sprite=document.createElement('canvas');sprite.width=sprite.height=64;const sc=sprite.getContext('2d'),g=sc.createRadialGradient(32,32,0,32,32,32);g.addColorStop(0,'#ffffef');g.addColorStop(.1,'#e5f8eecc');g.addColorStop(.35,'#8dd6cb33');g.addColorStop(1,'#8dd6cb00');sc.fillStyle=g;sc.fillRect(0,0,64,64);
let pointerX=0,pointerY=0,turnX=0,turnY=0,pulse=-100,last=-100,wasVisible=false;
function live(value){return value>1.85&&value<4.4&&!document.hidden}
hero.addEventListener('pointermove',e=>{const b=hero.getBoundingClientRect();pointerX=(e.clientX-b.left)/b.width-.5;pointerY=(e.clientY-b.top)/b.height-.5},{passive:true});
hero.addEventListener('pointerleave',()=>{pointerX=pointerY=0});
hero.addEventListener('pointerdown',()=>pulse=performance.now()/1000,{passive:true});
hero.addEventListener('keydown',e=>{if(e.target.closest('.orb')&&['Enter',' '].includes(e.key)){e.preventDefault();pulse=performance.now()/1000}});
function draw(value,now,width,height){
 const visible=live(value);if(!visible&&!wasVisible)return;if(visible&&now-last<33)return;last=now;wasVisible=visible;
 const size=width<800?1024:1536;if(canvas.width!==size)canvas.width=canvas.height=size;
 ctx.setTransform(1,0,0,1,0,0);ctx.clearRect(0,0,size,size);
 if(visible){
  ctx.setTransform(size/width,0,0,size/height,0,0);
  const mobile=width<800,t=now/1000,enter=smooth(1.9,2.7,value),exit=smooth(3.45,4.35,value),fade=smooth(1.85,2.3,value)*(1-smooth(3.9,4.4,value));
  const radius=Math.min(width*(mobile?.31:.27),height*.28),cx=width*.5,cy=height*(mobile?.5:.49),age=t-pulse,burst=age>=0&&age<2.8;
  turnX+=(pointerX*.5-turnX)*.09;turnY+=(pointerY*.35-turnY)*.09;
  const yaw=-.32+Math.sin(t*.16)*.12+turnX,pitch=-.16+turnY;
  function project(x,y,z){const xx=x*Math.cos(yaw)+z*Math.sin(yaw),zz=-x*Math.sin(yaw)+z*Math.cos(yaw),yy=y*Math.cos(pitch)-zz*Math.sin(pitch),depth=y*Math.sin(pitch)+zz*Math.cos(pitch),perspective=3.8/(3.8-depth);return {x:cx+xx*radius*perspective,y:cy+yy*radius*perspective,z:depth,scale:perspective}}
  const projected=nodes.map(n=>{
   const breathe=Math.sin(t*.45+n.layer*.7)*.035;
   let x=(n.layer-3)*.39,y=(n.slot%4-1.5)*.38+breathe,z=(Math.floor(n.slot/4)-1)*.55;
   y+=Math.sin(t*.25+n.slot*.8+n.layer)*.035;
   x=mix(x*2.5,x,enter);y=mix(y*1.6+.8*(1-enter),y,enter);
   const endAngle=(n.slot+n.layer*.7)/perLayer*tau;
   x=mix(x,Math.cos(endAngle)*2,exit);y=mix(y,Math.sin(endAngle)*1.2,exit);
   return {...project(x,y,z*(1-exit)),layer:n.layer,slot:n.slot};
  });
  // Translucent planes give the layered structure depth.
  for(let l=0;l<layers;l++){
   const x=(l-3)*.39;
   ctx.beginPath();[[-.68,-.67],[.68,-.67],[.68,.67],[-.68,.67]].forEach(([y,z],j)=>{const p=project(x,y,z);j?ctx.lineTo(p.x,p.y):ctx.moveTo(p.x,p.y)});ctx.closePath();ctx.globalAlpha=fade*(1-exit);ctx.fillStyle=l%2?'#d1f6e905':'#e4bb8107';ctx.fill();ctx.strokeStyle='#c9e5db26';ctx.lineWidth=.65;ctx.stroke();
  }
  const flow=(t*.43)%1;
  for(let i=0;i<edges.length;i++){
   const [a,b]=edges[i],p=projected[a],q=projected[b],depth=clamp((p.z+q.z+2)/4);
   const signal=burst?clamp(1-Math.abs(p.layer-age*2.7)/1.6):Math.max(.08,1-Math.abs(p.layer-((t*.8)%8-1))/1.3)*.55;
   ctx.globalAlpha=fade*(1-exit)*(.06+depth*.1+signal*.2);ctx.strokeStyle=signal>.4?'#f2c98c':'#addbd1';ctx.lineWidth=signal>.4?1.1:.55;
   ctx.beginPath();ctx.moveTo(p.x,p.y);ctx.bezierCurveTo(mix(p.x,q.x,.4),p.y,mix(p.x,q.x,.6),q.y,q.x,q.y);ctx.stroke();
   if(i%3===0||burst){const travel=burst?age*2.7-p.layer:(flow*layers-p.layer+i*.013+layers)%layers;if(travel>=0&&travel<=1){const f=smooth(0,1,travel),x=mix(p.x,q.x,f),y=mix(p.y,q.y,f),s=burst?12:7;ctx.globalAlpha=fade*(1-exit)*Math.sin(travel*Math.PI)*(.6+signal*.4);ctx.drawImage(sprite,x-s/2,y-s/2,s,s)}}
  }
  for(const p of [...projected].sort((a,b)=>a.z-b.z)){
   const activation=burst?Math.exp(-Math.pow(p.layer-age*2.7,2)*3):Math.pow(Math.max(0,Math.sin(t*1.5-p.layer*.8+p.slot*.3)),12)*.6;
   const size=(1.4+activation*2.6)*p.scale;ctx.globalAlpha=fade*(.3+clamp((p.z+1)/2)*.6)*(1-exit);
   ctx.fillStyle=activation>.4?'#fff0d1':'#c8e8df';ctx.beginPath();ctx.arc(p.x,p.y,size,0,tau);ctx.fill();
   ctx.globalAlpha*=.5+activation*.5;const halo=10+activation*22;ctx.drawImage(sprite,p.x-halo/2,p.y-halo/2,halo,halo);
  }
  ctx.globalAlpha=fade*(1-exit)*.6;ctx.textAlign='center';ctx.textBaseline='middle';ctx.font=(mobile?'7':'9')+'px Manrope, sans-serif';ctx.letterSpacing='1.7px';
  ['SIGNAL','CONTEXT','REASON','CREATE'].forEach((word,i)=>{const p=project((i-1.5)*.7,.99,0);ctx.fillStyle=i===3?'#efc68e':'#bddbd1';ctx.fillText(word,p.x,p.y)});
  ctx.letterSpacing='0px';ctx.globalAlpha=1;
 }
 hero.dispatchEvent(new CustomEvent('story-particles',{detail:{canvas,amount:visible?1:0}}));
}
hero._particles={draw,live};
})();
