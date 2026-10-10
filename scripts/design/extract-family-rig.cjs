// Offline atlas extraction; use alpha-connected cutouts, never assumed grid cells.
const sharp = require('sharp');
const fs = require('fs');
async function main() {
  const input = process.argv[2];
  if (!input) throw new Error('Pass the generated transparent cutout atlas path.');
  const {data,info} = await sharp(input).ensureAlpha().raw().toBuffer({resolveWithObject:true});
  const {width,height} = info;
  const seen = new Uint8Array(width * height);
  const queue = new Int32Array(width * height);
  const components = [];
  for (let p=0; p<seen.length; p++) {
    if (seen[p] || data[p*4+3] < 100) continue;
    let head=0,tail=0; queue[tail++]=p; seen[p]=1;
    let left=width,top=height,right=0,bottom=0;
    while(head<tail) {
      const i=queue[head++],x=i%width,y=Math.floor(i/width);
      left=Math.min(left,x);right=Math.max(right,x);top=Math.min(top,y);bottom=Math.max(bottom,y);
      for(const n of [x>0?i-1:-1,x<width-1?i+1:-1,y>0?i-width:-1,y<height-1?i+width:-1]) {
        if(n<0||seen[n]||data[n*4+3]<100)continue;
        seen[n]=1;queue[tail++]=n;
      }
    }
    if(tail>15000)components.push({left,top,right,bottom,pixels:tail});
  }
  components.sort((a,b) => (a.top<height/2?0:1)-(b.top<height/2?0:1)||a.left-b.left);
  if(components.length!==6)throw new Error(`Expected 6 separate cutouts, got ${components.length}: ${JSON.stringify(components)}`);
  const names=['arth-seated','gon-run-0','gon-run-1','pitou-run-0','pitou-run-1','arth-surprised'];
  const manifest=[];
  for(let i=0;i<components.length;i++) {
    const c=components[i],pad=12;
    const left=Math.max(0,c.left-pad),top=Math.max(0,c.top-pad);
    const box={left,top,width:Math.min(width,c.right+pad+1)-left,height:Math.min(height,c.bottom+pad+1)-top};
    const output=`public/assets/cast/${names[i]}.webp`;
    // Cat gait pairs share a calibrated nose landmark and original scale.
    if(i>=1 && i<=4) {
      // Align complementary gaits to the SAME nose and scale, not to their
      // changing paw/whole-body bounding boxes. Coordinates are in this atlas.
      const noses=[[580,293],[1104,299],[76,769],[618,776]];
      const scale=i<=2?224/549:224/564;
      const [nx,ny]=noses[i-1];
      const sprite=await sharp(input).extract(box).resize({width:Math.round(box.width*scale)}).png().toBuffer();
      const x=Math.round(32-(nx-left)*scale),y=Math.round(85-(ny-top)*scale);
      if(x<0||y<0)throw new Error('Cutout anchor must fit the fixed canvas.');
      await sharp({create:{width:240,height:200,channels:4,background:{r:0,g:0,b:0,alpha:0}}})
        .composite([{input:sprite,left:x,top:y}]).webp({quality:90,alphaQuality:100}).toFile(output);
    } else {
      await sharp(input).extract(box).resize({width:i===0?440:200}).webp({quality:90,alphaQuality:100}).toFile(output);
    }
    manifest.push({name:names[i],box,...await sharp(output).metadata()});
  }
  fs.writeFileSync('design/family-rig-layout.json',JSON.stringify(manifest,null,2)+'\n');
  console.log(JSON.stringify(manifest.map(({name,box,width,height})=>({name,box,width,height})),null,2));
}
main().catch(e=>{console.error(e);process.exitCode=1;});
