import { Component, OnInit, AfterViewInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-portfolio',
  imports: [CommonModule, RouterLink],
  templateUrl: './portfolio.html',
  styleUrl: './portfolio.css',
})
export class Portfolio implements OnInit, AfterViewInit, OnDestroy {

  private router = inject(Router);
  currentCategory = 'all';

  slideshowIntervals: Map<Element, any> = new Map();
  pauseTimeouts: Map<Element, any> = new Map();

  ngOnInit() {
    setTimeout(() => {
      this.initializeAllSlideshows();
      this.setupCategoryFilters();
    }, 100);
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.initializeAllSlideshows();
      this.setupCategoryFilters();
      this.initializeAnimations();
      this.initializeHoverPreview();
    }, 200);
  }

  ngOnDestroy() {
    this.slideshowIntervals.forEach(interval => clearInterval(interval));
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
      const projectCategory = project.querySelector('.project-category')?.textContent?.toLowerCase();

      if (category === 'all' || projectCategory === category) {
        project.classList.add('show');
        project.classList.remove('hide');
      } else {
        project.classList.add('hide');
        project.classList.remove('show');
      }
    });
  }

  // ---------------- INIT ----------------
  initializeAllSlideshows() {
    const containers = document.querySelectorAll('.project-slideshow');

    containers.forEach(container => {

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
      });

      container.addEventListener('mouseleave', () => {
        this.startSlideshow(container);
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
    }
  }

  // ---------------- PREVIEW ----------------
  initializeHoverPreview() {
    const images = document.querySelectorAll('.slideshow-slide img');
    const overlay = document.querySelector('.image-preview-overlay') as HTMLElement;
    const previewImg = document.querySelector('.preview-img') as HTMLImageElement;

    images.forEach(img => {
      img.addEventListener('click', (e) => {
        e.stopPropagation();

        const container = (img as HTMLElement).closest('.project-slideshow');

        if (container) {
          this.stopSlideshow(container);
        }

        previewImg.src = (img as HTMLImageElement).src;
        overlay.classList.add('show');
      });
    });

    overlay.addEventListener('click', () => {
      overlay.classList.remove('show');

      // resume all
      document.querySelectorAll('.project-slideshow').forEach(container => {
        this.startSlideshow(container);
      });
    });
  }

  private initializeAnimations(): void {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-in');
        }
      });
    }, { threshold: 0.1 });

    document.querySelectorAll('.section-header, .clients-section, .projects-cta')
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
}
