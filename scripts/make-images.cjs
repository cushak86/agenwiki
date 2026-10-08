// 일러스트 PNG 1장 → 사이트용 이미지 2종 생성
//   node scripts/make-images.cjs <원본.png> <slug>
//   → public/images/posts/<slug>.webp (640×640), public/images/og/<slug>.jpg (1200×630)
const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const [src, slug] = process.argv.slice(2);
if (!src || !slug) {
  console.error('사용법: node scripts/make-images.cjs <원본.png> <slug>');
  process.exit(1);
}
const root = path.resolve(__dirname, '..', 'public', 'images');
for (const d of ['posts', 'og']) fs.mkdirSync(path.join(root, d), { recursive: true });

(async () => {
  const img = sharp(src);
  const { data } = await img.clone().extract({ left: 4, top: 4, width: 1, height: 1 }).raw().toBuffer({ resolveWithObject: true });
  const bg = { r: data[0], g: data[1], b: data[2] };
  await img.clone().resize(640, 640).webp({ quality: 78 }).toFile(path.join(root, 'posts', `${slug}.webp`));
  const sq = await img.clone().resize(630, 630).png().toBuffer();
  await sharp({ create: { width: 1200, height: 630, channels: 3, background: bg } })
    .composite([{ input: sq, left: 570, top: 0 }])
    .jpeg({ quality: 82 })
    .toFile(path.join(root, 'og', `${slug}.jpg`));
  console.log(`ok ${slug} (배경 rgb ${bg.r},${bg.g},${bg.b})`);
})().catch((e) => { console.error(e); process.exit(1); });
