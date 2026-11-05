// Renderer contract checks; the browser QA also compiles the real shader and
// verifies portrait, text and card refraction at desktop and phone sizes.
const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm'),path=require('node:path');
const events=new Map(),frames=new Map(),uniforms={},draws=[],uploads=[],canvases=[],images=[];
let frameId=0,unit=0,resize;
const classes=()=>({add(){},remove(){},toggle(){},contains(){return false}});
const hero={clientWidth:1000,clientHeight:700,classList:classes(),_story:null,
 prepend(){},append(){},getBoundingClientRect(){return {left:0,top:0,width:this.clientWidth,height:this.clientHeight}},
 addEventListener(type,fn){if(!events.has(type))events.set(type,[]);events.get(type).push(fn)},
 dispatchEvent(e){for(const fn of events.get(e.type)||[])fn(e)}};
let orbX=400;
const orb={classList:classes(),getBoundingClientRect:()=>({left:orbX,top:250,width:200,height:200})};
const gl=new Proxy({
 TEXTURE0:100,TEXTURE1:101,TEXTURE2:102,TEXTURE3:103,
 getShaderParameter:()=>true,getProgramParameter:()=>true,getUniformLocation:(_,name)=>name,
 activeTexture:n=>unit=n,
 texImage2D(...args){uploads.push({unit,source:args.at(-1)})},
 uniform1f(name,value){uniforms[name]=value},uniform2f(name,...value){uniforms[name]=value},
 drawArrays(){draws.push({...uniforms})},
}, {get(target,key){return key in target?target[key]:()=>({})}});
function canvas(){const listeners={},context={copies:[],clears:0,drawImage(...args){this.copies.push(args)},clearRect(){this.clears++},fillText(){}};
 const el={width:0,height:0,context,listeners,setAttribute(){},remove(){this.removed=true},getContext:type=>type==='webgl'?gl:context,addEventListener(type,fn){listeners[type]=fn}};canvases.push(el);return el}
const environment={
 console,Float32Array,Uint8Array,URLSearchParams,location:{search:''},innerWidth:1000,devicePixelRatio:2,
 performance:{now:()=>100},fetch:async()=>({text:async()=>''}),
 document:{hidden:false,body:{classList:{contains:()=>true}},fonts:{ready:Promise.resolve()},createElement:canvas,
  querySelector:s=>s==='.hero'?hero:orb,querySelectorAll:()=>[],addEventListener(){}},
 Image:class{constructor(){images.push(this);this.width=1800;this.height=1000}},
 ResizeObserver:class{constructor(fn){resize=fn}observe(){}},IntersectionObserver:class{observe(){}},
 matchMedia:()=>({matches:false,addEventListener(){}}),Event:class{constructor(type){this.type=type}},
 requestAnimationFrame(fn){frames.set(++frameId,fn);return frameId},cancelAnimationFrame(id){frames.delete(id)},
};
(async()=>{
 const context=vm.createContext(environment);await vm.runInContext(fs.readFileSync(path.join(__dirname,'../public/scene.js'),'utf8'),context);
 const [scene,foreground]=canvases;
 images[0].onload();
 assert.equal(scene.width,2000);assert.equal(foreground.width,scene.width);
 // A photo finishing after a breakpoint change must not replace a later chapter.
 const story={name:'current chapter'};hero._storyCanvas=story;
 hero.dispatchEvent({type:'story-background',detail:{canvas:story,width:1000,height:700}});
 context.innerWidth=390;hero.clientWidth=390;hero.clientHeight=844;resize();images[0].onload();
 assert.equal(uploads.filter(v=>v.unit===gl.TEXTURE0).at(-1).source,story);
 assert.deepEqual(uniforms.imageSize,[390,844]);
 hero.dispatchEvent({type:'scene-content',detail:{canvas:{name:'DOM content'}}});
 orbX=100;
 function tick(time){const [id,fn]=frames.entries().next().value;frames.delete(id);fn(time)}
 tick(1000);
 assert.deepEqual(draws.map(d=>[d.foregroundPass,d.drawGlass]),[[1,1],[0,0]],'Only the foreground pass should ray-march glass');
 assert.equal(foreground.context.copies.length,1,'Exact-alpha glass is copied above the live DOM');
 const copy=foreground.context.copies[0];assert(copy[1]>=0&&copy[2]>=0);assert(copy[3]<=scene.width&&copy[4]<=scene.height);
 // Dragging entirely off screen must clear old glass without an invalid copy.
 orbX=5000;tick(1040);assert.equal(foreground.context.copies.length,1);assert.equal(draws.at(-1).drawGlass,0);
 const clears=foreground.context.clears;scene.listeners.webglcontextlost();assert.equal(foreground.context.clears,clears+1);
 console.log('Scene texture ownership, single glass pass, viewport clipping and context-loss cleanup passed.');
})().catch(e=>{console.error(e);process.exitCode=1});
