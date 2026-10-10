const sharp = require('sharp');
const fs = require('fs');
const smooth = v => { const t=Math.max(0,Math.min(1,v));return t*t*(3-2*t); };
const rest = gon => ({x:gon?-66:66,y:10,angle:0,facing:gon?-1:1});
const lap = (f,gon) => { const a=Math.PI+(f-6)/24*Math.PI*2+(gon?0:.65);return {x:101*Math.cos(a),y:23*Math.sin(a),angle:0,facing:-Math.sin(a)<0?1:-1}; };
const mix=(a,b,t)=>({x:a.x+(b.x-a.x)*t,y:a.y+(b.y-a.y)*t,angle:a.angle+(b.angle-a.angle)*t,facing:b.facing});
function position(f,gon) {
  const close={x:gon?-17:17,y:16,angle:0,facing:gon?-1:1};
  if(f<6||f>=54)return rest(gon);
  if(f<30)return mix(rest(gon),lap(f,gon),smooth((f-6)/4));
  if(f<36)return mix(lap(29,gon),close,smooth((f-30)/5));
  if(f<41)return {...close,angle:(gon?1:-1)*Math.sin((f-36)/5*Math.PI*2)*22};
  return mix(close,rest(gon),smooth((f-41)/12));
}
async function main(){
  const url=async name=>'data:image/png;base64,'+(await sharp(`public/assets/cast/${name}.webp`).png().toBuffer()).toString('base64');
  const body=await url('arth-seated'),head=await url('arth-surprised');
  const cats={gon:[await url('gon-run-0'),await url('gon-run-1')],pitou:[await url('pitou-run-0'),await url('pitou-run-1')]};
  const frames=[],delays=[];
  for(let f=0;f<60;f++){
    const placed=[true,false].map(gon=>{
      const p=position(f,gon),gait=f>=6&&f<36?Math.floor(f/2)%2:1;
      return {depth:p.y,svg:`<g transform="translate(${150+p.x} ${200+p.y}) rotate(${p.angle}) scale(${p.facing} 1)"><image xlink:href="${cats[gon?'gon':'pitou'][gait]}" x="-48" y="-46" width="96" height="80"/></g>`};
    });
    const actor=`<image xlink:href="${body}" x="50" y="25" width="200" height="215"/>${f>=34&&f<49?`<image xlink:href="${head}" x="116" y="30" width="74" height="96"/>`:''}`;
    const svg=`<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="300" height="260">${placed.filter(p=>p.depth<0).map(p=>p.svg).join('')}${actor}${placed.filter(p=>p.depth>=0).map(p=>p.svg).join('')}</svg>`;
    const raw=await sharp(Buffer.from(svg)).ensureAlpha().raw().toBuffer();
    frames.push(raw);delays.push(Math.round((f+1)*2500/60)-Math.round(f*2500/60));
    if(f===0)await sharp(raw,{raw:{width:300,height:260,channels:4}}).webp({quality:90}).toFile('public/assets/cast/arth-gon-pitou-still.webp');
  }
  await sharp(Buffer.concat(frames),{raw:{width:300,height:260*60,channels:4,pageHeight:260}})
    .webp({quality:88,alphaQuality:100,loop:0,delay:delays}).toFile('public/assets/cast/arth-gon-pitou-loop.webp');
  const contact=await sharp({create:{width:1200,height:260,channels:4,background:{r:250,g:250,b:250,alpha:1}}})
    .composite([0,18,36,43].map((f,i)=>({input:frames[f],raw:{width:300,height:260,channels:4},left:i*300,top:0}))).png().toBuffer();
  fs.mkdirSync('design/source',{recursive:true});fs.writeFileSync('design/source/family-loop-review.png',contact);
  console.log(await sharp('public/assets/cast/arth-gon-pitou-loop.webp',{animated:true}).metadata());
}
main().catch(e=>{console.error(e);process.exitCode=1;});
