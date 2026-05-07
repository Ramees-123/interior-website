@echo off
REM WebP Conversion Script - Run this with elevated privileges if needed
REM Install ImageMagick from https://imagemagick.org/script/download.php or
REM Install FFmpeg from https://ffmpeg.org/download.html

setlocal enabledelayedexpansion

cd /d "%~dp0\src\assets"

echo Converting PNG files to WebP format...
echo.

set "count=0"
set "error_count=0"

for %%f in (andspacio-logo.png founder.png cofounder.png kpm1.png kpm3.png kpm4.png kpm5.png p3-1.png p3-2.png p3-4.png p3-5.png p4-5.png p4-6.png p4-7.png p4-8.png p4-14.png p4-16.png p4-18.png p4-19.png p4-21.png) do (
    if exist "%%f" (
        echo Converting: %%f
        REM Try using ImageMagick (requires installation)
        magick convert "%%f" -quality 80 "%%~nf.webp" 2>nul
        if errorlevel 1 (
            REM Try using FFmpeg as fallback
            ffmpeg -i "%%f" -q:w 80 "%%~nf.webp" -y 2>nul
            if errorlevel 1 (
                echo ERROR: Failed to convert %%f
                set /a error_count+=1
            ) else (
                set /a count+=1
                echo   OK: %%~nf.webp created
            )
        ) else (
            set /a count+=1
            echo   OK: %%~nf.webp created
        )
    ) else (
        echo SKIP: %%f not found
    )
)

echo.
echo Conversion complete: !count! successful, !error_count! failed
echo.
echo NOTE: If conversions failed, please install either:
echo   - ImageMagick: https://imagemagick.org/script/download.php
echo   - FFmpeg: https://ffmpeg.org/download.html
pause
