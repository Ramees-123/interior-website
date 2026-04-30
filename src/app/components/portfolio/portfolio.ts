import { Component, OnInit, AfterViewInit, OnDestroy, inject } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { Router } from '@angular/router';
import { ImageOptimizationService } from '../../services/image-optimization.service';

@Component({
  selector: 'app-portfolio',
  imports: [CommonModule, NgOptimizedImage],
  templateUrl: './portfolio.html',
  styleUrl: './portfolio.css',
})
export class Portfolio implements OnInit, AfterViewInit, OnDestroy {

  private router = inject(Router);
  private imageOptimization = inject(ImageOptimizationService);
  currentCategory = 'all';

  slideshowIntervals: Map<Element, any> = new Map();
  pauseTimeouts: Map<Element, any> = new Map();
  imageLoadingMap: Map<string, Set<number>> = new Map(); // Track which images are loaded per slideshow

  ngOnInit() {
    // Initialize after component is fully loaded
    setTimeout(() => {
      this.setupCategoryFilters();
      this.initializeAnimations();
      this.initializeFilterState();
    }, 200);
  }

  ngAfterViewInit(): void {
    // Main initialization - only called once
    setTimeout(() => {
      this.initializeAllSlideshows();
      this.initializeHoverPreview();
      this.preloadVisibleImages();
    }, 200);
  }

  ngOnDestroy() {
    this.slideshowIntervals.forEach(interval => clearInterval(interval));
    this.pauseTimeouts.forEach(timeout => clearTimeout(timeout));
  }

  // ---------------- FILTER ----------------
  setupCategoryFilters() {
    const filterButtons = document.querySelectorAll('.filter-btn');

    filterButtons.forEach(btn => {
      btn.addEventListener('click', (e) => {
        const target = e.target as HTMLElement;
        const category = target.getAttribute('data-category');

        if (category) {
          this.currentCategory = category;

          filterButtons.forEach(b => b.classList.remove('active'));
          target.classList.add('active');

          this.filterProjects(category);
        }
      });
    });
  }

  filterProjects(category: string) {
    const projects = document.querySelectorAll('.project-item');

    projects.forEach(project => {
      const projectCategory = project.querySelector('.project-category')?.textContent?.toLowerCase().trim();

      if (category === 'all' || projectCategory === category.toLowerCase()) {
        project.classList.add('show');
        project.classList.remove('hide');
      } else {
        project.classList.add('hide');
        project.classList.remove('show');
      }
    });
  }

  initializeFilterState() {
    // Ensure all projects are visible by default
    const projects = document.querySelectorAll('.project-item');
    projects.forEach(project => {
      project.classList.add('show');
      project.classList.remove('hide');
    });
  }

  // ---------------- INIT ----------------
  initializeAllSlideshows() {
    const containers = document.querySelectorAll('.project-slideshow');

    containers.forEach(container => {

      // 🚀 Prevent duplicate init
      if (container.getAttribute('data-initialized') === 'true') return;
      container.setAttribute('data-initialized', 'true');

      const slides = container.querySelectorAll('.slideshow-slide');
      const prevBtn = container.querySelector('.prev-btn') as HTMLElement;
      const nextBtn = container.querySelector('.next-btn') as HTMLElement;

      if (slides.length > 0) {
        container.setAttribute('data-index', '0');
      }

      this.startSlideshow(container);

      // ✅ HOVER PAUSE
      container.addEventListener('mouseenter', () => {
        this.stopSlideshow(container);

        // also clear any pending resume timeout
        clearTimeout(this.pauseTimeouts.get(container));
      });

      container.addEventListener('mouseleave', () => {
        // small delay to avoid flicker
        const timeout = setTimeout(() => {
          this.startSlideshow(container);
        }, 300);

        this.pauseTimeouts.set(container, timeout);
      });

      // ✅ NEXT / PREV CLICK (TEMP PAUSE)
      prevBtn?.addEventListener('click', (e) => {
        e.stopPropagation();
        this.handleManualNavigation(container, -1);
      });

      nextBtn?.addEventListener('click', (e) => {
        e.stopPropagation();
        this.handleManualNavigation(container, 1);
      });
    });
  }

  // ---------------- MANUAL NAV ----------------
  handleManualNavigation(container: Element, direction: number) {
    this.stopSlideshow(container);
    this.navigateSlideshow(container, direction);

    // 🔥 resume after 3 sec
    clearTimeout(this.pauseTimeouts.get(container));

    const timeout = setTimeout(() => {
      this.startSlideshow(container);
    }, 3000);

    this.pauseTimeouts.set(container, timeout);
  }

  navigateSlideshow(container: Element, direction: number) {
    const slides = container.querySelectorAll('.slideshow-slide');
    const counter = container.querySelector('.slideshow-counter') as HTMLElement;

    let currentIndex = parseInt(container.getAttribute('data-index') || '0');
    const nextIndex = (currentIndex + direction + slides.length) % slides.length;

    slides.forEach((slide, index) => {
      slide.classList.toggle('active', index === nextIndex);
    });

    if (counter) {
      counter.textContent = `${nextIndex + 1} / ${slides.length}`;
    }

    container.setAttribute('data-index', nextIndex.toString());
  }

  // ---------------- AUTO ----------------
  startSlideshow(container: Element) {
    this.stopSlideshow(container);

    const interval = setInterval(() => {
      const slides = container.querySelectorAll('.slideshow-slide');
      const counter = container.querySelector('.slideshow-counter') as HTMLElement;

      let currentIndex = parseInt(container.getAttribute('data-index') || '0');
      const nextIndex = (currentIndex + 1) % slides.length;

      slides.forEach((slide, index) => {
        slide.classList.toggle('active', index === nextIndex);
      });

      if (counter) {
        counter.textContent = `${nextIndex + 1} / ${slides.length}`;
      }

      container.setAttribute('data-index', nextIndex.toString());

    }, 5000);

    this.slideshowIntervals.set(container, interval);
  }

  stopSlideshow(container: Element) {
    const interval = this.slideshowIntervals.get(container);
    if (interval) {
      clearInterval(interval);
      this.slideshowIntervals.delete(container); // 🔥 IMPORTANT
    }
  }

  // ---------------- PREVIEW ----------------
  initializeHoverPreview() {
    const overlay = document.querySelector('.image-preview-overlay') as HTMLElement;
    const previewImg = document.querySelector('.preview-img') as HTMLImageElement;

    if (!overlay || !previewImg) return;

    // 🔥 Use event delegation (fixes dynamic elements issue)
    document.addEventListener('click', (e) => {
      const img = (e.target as HTMLElement).closest('img');

      if (img && img.closest('.slideshow-slide')) {
        e.stopPropagation();

        const image = img as HTMLImageElement;

        // stop slideshow of clicked image
        const container = image.closest('.project-slideshow');
        if (container) this.stopSlideshow(container);

        // show preview
        previewImg.src = image.src;
        overlay.classList.add('show');
      }
    });

    // ✅ close preview
    overlay.addEventListener('click', () => {
      overlay.classList.remove('show');

      // resume all slideshows
      document.querySelectorAll('.project-slideshow').forEach(container => {
        this.startSlideshow(container);
      });
    });

    // Prevent closing when clicking image itself
    previewImg.addEventListener('click', (e) => {
      e.stopPropagation();
    });
  }

  private showImagePreview(img: HTMLImageElement, overlay: HTMLElement, previewImg: HTMLImageElement) {
    const container = img.closest('.project-slideshow');

    if (container) {
      this.stopSlideshow(container);
    }

    previewImg.src = img.src;
    overlay.classList.add('show');
  }

  private closeImagePreview(overlay: HTMLElement) {
    overlay.classList.remove('show');

    // resume all
    document.querySelectorAll('.project-slideshow').forEach(container => {
      this.startSlideshow(container);
    });
  }

  private initializeAnimations(): void {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('show');
        }
      });
    }, { threshold: 0.2 });

    document.querySelectorAll('.fade-in-up, .section-header, .clients-section, .projects-cta')
      .forEach(el => observer.observe(el));
  }

  scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  goToContact() {
    this.router.navigate(['/contact']).then(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // ============ IMAGE OPTIMIZATION ============

  /**
   * Preload images that are visible in viewport
   * Uses Intersection Observer to load images only when needed
   */
  private preloadVisibleImages() {
    const imageObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const slideshow = entry.target as HTMLElement;
          const slideshowId = slideshow.id;
          
          // Load the first/active image eagerly
          this.preloadSlideshowImages(slideshow, 0);
          
          // Preload next 1-2 images to smooth transitions
          this.preloadSlideshowImages(slideshow, 1);
          this.preloadSlideshowImages(slideshow, 2);
        }
      });
    }, { threshold: 0.1 });

    document.querySelectorAll('.project-slideshow').forEach(slideshow => {
      imageObserver.observe(slideshow);
    });
  }

  /**
   * Preload specific image in slideshow
   * Marks images as eager loading when they're about to be shown
   */
  private preloadSlideshowImages(container: Element, imageOffset: number) {
    const slides = container.querySelectorAll('.slideshow-slide');
    const currentIndex = parseInt(container.getAttribute('data-index') || '0');
    const targetIndex = (currentIndex + imageOffset) % slides.length;
    
    const targetSlide = slides[targetIndex] as HTMLElement;
    if (targetSlide) {
      const img = targetSlide.querySelector('img') as HTMLImageElement;
      if (img && img.loading === 'lazy') {
        // Change to eager loading for images about to be shown
        img.loading = 'eager';
        // Force load if not already loaded
        img.src = img.getAttribute('data-src') || img.src;
      }
    }
  }

  /**
   * Track image loading for analytics or progress indication
   */
  private markImageLoaded(slideshowId: string, imageIndex: number) {
    if (!this.imageLoadingMap.has(slideshowId)) {
      this.imageLoadingMap.set(slideshowId, new Set());
    }
    this.imageLoadingMap.get(slideshowId)!.add(imageIndex);
  }

  /**
   * Get placeholder image for blur-up effect
   */
  getImagePlaceholder(): string {
    return this.imageOptimization.getPlaceholder();
  }

  /**
   * Check if image should use eager or lazy loading
   */
  shouldEagerLoad(index: number, isFirstSlide: boolean): boolean {
    // Eager load first slide, lazy load rest
    return index === 0 || isFirstSlide;
  }
}
