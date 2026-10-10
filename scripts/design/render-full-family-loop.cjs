// Offline whole-scene in-betweens. 36 scene drawings → 108 frames / 3.6s / 30 FPS.
// Requires the free rife-ncnn-vulkan executable/models; nothing runs in the site.
const sharp=require('sharp');
const fs=require('fs');
const {spawnSync}=require('child_process');
const W=300,H=260,COUNT=108,KEYS=36,ALPHA_X=332,PACK_W=640,PACK_H=288;
async function main(){
  const binary=process.env.FAMILY_RIFE_BIN,model=process.env.FAMILY_RIFE_MODEL;
  if(!binary||!model)throw Error('Set FAMILY_RIFE_BIN and FAMILY_RIFE_MODEL to the local RIFE executable and rife-v4.6 model directory.');
  const root='design/source/full-render';
  for(const name of ['packed','interpolated','frames'])fs.mkdirSync(`${root}/${name}`,{recursive:true});
  const keys=[];
  for(let f=0;f<KEYS;f++)keys.push(await sharp('public/assets/cast/family-full-keyframes.webp').extract({left:0,top:f*H,width:W,height:H}).ensureAlpha().raw().toBuffer());
  for(let f=0;f<KEYS;f++){
    const raw=keys[f],packed=Buffer.alloc(PACK_W*PACK_H*3);
    for(let y=0;y<H;y++)for(let x=0;x<W;x++){
      const p=(y*W+x)*4,q=(y*PACK_W+x)*3,a=raw[p+3];
      for(let c=0;c<3;c++){packed[q+c]=Math.round(raw[p+c]*a/255);packed[(y*PACK_W+ALPHA_X+x)*3+c]=a;}
    }
    await sharp(packed,{raw:{width:PACK_W,height:PACK_H,channels:3}}).png().toFile(`${root}/packed/${String(f).padStart(3,'0')}.png`);
  }
  const frames=[],delays=[];
  for(let f=0;f<COUNT;f++){
    const key=Math.floor(f/3),step=f%3;let raw;
    if(step===0)raw=keys[key];
    else{
      const path=`${root}/interpolated/${String(f).padStart(3,'0')}.png`;
      const result=spawnSync(binary,['-0',`${root}/packed/${String(key).padStart(3,'0')}.png`,'-1',`${root}/packed/${String((key+1)%KEYS).padStart(3,'0')}.png`,'-o',path,'-m',model,'-g','-1','-j','1:4:1','-s',String(step/3)],{encoding:'utf8'});
      if(result.status!==0||!fs.existsSync(path))throw Error(`Frame ${f}: ${result.stderr}`);
      const {data:rgb,info}=await sharp(path).removeAlpha().raw().toBuffer({resolveWithObject:true});
      if(info.width!==PACK_W||info.height!==PACK_H)throw Error('Interpolation canvas changed.');
      raw=Buffer.alloc(W*H*4);
      for(let y=0;y<H;y++)for(let x=0;x<W;x++){
        const p=(y*W+x)*4,q=(y*PACK_W+x)*3,r=(y*PACK_W+ALPHA_X+x)*3,a=Math.round((rgb[r]+rgb[r+1]+rgb[r+2])/3);
        raw[p+3]=a<5?0:a;
        for(let c=0;c<3;c++)raw[p+c]=a>=5?Math.min(255,Math.round(rgb[q+c]*255/a)):0;
      }
    }
    frames.push(raw);delays.push(Math.round((f+1)*1000/30)-Math.round(f*1000/30));
    await sharp(raw,{raw:{width:W,height:H,channels:4}}).png().toFile(`${root}/frames/${String(f).padStart(3,'0')}.png`);
    if(f%18===0)console.log(`Rendered complete scene ${f+1}/${COUNT}`);
  }
  await sharp(keys[0],{raw:{width:W,height:H,channels:4}}).webp({quality:94,alphaQuality:100}).toFile('public/assets/cast/arth-gon-pitou-still.webp');
  await sharp(Buffer.concat(frames),{raw:{width:W,height:H*COUNT,channels:4,pageHeight:H}}).webp({quality:92,alphaQuality:100,loop:0,delay:delays}).toFile('public/assets/cast/arth-gon-pitou-loop.webp');
  await sharp({create:{width:1800,height:1560,channels:4,background:'#fafafa'}}).composite(Array.from({length:36},(_,i)=>({input:frames[i*3],raw:{width:W,height:H,channels:4},left:i%6*W,top:Math.floor(i/6)*H}))).png().toFile(`${root}/review.png`);
  fs.writeFileSync('design/family-full-scene.json',JSON.stringify({width:W,height:H,fps:30,duration:3600,renderedFrames:COUNT,sourceSlots:KEYS,uniqueDrawings:35,inbetweens:72,interpolation:'RIFE v4.6, CPU, whole-scene',registration:'shared beanie center/top and rug floor; no per-character transforms',playbackReview:'not reviewed locally; Arthur authorized preview push for feedback'},null,2)+'\n');
  console.log(await sharp('public/assets/cast/arth-gon-pitou-loop.webp',{animated:true}).metadata());
}
main().catch(e=>{console.error(e);process.exitCode=1});
