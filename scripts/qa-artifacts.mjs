import sharp from 'sharp';
import {readdir,mkdir,writeFile,readFile,stat} from 'node:fs/promises';
import {createHash} from 'node:crypto';
await mkdir('qa/contact-sheets',{recursive:true});
const files=(await readdir('qa/screenshots')).filter(n=>n.endsWith('-desktop.png')).sort();
for(let start=0;start<files.length;start+=10){const batch=files.slice(start,start+10);const tiles=await Promise.all(batch.map(async(n,i)=>({input:await sharp('qa/screenshots/'+n).resize({width:280,height:850,fit:'inside'}).extend({top:25,bottom:0,left:0,right:0,background:'#ffffff'}).png().toBuffer(),left:i%5*300,top:Math.floor(i/5)*900})));await sharp({create:{width:1500,height:1800,channels:3,background:'#e8e0d6'}}).composite(tiles).png().toFile(`qa/contact-sheets/desktop-${start/10+1}.png`);}
const audit=[];for(const c of ['hairstyles','colour','editorial'])for(const n of await readdir('assets/originals/'+c)){const p='assets/originals/'+c+'/'+n;const buffer=await readFile(p);audit.push({path:p,bytes:(await stat(p)).size,sha256:createHash('sha256').update(buffer).digest('hex')});}
if(audit.length!==72)throw Error('Expected72 selected originals');await writeFile('docs/image-manifest.json',JSON.stringify(audit,null,2)+'\n');
console.log(JSON.stringify({originals:audit.length,originalMB:audit.reduce((s,i)=>s+i.bytes,0)/1e6,pages:files.length}));
