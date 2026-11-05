/* Shared, reversible timeline math. All visual state is derived from scroll. */
(()=>{
  const clamp=n=>Math.max(0,Math.min(1,n));
  const ease=n=>{n=clamp(n);return n*n*(3-2*n)};
  const range=(a,b,n)=>clamp((n-a)/(b-a));
  const holds=[[1.15,1.85,.65],[2.6,3.3,.65],[4.15,4.9,1.35],[6.1,7.9,1.5],[16.9,18.1,1.2],[20.3,21.3,.6]];
  function toScroll(scene){let added=0;for(const [a,b,d] of holds){if(scene<=a)break;if(scene<b)return a+added+(scene-a)*(b-a+d)/(b-a);added+=d}return scene+added}
  function toScene(scroll){let added=0;for(const [a,b,d] of holds){if(scroll<=a+added)return scroll-added;if(scroll<b+added+d)return a+(scroll-a-added)*(b-a)/(b-a+d);added+=d}return scroll-added}
  function focus(index,count,enter,exit){const feather=Math.max(4,count*.12),a=ease((enter*(count+feather)-index)/feather),b=ease((exit*(count+feather)-(count-1-index))/feather);return {alpha:a*(1-b),blur:(1-a+b)*16}}
  function paper(index,count,scene,width,height,time=0){
    const mobile=width<800,unit=Math.min(width,height),angle=index/count*Math.PI*2-.9;
    const arrival=ease(range(3.65+index*.018,4.15+index*.018,scene));
    const absorb=ease(range(4.9+index*.025,5.42+index*.025,scene));
    const orbit=angle+(scene-4.2)*.42;
    const radius=unit*(mobile?.32:.33)*(1-absorb);
    const outside=(1-arrival)*(unit*1.5+index*22);
    const swirl=orbit+absorb*2.8;
    const drift=Math.sin(time*.65+index*1.7)*3*arrival*(1-absorb);
    // Leave room between the larger labels: wide on desktop, tall on phones.
    return {x:width*.5+Math.cos(swirl)*(radius*(mobile?1:1.4)+outside),y:height*.52+Math.sin(swirl)*(radius*(mobile?1.65:.88)+outside)+drift,rotation:Math.sin(angle*2)*.24+(1-arrival)*(index%2?1:-1)*1.5+absorb*2.2,scale:(mobile?.76:1)*(1-absorb*.94),alpha:arrival*(1-ease(range(.65,1,absorb))),heat:range(.1,.7,absorb)};
  }
  function paperText(scene){return {
    enter:range(3.9,4.55,scene),
    slide:1-Math.pow(1-Math.min(range(3.9,4.55,scene)/.76,1),2),
    glow:ease(range(4.5,4.78,scene))*(1-ease(range(5.5,5.78,scene))),
    topDock:ease(range(5.1,5.45,scene)),
    dock:ease(range(5.45,5.9,scene)),
    topReveal:range(3.65,3.96,scene),
    exit:1-ease(range(6.85,7.35,scene))
  }}
  const api={clamp,ease,range,toScene,toScroll,focus,paper,paperText,end:23.2};
  if(typeof module!=='undefined')module.exports=api;else window.GrizMotion=api;
})();
