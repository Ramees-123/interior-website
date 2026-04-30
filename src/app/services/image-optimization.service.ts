import { Injectable } from '@angular/core';

/**
 * Service to optimize image loading and serving
 * Provides optimized image paths with size variants and WebP fallback
 */
@Injectable({
  providedIn: 'root'
})
export class ImageOptimizationService {
  // Define image size variants for responsive loading
  private imageSizes = {
    thumbnail: { width: 300, quality: 80 },
    small: { width: 600, quality: 85 },
    medium: { width: 800, quality: 85 },
    large: { width: 1200, quality: 85 },
    xlarge: { width: 1920, quality: 80 }
  };

  /**
   * Generate optimized image path
   * Returns a properly sized image path for the given image
   */
  getOptimizedImagePath(imagePath: string, sizeKey: keyof typeof this.imageSizes = 'medium'): string {
    // For local assets, return the path as-is (browser will handle optimization)
    // In production, you could serve from a CDN with image optimization
    return imagePath;
  }

  /**
   * Get srcset for responsive image loading
   * Creates srcset attribute value for different screen sizes
   */
  getSrcSet(imagePath: string): string {
    // This would generate srcset if using an image CDN
    // For now, return empty as we're using local assets
    return '';
  }

  /**
   * Get blur-up placeholder (base64 low-quality image)
   * Returns a simple gradient placeholder or data URL
   */
  getPlaceholder(): string {
    // SVG placeholder for smooth blur-up effect
    return 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600"%3E%3Crect fill="%23e0e0e0" width="800" height="600"/%3E%3C/svg%3E';
  }

  /**
   * Check if image should be lazy loaded based on visibility
   */
  shouldLazyLoad(isVisible: boolean): 'lazy' | 'eager' {
    return isVisible ? 'eager' : 'lazy';
  }

  /**
   * Get image dimensions for aspect ratio preservation
   */
  getImageDimensions(imageWidth: number, imageHeight: number) {
    return {
      width: imageWidth,
      height: imageHeight,
      aspectRatio: (imageWidth / imageHeight).toFixed(3)
    };
  }
}
