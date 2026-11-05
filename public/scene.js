// One shared scene: the glass refracts the very same image as its surroundings.
(async()=>{
const hero=document.querySelector('.hero'),orb=document.querySelector('.orb');hero.classList.toggle('show-materials',new URLSearchParams(location.search).has('materials'));
const canvas=document.createElement('canvas');canvas.className='shared-scene';canvas.setAttribute('aria-hidden','true');hero.prepend(canvas);
const gl=canvas.getContext('webgl',{alpha:false,antialias:false,powerPreference:'high-performance'});if(!gl)return;
const vs=`attribute vec2 p;varying vec2 uv;void main(){uv=p*.5+.5;gl_Position=vec4(p,0.,1.);}`;
const fs=await (await fetch('droplet.frag?v=particles-2')).text();
function compile(type,src){const s=gl.createShader(type);gl.shaderSource(s,src);gl.compileShader(s);if(!gl.getShaderParameter(s,gl.COMPILE_STATUS))throw Error(gl.getShaderInfoLog(s));return s}
let program;try{program=gl.createProgram();gl.attachShader(program,compile(gl.VERTEX_SHADER,vs));gl.attachShader(program,compile(gl.FRAGMENT_SHADER,fs));gl.linkProgram(program);if(!gl.getProgramParameter(program,gl.LINK_STATUS))throw Error('Scene link failed')}catch(e){console.warn(e);canvas.remove();return}
gl.useProgram(program);const buffer=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,buffer);gl.bufferData(gl.ARRAY_BUFFER,new Float32Array([-1,-1,1,-1,-1,1,-1,1,1,-1,1,1]),gl.STATIC_DRAW);const pos=gl.getAttribLocation(program,'p');gl.enableVertexAttribArray(pos);gl.vertexAttribPointer(pos,2,gl.FLOAT,false,0,0);
const u={};['size','imageSize','ball','pointer','velocity','time','force','activity','material','rotation','dent','grabbed','reveal','morph','glassHalf','waterAmount','drops[0]'].forEach(n=>u[n]=gl.getUniformLocation(program,n));
function texture(unit){const t=gl.createTexture();gl.activeTexture(gl.TEXTURE0+unit);gl.bindTexture(gl.TEXTURE_2D,t);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MIN_FILTER,gl.LINEAR);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MAG_FILTER,gl.LINEAR);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_S,gl.CLAMP_TO_EDGE);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_T,gl.CLAMP_TO_EDGE);return t}
const bg=texture(0);gl.uniform1i(gl.getUniformLocation(program,'photo'),0);const glyph=texture(1);gl.uniform1i(gl.getUniformLocation(program,'mark'),1);

const particleTexture=texture(2);gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA,1,1,0,gl.RGBA,gl.UNSIGNED_BYTE,new Uint8Array(4));gl.uniform1i(gl.getUniformLocation(program,'particles'),2);const particleAmount=gl.getUniformLocation(program,'particleAmount');gl.uniform1f(particleAmount,0);
hero.addEventListener('story-particles',e=>{gl.activeTexture(gl.TEXTURE2);gl.bindTexture(gl.TEXTURE_2D,particleTexture);gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA,gl.RGBA,gl.UNSIGNED_BYTE,e.detail.canvas);gl.uniform1f(particleAmount,e.detail.amount);resume()});

const letter=document.createElement('canvas');letter.width=letter.height=512;const ctx=letter.getContext('2d');function mark(){ctx.clearRect(0,0,512,512);ctx.fillStyle='#fff3d4';ctx.textAlign='center';ctx.textBaseline='middle';ctx.font='500 150px Manrope, sans-serif';ctx.fillText('g',256,245);gl.activeTexture(gl.TEXTURE1);gl.bindTexture(gl.TEXTURE_2D,glyph);gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA,gl.RGBA,gl.UNSIGNED_BYTE,letter)}mark();document.fonts.ready.then(mark);
const img=new Image();let ready=false,selected='';function loadImage(){const src=innerWidth<760?'assets/reference-scene-tall.webp':'assets/reference-scene-wide.webp';if(src!==selected){selected=src;img.src=src}}img.onload=()=>{gl.activeTexture(gl.TEXTURE0);gl.bindTexture(gl.TEXTURE_2D,bg);const prepared=document.createElement('canvas');prepared.width=prepared.height=2048;prepared.getContext('2d').drawImage(img,0,0,2048,2048);gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA,gl.RGBA,gl.UNSIGNED_BYTE,prepared);gl.generateMipmap(gl.TEXTURE_2D);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MIN_FILTER,gl.LINEAR_MIPMAP_LINEAR);gl.uniform2f(u.imageSize,img.width,img.height);ready=true;hero.classList.add('shared-scene-ready');orb.classList.add('shared-glass');hero.dispatchEvent(new Event('scene-ready'));resume()};loadImage();

hero.addEventListener('story-background',e=>{if(!ready)return;gl.activeTexture(gl.TEXTURE0);gl.bindTexture(gl.TEXTURE_2D,bg);gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA,gl.RGBA,gl.UNSIGNED_BYTE,e.detail.canvas);gl.generateMipmap(gl.TEXTURE_2D);gl.uniform2f(u.imageSize,e.detail.width,e.detail.height);resume()});
let width=1,height=1;function resize(){width=hero.clientWidth;height=hero.clientHeight;const scale=Math.min(devicePixelRatio,1.25);canvas.width=Math.round(width*scale);canvas.height=Math.round(height*scale);gl.viewport(0,0,canvas.width,canvas.height);gl.uniform2f(u.size,width,height);loadImage();resume()}new ResizeObserver(resize).observe(hero);
let material=0,materialTarget=0;
const materialButtons=[...document.querySelectorAll('[data-material]')];materialButtons.forEach(button=>button.addEventListener('click',()=>{materialTarget=Number(button.dataset.material);materialButtons.forEach(b=>b.setAttribute('aria-pressed',String(b===button)));document.querySelector('.material-description').textContent=button.dataset.description;hero.dataset.material=button.dataset.label;resume()}));
let tx=-1000,ty=-1000,activeTarget=0,turnX=0,turnY=0,idleTurn=0,dentAmount=0,dentVelocity=0,dentX=0,dentY=0,dentZ=1,mx=-1000,my=-1000,active=0,vx=0,vy=0,force=0,slot=0,lastDrop=0,lastDropX=0,lastDropY=0,frame=0,last=0,visible=true;const start=performance.now(),drops=new Float32Array(48);for(let i=0;i<12;i++)drops[i*4+2]=-100;const reduced=matchMedia('(prefers-reduced-motion: reduce)');
function drop(clientX,clientY,strength){if(reduced.matches)return;const r=hero.getBoundingClientRect(),y=(clientY-r.top)/height;if(y<.54||y>1)return;const i=slot++%12*4;drops[i]=(clientX-r.left)/width;drops[i+1]=y;drops[i+2]=(performance.now()-start)/1000;drops[i+3]=strength}
hero.addEventListener('pointermove',e=>{const r=hero.getBoundingClientRect();tx=e.clientX-r.left;ty=e.clientY-r.top;if(activeTarget===0){mx=tx;my=ty}activeTarget=1;if(performance.now()-lastDrop>140&&Math.hypot(tx-lastDropX,ty-lastDropY)>28){drop(e.clientX,e.clientY,.55);lastDrop=performance.now();lastDropX=tx;lastDropY=ty}resume()},{passive:true});hero.addEventListener('pointerleave',()=>{activeTarget=0;resume()});hero.addEventListener('pointerdown',e=>drop(e.clientX,e.clientY,1.2),{passive:true});hero.addEventListener('orb-ripple',e=>drop(e.detail.x,e.detail.y,e.detail.strength));hero.addEventListener('orb-motion',e=>{vx=e.detail.vx;vy=e.detail.vy;force=e.detail.energy;resume()});
let agitation=0,entranceDone=null;
function render(now){
frame=0;if(!visible||document.hidden||!ready)return;
if(now-last<24&&!reduced.matches){frame=requestAnimationFrame(render);return}
const dt=Math.min(.05,(now-last)/1000)||.016;last=now;
const rect=orb.getBoundingClientRect(),heroRect=hero.getBoundingClientRect();
const radius=hero._story?.radius??rect.width/2,cx=rect.left-heroRect.left+rect.width/2,cy=rect.top-heroRect.top+rect.height/2;
mx+=(tx-mx)*.16;my+=(ty-my)*.16;active+=(activeTarget-active)*Math.min(1,dt*4);
const nx=(mx-cx)/radius,ny=-(my-cy)/radius,inside=activeTarget&&Math.hypot(nx,ny)<1.02;
const dragging=orb.classList.contains('dragging');
if(inside){dentX=nx;dentY=ny;dentZ=Math.sqrt(Math.max(0,1-nx*nx-ny*ny))}
const press=reduced.matches?0:inside?(dragging?1:.32):0;
dentVelocity+=((press-dentAmount)*140-dentVelocity*11)*dt;dentAmount+=dentVelocity*dt;
agitation=Math.min(2.4,agitation*Math.pow(.25,dt)+(activeTarget?Math.hypot(tx-mx,ty-my)/900:0));
idleTurn+=dt*.12*(1-active);
const yaw=idleTurn+Math.max(-.6,Math.min(.6,(mx-cx)/width))*2.6*active;
const pitch=Math.max(-.6,Math.min(.6,(my-cy)/height))*1.6*active+Math.sin(now/3200)*.14*(1-active);
turnX+=(yaw-turnX)*Math.min(1,dt*(2+3*active));turnY+=(pitch-turnY)*Math.min(1,dt*5);
gl.uniform1f(u.morph,hero._story?.morph??0);gl.uniform2f(u.glassHalf,hero._story?.half[0]??1,hero._story?.half[1]??1);gl.uniform1f(u.waterAmount,hero._story?.water??1);gl.uniform3f(u.ball,cx,cy,radius);gl.uniform2f(u.pointer,mx,my);
gl.uniform2f(u.velocity,reduced.matches?0:vx,reduced.matches?0:vy);
gl.uniform2f(u.rotation,reduced.matches?0:turnX,reduced.matches?0:turnY);
gl.uniform4f(u.dent,dentX,dentY,dentZ,reduced.matches?0:Math.max(0,dentAmount));
if(entranceDone===null&&document.body.classList.contains('intro-ready'))entranceDone=now;const appearance=reduced.matches?1:entranceDone===null?0:Math.max(0,Math.min(1,(now-entranceDone-720)/900));gl.uniform1f(u.reveal,appearance*appearance*(3-2*appearance));gl.uniform1f(u.grabbed,dragging?1:0);gl.uniform1f(u.time,reduced.matches?0:(now-start)/1000);
gl.uniform1f(u.force,reduced.matches?0:Math.min(2.4,agitation+force));gl.uniform1f(u.activity,reduced.matches?0:active);
material=reduced.matches?materialTarget:material+(materialTarget-material)*.12;
gl.uniform1f(u.material,material);gl.uniform4fv(u['drops[0]'],drops);gl.drawArrays(gl.TRIANGLES,0,6);
if(!reduced.matches)frame=requestAnimationFrame(render);
}
function resume(){if(!frame&&ready&&visible&&!document.hidden)frame=requestAnimationFrame(render)}
new IntersectionObserver(e=>{visible=e[0].isIntersecting;if(visible)resume();else{cancelAnimationFrame(frame);frame=0}}).observe(hero);document.addEventListener('visibilitychange',()=>{if(document.hidden){cancelAnimationFrame(frame);frame=0}else resume()});reduced.addEventListener('change',resume);canvas.addEventListener('webglcontextlost',()=>{ready=false;cancelAnimationFrame(frame);hero.classList.remove('shared-scene-ready');orb.classList.remove('shared-glass')});resize();
})();
