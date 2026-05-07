#!/usr/bin/env node
const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const assetsDir = path.join(__dirname, 'src', 'assets');
const pngFiles = [
  'andspacio-logo.png',
  'founder.png',
  'cofounder.png',
  'kpm1.png',
  'kpm3.png',
  'kpm4.png',
  'kpm5.png',
  'p3-1.png',
  'p3-2.png',
  'p3-4.png',
  'p3-5.png',
  'p4-5.png',
  'p4-6.png',
  'p4-7.png',
  'p4-8.png',
  'p4-14.png',
  'p4-16.png',
  'p4-18.png',
  'p4-19.png',
  'p4-21.png'
];

async function convertToWebP() {
  console.log('Starting WebP conversion...\n');
  let successCount = 0;
  let errorCount = 0;

  for (const file of pngFiles) {
    const inputPath = path.join(assetsDir, file);
    const outputPath = path.join(assetsDir, file.replace('.png', '.webp'));

    try {
      if (!fs.existsSync(inputPath)) {
        console.log(`⚠️  Skipping ${file} (file not found)`);
        continue;
      }

      const stats = fs.statSync(inputPath);
      const originalSize = (stats.size / 1024).toFixed(2);

      await sharp(inputPath)
        .webp({ quality: 80, effort: 6 })
        .toFile(outputPath);

      const webpStats = fs.statSync(outputPath);
      const webpSize = (webpStats.size / 1024).toFixed(2);
      const savings = (((stats.size - webpStats.size) / stats.size) * 100).toFixed(1);

      console.log(`✅ ${file}`);
      console.log(`   Original: ${originalSize} KB → WebP: ${webpSize} KB (saved ${savings}%)\n`);
      successCount++;
    } catch (error) {
      console.error(`❌ Error converting ${file}: ${error.message}\n`);
      errorCount++;
    }
  }

  console.log(`\nConversion complete: ${successCount} successful, ${errorCount} failed`);
  process.exit(errorCount > 0 ? 1 : 0);
}

convertToWebP();
