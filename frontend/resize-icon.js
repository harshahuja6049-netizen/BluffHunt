// frontend/resize-icon.js

import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const inputPath = path.join(__dirname, 'public', 'logo.png');
const outputDir = path.join(__dirname, 'public', 'icons');

if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });

const sizes = [
  { width: 192, height: 192, name: 'icon-192.png' },
  { width: 512, height: 512, name: 'icon-512.png' },
  { width: 180, height: 180, name: 'apple-touch-icon.png' }
];

async function resize() {
  for (const size of sizes) {
    await sharp(inputPath)
      .resize(size.width, size.height, {
        fit: 'cover', // 👈 Forces EXACT square by cropping
        position: 'centre'
      })
      .png()
      .toFile(path.join(outputDir, size.name));
    console.log(`✅ Created ${size.name} (${size.width}x${size.height})`);
  }
  console.log('🎉 All icons created!');
}

resize().catch(console.error);