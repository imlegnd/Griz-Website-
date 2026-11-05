// A procedural magnetic cradle, rendered once and sampled by the glass itself.
(()=>{
const hero=document.querySelector('.hero'),canvas=document.createElement('canvas'),ctx=canvas.getContext('2d');
const clamp=n=>Math.max(0,Math.min(1,n)),mix=(a,b,t)=>a+(b-a)*t;
const smooth=(a,b,n)=>{const t=clamp((n-a)/(b-a));return t*t*(3-2*t)};
const fract=n=>n-Math.floor(n),tau=Math.PI*2;
const particles=Array.from({length:2000},(_,i)=>({u:fract(i*.61803398875),v:fract(i*.41421356237),w:fract(i*.754877666),group:i%6}));
const destinations=[[-310,-155],[120,-145],[135,90],[-240,140],[-375,20],[95,-230]];
const glow=document.createElement('canvas');glow.width=glow.height=32;const light=glow.getContext('2d'),halo=light.createRadialGradient(16,16,0,16,16,16);halo.addColorStop(0,'#ffefd9bb');halo.addColorStop(.18,'#e9c99b55');halo.addColorStop(1,'#e3aa6500');light.fillStyle=halo;light.fillRect(0,0,32,32);
let mouseX=-10000,mouseY=-10000,shock=null,last=-100,wasVisible=false;
function live(value){return value>1.85&&value<4.45&&!document.hidden}
hero.addEventListener('pointermove',e=>{const r=hero.getBoundingClientRect();mouseX=e.clientX-r.left;mouseY=e.clientY-r.top},{passive:true});
hero.addEventListener('pointerleave',()=>{mouseX=mouseY=-10000});
hero.addEventListener('pointerdown',e=>{const r=hero.getBoundingClientRect();shock={x:e.clientX-r.left,y:e.clientY-r.top,start:performance.now()}},{passive:true});
function draw(value,now,width,height){
 const visible=live(value);if(!visible&&!wasVisible)return;if(visible&&now-last<45)return;last=now;wasVisible=visible;
 const size=width<800?512:1024;if(canvas.width!==size){canvas.width=canvas.height=size}
 ctx.setTransform(1,0,0,1,0,0);ctx.clearRect(0,0,size,size);
 if(visible){
  ctx.setTransform(size/width,0,0,size/height,0,0);
  const mobile=width<800,time=now/1000,gather=smooth(1.9,2.65,value),disperse=smooth(3.3,4.3,value),fade=smooth(1.85,2.35,value)*(1-smooth(3.85,4.4,value));
  const radius=Math.min(width,height)*(mobile?.19:.14)*1.06,cx=width*.5,cy=height*.45,small=mobile?.6:1,count=mobile?1200:2000;
  // A low, luminous haze gives the tiny points depth without becoming a solid object.
  ctx.save();ctx.globalAlpha=fade*(1-disperse)*.2;ctx.translate(cx,cy+radius*1.25);ctx.scale(1,.22);const fog=ctx.createRadialGradient(0,0,0,0,0,radius*2.7);fog.addColorStop(0,'#dca66c55');fog.addColorStop(1,'#dca66c00');ctx.fillStyle=fog;ctx.fillRect(-radius*2.7,-radius*2.7,radius*5.4,radius*5.4);ctx.restore();
  for(let i=0;i<count;i++){
   const p=particles[i],angle=tau*(p.u+time*(.012+p.w*.006)*(p.group%2?1:-1));
   let x,y,z;
   if(i%5!==0){
    // Nested streamlines form an open bowl under the floating glass.
    const band=(p.group+.5)/6+(p.v-.5)*.045,r=radius*(1.05+band*1.55),ripple=Math.sin(angle*3.+band*9.+time*.45)*radius*.045;
    x=Math.cos(angle)*(r+ripple);z=Math.sin(angle)*r*.62;
    y=radius*(.72+band*band*.45)+z*.30+Math.sin(angle*2.+time*.3)*radius*.04;
   }else{
    // Loose field lines rise past the sides and continue behind the glass.
    const path=fract(p.v+time*.012),a=path*Math.PI,r=radius*(1.2+p.w*.8)*Math.sin(a);
    x=Math.cos(angle)*r;z=Math.sin(angle)*r*.6;y=radius*.65-Math.cos(a)*radius*1.45+z*.25;
   }
   x=mix(x*2.7+Math.sin(i*1.7)*width*.3,x,gather);
   y=mix(height*.55+y*1.7,y,gather);
   const destination=destinations[p.group],spread=smooth(0,1,disperse);
   x=mix(x,destination[0]*small+Math.cos(angle*2.)*25*small,spread);
   y=mix(y+(cy-height*.52),destination[1]*small+Math.sin(angle*2.)*16*small,spread);
   let px=cx+x,py=height*.52+y;
   const dx=px-mouseX,dy=py-mouseY,near=Math.exp(-(dx*dx+dy*dy)/(radius*radius*.8));px+=dx*near*.28;py+=dy*near*.28;
   if(shock){const age=(now-shock.start)/1000;if(age<2){const sx=px-shock.x,sy=py-shock.y,d=Math.hypot(sx,sy)||1,front=d-age*radius*2.8,push=Math.exp(-front*front/(radius*radius*.07))*Math.exp(-age*1.5)*radius*.16;px+=sx/d*push;py+=sy/d*push}}
   const depth=clamp(.5+z/(radius*3.5)),spark=.75+.25*Math.sin(time*.7+p.w*50),alpha=fade*(.28+depth*.72)*spark;
   if(alpha<.008)continue;
   ctx.globalAlpha=alpha;ctx.fillStyle=i%7===0?'#fff2d5':i%3===0?'#e2c197':'#a99275';
   const point=(mobile?1:.8)+depth*.9+(i%37===0?1:0);ctx.fillRect(px,py,point,point);
   if(i%23===0){ctx.globalAlpha=alpha*.65;const r=5+depth*5;ctx.drawImage(glow,px-r/2,py-r/2,r,r)}
  }
  ctx.globalAlpha=1;
 }
 hero.dispatchEvent(new CustomEvent('story-particles',{detail:{canvas,amount:visible?1:0}}));
}
hero._particles={draw,live};
})();
