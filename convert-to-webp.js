#!/usr/bin/env node
const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const assetsDir = path.join(__dirname, 'src', 'assets');
const thumbsDir = path.join(assetsDir, 'portfolio', 'thumbs');
const fullDir = path.join(assetsDir, 'portfolio', 'full');

// Create output directories
fs.mkdirSync(thumbsDir, { recursive: true });
fs.mkdirSync(fullDir, { recursive: true });

// Image files that are NOT portfolio photos (logos, icons, people)
const nonPortfolioFiles = new Set([
  'andspacio-logo.png',
  'founder.png',
  'cofounder.png',
  'P1logo.jpeg',
  'p3-Logo.jpeg',
  'p6-logo.jpeg',
  'p7-logo.jpeg',
  'commercial.jpeg',
]);

// Files to skip entirely (video, text, etc.)
const skipFiles = new Set([
  'InterioVedio.mp4',
  'project2.MOV',
  'README_ADD_LOGO.txt',
]);

const imageExtensions = /\.(jpg|jpeg|png)$/i;

async function convertToWebP() {
  console.log('🚀 Starting complete WebP conversion...\n');
  console.log('Output directories:');
  console.log(`  Thumbs: ${thumbsDir}`);
  console.log(`  Full:   ${fullDir}\n`);

  // Get all image files
  const files = fs.readdirSync(assetsDir).filter(file =>
    imageExtensions.test(file) && !skipFiles.has(file)
  );

  console.log(`Found ${files.length} image files to process\n`);
  let successCount = 0;
  let errorCount = 0;
  let totalSavings = 0;

  for (const file of files) {
    const inputPath = path.join(assetsDir, file);
    const baseName = path.parse(file).name;
    const thumbOutput = path.join(thumbsDir, `${baseName}.webp`);
    const fullOutput = path.join(fullDir, `${baseName}.webp`);
    const isNonPortfolio = nonPortfolioFiles.has(file);

    try {
      if (!fs.existsSync(inputPath)) {
        console.log(`⚠️  Skipping ${file} (file not found)`);
        continue;
      }

      const stats = fs.statSync(inputPath);
      const originalSizeKb = (stats.size / 1024).toFixed(2);

      const metadata = await sharp(inputPath).metadata();
      const originalWidth = metadata.width || 0;
      const originalHeight = metadata.height || 0;

      // For non-portfolio images (logos, people), just convert to WebP at original size
      if (isNonPortfolio) {
        const outputPath = path.join(assetsDir, `${baseName}.webp`);
        await sharp(inputPath)
          .webp({ quality: 85, effort: 6 })
          .toFile(outputPath);

        const webpStats = fs.statSync(outputPath);
        const webpSizeKb = (webpStats.size / 1024).toFixed(2);
        const savings = originalSizeKb > 0 ? (((stats.size - webpStats.size) / stats.size) * 100).toFixed(1) : '0.0';
        totalSavings += parseFloat(savings || '0');

        console.log(`✅ ${file} → ${baseName}.webp (logo/people)`);
        console.log(`   ${originalSizeKb} KB → ${webpSizeKb} KB (saved ${savings}%)`);
        console.log(`   Original: ${originalWidth}×${originalHeight}\n`);
        successCount++;
        continue;
      }

      // Portfolio photos: create thumbnail AND full-size WebP
      
      // Thumbnail: max 400px width, quality 70
      const thumbWidth = Math.min(400, originalWidth);
      const thumbHeight = originalHeight > 0 ? Math.round((thumbWidth / originalWidth) * originalHeight) : 300;
      await sharp(inputPath)
        .resize({ width: thumbWidth, withoutEnlargement: true })
        .webp({ quality: 70, effort: 6 })
        .toFile(thumbOutput);

      const thumbStats = fs.statSync(thumbOutput);
      const thumbSizeKb = (thumbStats.size / 1024).toFixed(2);

      // Full: max 1200px width, quality 78
      const fullWidth = Math.min(1200, originalWidth);
      const fullHeight = originalHeight > 0 ? Math.round((fullWidth / originalWidth) * originalHeight) : 900;
      await sharp(inputPath)
        .resize({ width: fullWidth, withoutEnlargement: true })
        .webp({ quality: 78, effort: 6 })
        .toFile(fullOutput);

      const fullStats = fs.statSync(fullOutput);
      const fullSizeKb = (fullStats.size / 1024).toFixed(2);

      const savings = originalSizeKb > 0 ? (((stats.size - (thumbStats.size + fullStats.size)) / stats.size) * 100).toFixed(1) : '0.0';
      totalSavings += parseFloat(savings || '0');

      console.log(`✅ ${file}`);
      console.log(`   Original:  ${originalSizeKb} KB (${originalWidth}×${originalHeight})`);
      console.log(`   Thumbnail:  ${thumbSizeKb} KB (${thumbWidth}×${thumbHeight})`);
      console.log(`   Full:       ${fullSizeKb} KB (${fullWidth}×${fullHeight})`);
      console.log(`   Combined savings: ${savings}%\n`);
      successCount++;
    } catch (error) {
      console.error(`❌ Error converting ${file}: ${error.message}\n`);
      errorCount++;
    }
  }

  console.log('═'.repeat(50));
  console.log(`Conversion complete:`);
  console.log(`  ✅ ${successCount} images converted`);
  console.log(`  ❌ ${errorCount} errors`);
  if (successCount > 0) {
    const avgSavings = (totalSavings / successCount).toFixed(1);
    console.log(`  📊 Average file size savings: ${avgSavings}%`);
    console.log(`\nNext steps:`);
    console.log(`  1. Update portfolio.html to use /assets/portfolio/thumbs/ for grid`);
    console.log(`  2. Update portfolio.ts to load /assets/portfolio/full/ for preview`);
    console.log(`  3. Delete original PNG/JPEG files after verifying WebP works`);
  }
  console.log('═'.repeat(50));
  process.exit(errorCount > 0 ? 1 : 0);
}

convertToWebP();