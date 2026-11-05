const assert=require('node:assert/strict');
const vm=require('node:vm'),fs=require('node:fs'),path=require('node:path');
const context={module:{exports:{}}};
vm.runInNewContext(fs.readFileSync(path.join(__dirname,'../public/motion.js'),'utf8'),context);
const M=context.module.exports;
// Chapter navigation must invert the stretched scroll timeline in both directions.
let previous=-1;
for(let scene=0;scene<=M.end;scene+=.01){
 const scroll=M.toScroll(scene);
 assert(scroll>previous,'The scroll mapping must never reverse');previous=scroll;
 assert(Math.abs(M.toScene(scroll)-scene)<1e-8,'Chapter jumps must land on the intended scene');
}
for(const [w,h] of [[390,844],[768,1024],[1440,900]]){
 for(let scene=3.4;scene<6;scene+=.02)for(let i=0;i<12;i++){
  const p=M.paper(i,12,scene,w,h,10);
  assert(Object.values(p).every(Number.isFinite));
  assert(p.alpha>=0&&p.alpha<=1);assert(p.scale>0);
 }
 for(let i=0;i<12;i++){
  assert.equal(M.paper(i,12,3.4,w,h).alpha,0);
  assert.equal(M.paper(i,12,6,w,h).alpha,0);
 }
}
for(const n of [1,15,120])for(let i=0;i<n;i++){
 assert.equal(M.focus(i,n,0,0).alpha,0);
 assert.equal(M.focus(i,n,1,0).alpha,1);
 assert.equal(M.focus(i,n,1,1).alpha,0);
}
console.log('Timeline inversion, paper bounds, and reversible character reveals passed.');
