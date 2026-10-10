// Align COMPLETE drawings only. Never split or independently move characters.
const sharp=require('sharp');
const fs=require('fs');
function isolateScene(raw,w,h){
  const seen=new Uint8Array(w*h),queue=new Int32Array(w*h),components=[];
  for(let p=0;p<w*h;p++){
    if(seen[p]||raw[p*4+3]<10)continue;
    let read=0,write=0;queue[write++]=p;seen[p]=1;
    const pixels=[];let minX=w,maxX=0,minY=h,maxY=0;
    while(read<write){
      const i=queue[read++],x=i%w,y=Math.floor(i/w);pixels.push(i);
      minX=Math.min(minX,x);maxX=Math.max(maxX,x);minY=Math.min(minY,y);maxY=Math.max(maxY,y);
      for(const next of [x>0?i-1:-1,x<w-1?i+1:-1,y>0?i-w:-1,y<h-1?i+w:-1]){
        if(next<0||seen[next]||raw[next*4+3]<10)continue;
        seen[next]=1;queue[write++]=next;
      }
    }
    components.push({pixels,minX,maxX,minY,maxY});
  }
  components.sort((a,b)=>b.pixels.length-a.pixels.length);
  const main=components[0],keep=new Uint8Array(w*h);
  if(!main)throw Error('Empty complete-scene drawing');
  for(const c of components){
    const inside=c.minX>=main.minX&&c.maxX<=main.maxX&&c.minY>=main.minY&&c.maxY<=main.maxY;
    if(c===main||inside)for(const p of c.pixels)keep[p]=1;
    else if(c.pixels.length>5000)throw Error('Substantial disconnected artwork: inspect before cutting.');
  }
  for(let p=0;p<w*h;p++)if(!keep[p])raw[p*4+3]=0;
  return {bounds:{left:main.minX,right:main.maxX,top:main.minY,bottom:main.maxY},discarded:components.slice(1).filter(c=>!keep[c.pixels[0]]).map(c=>c.pixels.length)};
}
async function main(){
  const paths=process.argv.slice(2);
  if(paths.length<3||paths.length>4)throw Error('Pass ready (2x2), chase (4x4), interaction (4x4), optional corrected complete chase frame 10.');
  const frames=[],registration=[];
  fs.mkdirSync('design/source/full-keyframes',{recursive:true});
  for(let sheet=0;sheet<3;sheet++){
    const grid=sheet===0?2:4;
    const {data,info}=await sharp(paths[sheet]).ensureAlpha().raw().toBuffer({resolveWithObject:true});
    for(let f=0;f<grid*grid;f++){
      let source=data,size=info;
      const override=sheet===1&&f===10&&paths[3];
      if(override){const input=await sharp(override).ensureAlpha().raw().toBuffer({resolveWithObject:true});source=input.data;size=input.info;}
      const left=override?0:Math.round(f%grid*size.width/grid),top=override?0:Math.round(Math.floor(f/grid)*size.height/grid);
      const w=override?size.width:Math.round((f%grid+1)*size.width/grid)-left,h=override?size.height:Math.round((Math.floor(f/grid)+1)*size.height/grid)-top;
      const raw=Buffer.alloc(w*h*4);let headTop=h,floor=0;
      for(let y=0;y<h;y++)for(let x=0;x<w;x++){
        const p=((top+y)*size.width+left+x)*4,q=(y*w+x)*4;
        source.copy(raw,q,p,p+4);
        raw[q+3]=source[p+3]<100?0:Math.min(255,Math.round((source[p+3]-100)*255/154));
      }
      const cutout=isolateScene(raw,w,h);
      for(let y=0;y<h;y++)for(let x=0;x<w;x++){
        const q=(y*w+x)*4;
        if(raw[q+3]>190){
          floor=Math.max(floor,y);
          if(x>w*.30&&x<w*.70&&y<h*.5&&raw[q]<70&&raw[q+1]<70&&raw[q+2]<70)headTop=Math.min(headTop,y);
        }
      }
      let sx=0,n=0;
      for(let y=headTop;y<Math.min(h,headTop+Math.round(h*.055));y++)for(let x=Math.round(w*.25);x<w*.75;x++){
        const q=(y*w+x)*4;
        if(raw[q+3]>190&&raw[q]<70&&raw[q+1]<70&&raw[q+2]<70){sx+=x;n++;}
      }
      if(n<20||floor-headTop<h*.35)throw Error(`Unusable scene registration ${sheet}/${f}`);
      const headX=sx/n,scale=210/(floor-headTop);
      const x=150-headX*scale,y=25-headTop*scale;
      // Render the whole frame using ONE affine transform on a fixed canvas.
      const png=await sharp(raw,{raw:{width:w,height:h,channels:4}}).png().toBuffer();
      const svg=`<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="300" height="260"><image xlink:href="data:image/png;base64,${png.toString('base64')}" x="${x}" y="${y}" width="${w*scale}" height="${h*scale}"/></svg>`;
      const frame=await sharp(Buffer.from(svg)).ensureAlpha().raw().toBuffer();
      frames.push(frame);registration.push({frame:frames.length-1,sheet,pose:f,headTop,headX,floor,scale,cutout,target:{headTop:25,headX:150,floor:235}});
    }
  }
  // Close with the exact COMPLETE opening drawing, not independently reset actors.
  frames[35]=frames[0];
  for(let f=0;f<frames.length;f++)await sharp(frames[f],{raw:{width:300,height:260,channels:4}}).png().toFile(`design/source/full-keyframes/${String(f).padStart(3,'0')}.png`);
  await sharp(Buffer.concat(frames),{raw:{width:300,height:260*36,channels:4}}).webp({lossless:true}).toFile('public/assets/cast/family-full-keyframes.webp');
  fs.writeFileSync('design/source/full-registration.json',JSON.stringify(registration,null,2));
  console.log('36 complete-scene drawings registered to a shared head and floor anchor.');
}
main().catch(e=>{console.error(e);process.exitCode=1});
