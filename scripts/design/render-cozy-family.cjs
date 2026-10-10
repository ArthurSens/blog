// Six complete drawings, played forward and back; no interpolated frames.
const sharp = require('sharp');
const fs = require('fs');
const W = 300, H = 260;
async function main() {
  const source = 'public/assets/cast/family-cozy-source.webp';
  const info = await sharp(source).metadata();
  if (info.width % 3 || info.height % 2) throw Error('Expected a regular 3×2 sheet.');
  const cellW = info.width / 3, cellH = info.height / 2;
  const drawings = [];
  for (let i = 0; i < 6; i++) {
    drawings.push(await sharp(source).extract({ left: (i % 3) * cellW, top: Math.floor(i / 3) * cellH, width: cellW, height: cellH })
      .resize(W, H, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } }).ensureAlpha().raw().toBuffer());
  }
  const order = [0, 1, 2, 3, 4, 5, 4, 3, 2, 1];
  const delays = order.map((_, i) => Math.round((i + 1) * 1000 / 6) - Math.round(i * 1000 / 6));
  await sharp(drawings[0], { raw: { width: W, height: H, channels: 4 } }).webp({ lossless: true }).toFile('public/assets/cast/arth-gon-pitou-still.webp');
  await sharp(Buffer.concat(order.map(i => drawings[i])), { raw: { width: W, height: H * order.length, channels: 4, pageHeight: H } })
    .webp({ lossless: true, loop: 0, delay: delays }).toFile('public/assets/cast/arth-gon-pitou-loop.webp');
  fs.writeFileSync('design/family-cozy.json', JSON.stringify({ width: W, height: H, fps: 6, duration: 1667, outputFrames: 10, sourceDrawings: 6, order, interpolation: 'none', playbackReview: 'pending' }, null, 2) + '\n');
}
main().catch(error => { console.error(error); process.exitCode = 1; });
