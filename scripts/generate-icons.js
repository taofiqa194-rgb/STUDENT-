import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

async function generate() {
  const svgPath = path.resolve('public', 'icon.svg');
  const svgBuffer = fs.readFileSync(svgPath);

  // 192x192
  await sharp(svgBuffer)
    .resize(192, 192)
    .png()
    .toFile(path.resolve('public', 'pwa-192x192.png'));

  // 512x512
  await sharp(svgBuffer)
    .resize(512, 512)
    .png()
    .toFile(path.resolve('public', 'pwa-512x512.png'));

  // 512x512 maskable (with 15% safe padding as required by pwa skill)
  await sharp(svgBuffer)
    .resize(410, 410)
    .extend({
      top: 51,
      bottom: 51,
      left: 51,
      right: 51,
      background: { r: 5, g: 150, b: 105, alpha: 1 },
    })
    .png()
    .toFile(path.resolve('public', 'pwa-maskable-512x512.png'));

  // Apple touch icon (180x180)
  await sharp(svgBuffer)
    .resize(180, 180)
    .png()
    .toFile(path.resolve('public', 'apple-touch-icon.png'));

  // Favicon (64x64 PNG copy for favicon.ico)
  await sharp(svgBuffer)
    .resize(64, 64)
    .png()
    .toFile(path.resolve('public', 'favicon.ico'));

  console.log('Successfully generated all PWA icons!');
}

generate().catch(console.error);
