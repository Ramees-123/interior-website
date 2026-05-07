# WebP Conversion Guide

## Option 1: Online Conversion (Easiest)
1. Go to https://ezgif.com/png-to-webp or https://cloudconvert.com/png-to-webp
2. Upload PNG files in batches
3. Download the WebP versions
4. Replace originals in `src/assets/`

## Option 2: Using ImageMagick (CLI)
```bash
# Install ImageMagick: https://imagemagick.org/script/download.php
# Then run:
cd src/assets
magick convert p4-16.png -quality 80 p4-16.webp
magick convert p4-21.png -quality 80 p4-21.webp
# ... repeat for other PNG files
```

## Option 3: Using FFmpeg (CLI)
```bash
# Install FFmpeg: https://ffmpeg.org/download.html
# Then run:
cd src/assets
ffmpeg -i p4-16.png -q:w 80 p4-16.webp
ffmpeg -i p4-21.png -q:w 80 p4-21.webp
# ... repeat for other PNG files
```

## Option 4: Windows Batch Script
Run the provided `convert-png-to-webp.bat` file (requires ImageMagick or FFmpeg installed)

## Files to Convert
- andspacio-logo.png
- founder.png
- cofounder.png
- kpm1.png, kpm3.png, kpm4.png, kpm5.png
- p3-1.png, p3-2.png, p3-4.png, p3-5.png
- p4-5.png, p4-6.png, p4-7.png, p4-8.png
- p4-14.png, p4-16.png, p4-18.png, p4-19.png, p4-21.png

Quality: Use 75-85 for best size/quality balance

## Expected Savings
PNG files typically reduce 30-50% in size when converted to WebP
