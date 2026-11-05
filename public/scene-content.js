// Rasterize the story's existing DOM into a refraction-only texture. The live DOM
// still supplies layout, sharp text outside the glass, focus and accessibility.
(()=>{
const hero=document.querySelector('.hero'),canvas=document.createElement('canvas'),ctx=canvas.getContext('2d');
const excluded='.story-glass-note,.quiet-note';
let frame=0,last=0,dirty=true,width=0,height=0;
function capture(now){
 frame=0;if(document.hidden||!dirty)return;
 if(now-last<50){frame=requestAnimationFrame(capture);return}last=now;dirty=false;
 const bounds=hero.getBoundingClientRect();width=bounds.width;height=bounds.height;
 const density=Math.min(devicePixelRatio||1,2),power=n=>Math.min(4096,2**Math.ceil(Math.log2(Math.max(1,n*density))));
 const w=power(width),h=power(height);if(canvas.width!==w||canvas.height!==h){canvas.width=w;canvas.height=h}
 ctx.setTransform(w/width,0,0,h/height,0,0);ctx.clearRect(0,0,width,height);
 const cache=new Map();
 function info(el){
  if(cache.has(el))return cache.get(el);
  const style=getComputedStyle(el),parent=el===hero?null:info(el.parentElement);
  const own=style.transform==='none'?new DOMMatrix():new DOMMatrix(style.transform);
  const matrix=parent?parent.matrix.multiply(own):own;
  const alpha=(parent?.alpha??1)*Number(style.opacity);
  const visible=alpha>.002&&style.display!=='none'&&style.visibility!=='hidden'&&(parent?.visible??true);
  const value={style,matrix,alpha,visible};cache.set(el,value);return value;
 }
 function localBox(el,fn){
  const data=info(el),r=el.getBoundingClientRect(),m=data.matrix;
  if(!data.visible||!r.width||!r.height||r.right<bounds.left||r.left>bounds.right||r.bottom<bounds.top||r.top>bounds.bottom)return;
  // Story transforms are 2D scales/translations/rotations. Layout remains native.
  ctx.save();ctx.globalAlpha=data.alpha;ctx.translate(r.left+r.width/2-bounds.left,r.top+r.height/2-bounds.top);ctx.transform(m.a,m.b,m.c,m.d,0,0);
  fn(data.style,el.offsetWidth,el.offsetHeight);ctx.restore();
 }
 function box(el){localBox(el,(s,w,h)=>{
  const x=-w/2,y=-h/2,r=Math.min(parseFloat(s.borderTopLeftRadius)||0,w/2,h/2);
  ctx.beginPath();ctx.roundRect(x,y,w,h,r);
  if(s.backgroundColor!=='rgba(0, 0, 0, 0)'&&s.backgroundColor!=='transparent'){ctx.fillStyle=s.backgroundColor;ctx.fill()}
  // The note cards use a two-stop diagonal wash; preserve its computed colors.
  const colors=s.backgroundImage.match(/rgba?\([^)]+\)/g);
  if(s.backgroundImage.startsWith('linear-gradient(')&&colors?.length===2){const gradient=ctx.createLinearGradient(x,y,x+w,y+h);gradient.addColorStop(0,colors[0]);gradient.addColorStop(1,colors[1]);ctx.fillStyle=gradient;ctx.fill()}
  const sides=[['Top',x,y,x+w,y],['Right',x+w,y,x+w,y+h],['Bottom',x,y+h,x+w,y+h],['Left',x,y,x,y+h]];
  const bw=parseFloat(s.borderTopWidth)||0;
  if(bw&&s.borderTopStyle!=='none'&&s.borderTopWidth===s.borderRightWidth&&s.borderTopWidth===s.borderBottomWidth&&s.borderTopWidth===s.borderLeftWidth){ctx.lineWidth=bw;ctx.strokeStyle=s.borderTopColor;ctx.setLineDash(s.borderTopStyle==='dashed'?[4,4]:[]);ctx.stroke()}
  else for(const [side,x1,y1,x2,y2] of sides){const size=parseFloat(s['border'+side+'Width']);if(size&&s['border'+side+'Style']!=='none'){ctx.lineWidth=size;ctx.strokeStyle=s['border'+side+'Color'];ctx.beginPath();ctx.moveTo(x1,y1);ctx.lineTo(x2,y2);ctx.stroke()}}
 })}
 function text(node){
  const el=node.parentElement,data=info(el);if(!data.visible||!node.textContent.trim())return;
  const s=data.style,m=data.matrix,fontSize=parseFloat(s.fontSize);
  ctx.save();ctx.font=`${s.fontStyle} ${s.fontWeight} ${s.fontSize} ${s.fontFamily}`;ctx.fillStyle=s.color;ctx.textBaseline='alphabetic';ctx.textAlign='left';ctx.globalAlpha=data.alpha;
  // Range coordinates preserve responsive wrapping, kerning and inline spans.
  const range=document.createRange();let offset=0;
  for(const char of node.textContent){const length=char.length;range.setStart(node,offset);range.setEnd(node,offset+length);offset+=length;if(!char.trim())continue;
   const r=range.getBoundingClientRect();if(!r.width||!r.height||r.right<bounds.left||r.left>bounds.right||r.bottom<bounds.top||r.top>bounds.bottom)continue;
   const glyph=s.textTransform==='uppercase'?char.toUpperCase():s.textTransform==='lowercase'?char.toLowerCase():char,metrics=ctx.measureText(glyph),spacing=parseFloat(s.letterSpacing)||0;
   const ascent=metrics.fontBoundingBoxAscent??fontSize*.8,descent=metrics.fontBoundingBoxDescent??fontSize*.2;
   ctx.save();ctx.translate(r.left+r.width/2-bounds.left,r.top+r.height/2-bounds.top);ctx.transform(m.a,m.b,m.c,m.d,0,0);
   ctx.filter=s.filter==='none'?'none':s.filter;ctx.fillText(glyph,-(metrics.width+spacing)/2,(ascent-descent)/2);ctx.restore();
  }ctx.restore();
 }
 function visit(el){if(el.matches(excluded)||!info(el).visible)return;box(el);for(const node of el.childNodes){if(node.nodeType===Node.TEXT_NODE)text(node);else if(node.nodeType===Node.ELEMENT_NODE)visit(node)}}
 for(const root of hero.querySelectorAll('.hero-top,.hero-bottom,.orb-caption,.story-layer'))visit(root);
 hero.dispatchEvent(new CustomEvent('scene-content',{detail:{canvas}}));
}
function invalidate(){dirty=true;if(!frame)frame=requestAnimationFrame(capture)}
const observer=new MutationObserver(records=>{if(records.some(r=>r.type!=='attributes'||r.oldValue!==r.target.getAttribute(r.attributeName)))invalidate()});
observer.observe(document.body,{attributes:true,attributeFilter:['class']});
function observe(){for(const root of hero.querySelectorAll('.hero-top,.hero-bottom,.orb-caption,.story-layer'))observer.observe(root,{attributes:true,attributeOldValue:true,childList:true,characterData:true,subtree:true});invalidate()}
hero.addEventListener('scene-ready',observe);hero.addEventListener('story-content-ready',observe);
hero.addEventListener('pointerover',invalidate,{passive:true});hero.addEventListener('pointerout',invalidate,{passive:true});hero.addEventListener('focusin',invalidate);hero.addEventListener('focusout',invalidate);
window.addEventListener('resize',invalidate,{passive:true});document.fonts.ready.then(invalidate);document.addEventListener('visibilitychange',invalidate);
document.addEventListener('animationend',invalidate);hero._invalidateContent=invalidate;
})();
