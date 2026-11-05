precision highp float;
varying vec2 uv;
uniform sampler2D photo,mark,particles,content;
uniform float particleAmount,foregroundPass,drawGlass;
uniform vec2 size,imageSize,pointer,velocity,rotation;
uniform vec3 ball;
uniform vec4 dent;
uniform vec4 drops[12];
uniform float time,force,activity,material,grabbed,reveal;
uniform float morph,waterAmount;
uniform vec2 glassHalf;

vec2 frame(vec2 point){vec2 ratio=vec2(size.x/size.y)/(imageSize.x/imageSize.y);return (point-.5)*vec2(min(1.,ratio.x),min(1.,1./ratio.x))+.5;}
vec3 backdrop(vec2 point,float blur){
  vec3 color=texture2D(photo,clamp(frame(point),vec2(.001),vec2(.999)),blur).rgb;
  if(particleAmount>.001&&point.x>0.&&point.x<1.&&point.y>0.&&point.y<1.){
    vec4 field=texture2D(particles,point);color=mix(color,field.rgb,field.a*particleAmount);
  }
  if(foregroundPass>.5&&point.x>0.&&point.x<1.&&point.y>0.&&point.y<1.){
    vec4 ink=texture2D(content,point);color=mix(color,ink.rgb,ink.a);
  }
  return color;
}
float merge(float a,float b,float radius){float blend=clamp(.5+(b-a)/(2.*radius),0.,1.);return mix(b,a,blend)-radius*blend*(1.-blend);}
vec2 stretch(){vec2 fast=min(abs(velocity)/4000.,vec2(.22));return vec2(1.+fast.x-fast.y*.5,1.+fast.y-fast.x*.5);}
float field(vec3 point){
  float distance=(length(point/vec3(stretch(),1.))-1.)*min(stretch().x,stretch().y);
  float organic=sin(point.x*1.9+time*.9)*sin(point.y*2.3-time*.7)*sin(point.z*1.7+time*.5);
  organic+=.5*sin(point.x*3.7-time*1.1+point.z*2.1)*sin(point.y*3.1+time*.8);
  distance+=(.3+force)*.05*organic;
  distance+=force*.018*sin(length(point.xy)*10.-time*10.);
  vec3 contact=point-dent.xyz;
  distance+=dent.w*.22*exp(-6.*dot(contact,contact));
  vec2 mouse=(pointer-ball.xy)/ball.z;mouse.y=-mouse.y;
  float reach=length(mouse);
  float pull=clamp((2.5-reach)/1.5,0.,1.);pull=pull*pull*(3.-2.*pull);
  float radius=.45*pull*activity*(1.-grabbed);
  if(reach>.5&&radius>.001){vec3 satellite=vec3(mouse/max(reach,.001)*min(reach,1.25)*.8,.15);distance=merge(distance,length(point-satellite)-radius,.5);}
  vec3 boxDistance=abs(point)-vec3(glassHalf,.17)+.17;
  float box=length(max(boxDistance,0.))+min(max(boxDistance.x,max(boxDistance.y,boxDistance.z)),0.)-.17;
  // The same refracting material continues through a tapered speech-bubble tail.
  vec3 root=vec3(-glassHalf.x*.64,-glassHalf.y+.07,0.);
  vec3 tip=vec3(-glassHalf.x*.83,-glassHalf.y-.36,0.);
  vec3 axis=tip-root;
  float along=clamp(dot(point-root,axis)/dot(axis,axis),0.,1.);
  vec3 tailPoint=point-root-axis*along;tailPoint.z*=1.35;
  float tail=length(tailPoint)-mix(.23,.015,along);
  box=merge(box,tail,.12);
  return mix(distance,box,morph);
}
vec3 normalAt(vec3 point){vec2 e=vec2(.0015,-.0015);return normalize(e.xyy*field(point+e.xyy)+e.yyx*field(point+e.yyx)+e.yxy*field(point+e.yxy)+e.xxx*field(point+e.xxx));}
vec3 studio(vec3 ray){
  float sy=sin(rotation.x),cy=cos(rotation.x),sx=sin(rotation.y),cx=cos(rotation.y);
  ray=vec3(cy*ray.x+sy*ray.z,ray.y,-sy*ray.x+cy*ray.z);
  ray=vec3(ray.x,cx*ray.y-sx*ray.z,sx*ray.y+cx*ray.z);
  float elevation=asin(clamp(ray.y,-1.,1.)),azimuth=atan(ray.x,ray.z);
  vec3 room=mix(vec3(.045,.04,.038),vec3(1.05,1.02,.98),smoothstep(-.25,.55,ray.y))*.62;
  vec3 scene=backdrop((ball.xy+vec2(ray.x,-ray.y)*ball.z*2.2)/size,4.8);
  room=mix(room,scene*1.15,.22);
  room*=1.-.92*exp(-elevation*elevation*121.);
  float panelOne=(1.-smoothstep(.06,.10,abs(azimuth+.8)))*smoothstep(-.1,.15,elevation)*(1.-smoothstep(.9,1.25,elevation));
  float panelTwo=(1.-smoothstep(.035,.06,abs(azimuth-1.2)))*smoothstep(-.25,0.,elevation)*(1.-smoothstep(.7,1.1,elevation));
  room+=vec3(3.4)*panelOne+vec3(1.,.8,.56)*2.2*panelTwo;
  room+=vec3(1.6)*smoothstep(.88,.96,ray.y);
  room+=vec3(1.,.62,.3)*.45*(1.-smoothstep(-.6,.1,ray.y))*(1.-smoothstep(.15,.6,abs(azimuth)));
  return room;
}
vec2 water(vec2 pixel){
  vec2 offset=vec2(0.);float horizon=size.y*.54;
  if(pixel.y<horizon)return offset;
  float depth=clamp((pixel.y-horizon)/(size.y-horizon),0.,1.),perspective=mix(.05,1.,depth);
  offset.x=(sin(pixel.y/(perspective*10.)+time*1.3)*.55+sin(pixel.x/80.+pixel.y/(perspective*26.)-time*.8)*.45)*perspective*2.4;
  offset.y=sin(pixel.x/95.+pixel.y/(perspective*15.)+time*1.05)*perspective*1.7;
  for(int i=0;i<12;i++){
    float age=time-drops[i].z;if(drops[i].w<=0.||age<0.||age>12.)continue;
    vec2 delta=pixel-drops[i].xy*size;delta.y*=2.7;
    float radius=length(delta),phase=radius-age*240.;
    float envelope=exp(-pow(phase/60.,2.)-age*.85)*drops[i].w;
    offset+=delta/max(radius,1.)*sin(phase/10.)*envelope*9.*mix(.35,1.,depth);
  }
  return offset*waterAmount;
}
void main(){
  float glassAlpha=0.;
  vec2 pixel=vec2(uv.x,1.-uv.y)*size;
  vec2 displacement=water(pixel);
  vec3 color=backdrop((pixel+displacement)/size,0.);
  vec2 local=(pixel-ball.xy)/ball.z;
  float radial=length(local/stretch());
  // Ambient shadow and a reflected footprint in the water.
  color*=1.-.055*exp(-max(radial-1.,0.)/.3)*step(1.,radial);
  vec2 caustic=local-vec2(.1,.8);color+=vec3(1.,.62,.28)*.08*exp(-caustic.x*caustic.x/.22-caustic.y*caustic.y/.03)*step(1.,radial);
  float base=ball.y+ball.z*1.04;
  if(pixel.y>base&&waterAmount>0.){vec2 reflection=vec2(pixel.x+displacement.x*3.,2.*base-pixel.y+displacement.y*2.);float inside=1.-length((reflection-ball.xy)/ball.z);if(inside>0.)color=mix(color,backdrop((ball.xy+(reflection-ball.xy)*.8)/size,1.5)*1.06,.16*waterAmount*exp(-(pixel.y-base)/(ball.z*1.2))*smoothstep(0.,.03,inside));}
  float reach=max(1.9,length(glassHalf)+.9);
  if(drawGlass>.5&&dot(local,local)<reach*reach){
    vec3 ray=normalize(vec3(local.x*.07,-local.y*.07,-1.));
    vec3 origin=vec3(local.x,-local.y,0.)-ray*4.;
    vec3 hitPoint=origin,closestPoint=origin;float travel=0.,closest=100.;bool hit=false;
    for(int i=0;i<80;i++){hitPoint=origin+ray*travel;float gap=field(hitPoint);if(gap<closest){closest=gap;closestPoint=hitPoint;}if(gap<.0007){hit=true;break;}travel+=gap*.9;if(travel>8.5)break;}
    float coverage=hit?1.:1.-smoothstep(0.,1.4/ball.z,closest);
    if(coverage>0.){
      if(!hit)hitPoint=closestPoint;
      vec3 normal=normalAt(hitPoint),reflection=reflect(ray,normal);
      float fresnel=.04+.96*pow(1.-max(dot(-ray,normal),0.),5.);
      vec3 reflected=studio(reflection);
      vec3 internal=refract(ray,normal,1./1.36),exitPoint=hitPoint+internal*.012;
      for(int i=0;i<56;i++){float gap=field(exitPoint);if(gap>0.)break;exitPoint+=internal*max(-gap*.9,.006);}
      vec3 exitNormal=normalAt(exitPoint),transmitted=vec3(0.);
      for(int channel=0;channel<3;channel++){
        float ior=1.36+(float(channel)-1.)*.024;
        vec3 exitRay=refract(internal,-exitNormal,ior),sampleColor;
        if(dot(exitRay,exitRay)<.01)sampleColor=studio(reflect(internal,-exitNormal))*.6;
        else{float behind=(exitPoint.z+.35)/max(-exitRay.z,.3);vec2 through=exitPoint.xy+exitRay.xy*behind;sampleColor=backdrop((ball.xy+vec2(through.x,-through.y)*ball.z)/size,.4);sampleColor=mix(sampleColor,studio(exitRay)*.9,smoothstep(.12,.55,length(exitRay.xy))*.75);}
        if(channel==0)transmitted.r=sampleColor.r;else if(channel==1)transmitted.g=sampleColor.g;else transmitted.b=sampleColor.b;
      }
      float thickness=length(exitPoint-hitPoint);
      transmitted*=exp(-thickness*vec3(.0375,.09,.18));transmitted+=vec3(1.,.62,.3)*.035*thickness;
      vec2 light=(pointer-ball.xy);float lightLength=length(light);light=lightLength>1.&&activity>.05?light/lightLength:normalize(vec2(-.4,-.6));
      vec3 key=normalize(vec3(light.x,-light.y,.9));
      float tight=pow(max(dot(reflection,key),0.),160.),wide=pow(max(dot(reflection,key),0.),9.);
      vec3 glass=mix(transmitted,reflected,fresnel)+vec3(1.2)*tight+vec3(1.,.9,.8)*.22*wide;
      glass=mix(glass,backdrop(pixel/size,4.2)*vec3(.46,.4,.36)+reflected*.12,morph*.62);
      // Alternative materials remain available with ?materials, outside reference mode.
      float chrome=1.-min(1.,abs(material-1.)),prism=clamp(material-1.,0.,1.);
      glass=mix(glass,reflected+vec3(tight),chrome);
      vec3 film=.5+.5*cos(vec3(0.,2.1,4.2)+normal.z*11.+normal.x*4.+time*.12);
      glass=mix(glass,glass*.7+film*(.12+.3*pow(1.-normal.z,2.)),prism);
      vec2 glyph=.5+vec2(hitPoint.x,-hitPoint.y)*.5;glyph+=vec2(normal.x,-normal.y)*(1.-normal.z)*.025;
      vec4 letter=texture2D(mark,clamp(glyph,vec2(0.),vec2(1.)));
      glass=mix(glass,letter.rgb,letter.a*.26*(1.-morph));
      color=mix(color,glass,coverage*reveal);
      glassAlpha=coverage*reveal;
      // The foreground pass covers native DOM only inside the exact glass edge.
      if(foregroundPass>.5)color=glass;
    }
  }
  gl_FragColor=vec4(color,mix(1.,glassAlpha,foregroundPass));
}
