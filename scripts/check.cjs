const fs=require('node:fs');
const path=require('node:path');
const {spawnSync}=require('node:child_process');
const root=path.resolve(__dirname,'..','public');
let failed=false;
for(const name of fs.readdirSync(root)){
  if(name.endsWith('.js')){
    const result=spawnSync(process.execPath,['--check',path.join(root,name)],{encoding:'utf8',windowsHide:true});
    if(result.status!==0){failed=true;process.stderr.write(result.stderr)}
  }
}
const html=fs.readFileSync(path.join(root,'index.html'),'utf8');
const references=[...html.matchAll(/(?:src|href)="([^"]+)"/g)].map(m=>m[1]);
for(const ref of [...references,'droplet.frag','assets/reference-scene-wide.webp','assets/reference-scene-tall.webp']){
  if(/^(?:https?:|#|data:|mailto:)/.test(ref))continue;
  const file=ref.split(/[?#]/)[0];
  if(!fs.existsSync(path.join(root,file))){console.error(`Missing asset: ${file}`);failed=true}
}
if(failed)process.exit(1);
console.log('JavaScript syntax and deployment asset references passed.');
