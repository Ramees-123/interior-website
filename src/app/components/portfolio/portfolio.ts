import { Component, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-portfolio',
  imports: [CommonModule],
  templateUrl: './portfolio.html',
  styleUrl: './portfolio.css',
})
export class Portfolio implements OnInit, AfterViewInit, OnDestroy {
  slideshowIntervals: Map<string, any> = new Map();
  currentCategory = 'all';

  ngOnInit() {
    // Initialize all project slideshows
    setTimeout(() => {
      this.initializeAllSlideshows();
      this.setupCategoryFilters();
    }, 100);
  }

  ngAfterViewInit(): void {
    // Re-initialize when view is fully loaded to ensure OUR CLIENTS and Get a Quote sections load properly
    setTimeout(() => {
      this.initializeAllSlideshows();
      this.setupCategoryFilters();
      this.initializeAnimations();
    }, 200);
  }

  ngOnDestroy() {
    // Cleanup all slideshow intervals
    this.slideshowIntervals.forEach((interval, slideshowId) => {
      if (interval) {
        clearInterval(interval);
      }
    });
  }

  setupCategoryFilters() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    filterButtons.forEach(btn => {
      btn.addEventListener('click', (e) => {
        const target = e.target as HTMLElement;
        const category = target.getAttribute('data-category');
        
        if (category) {
          this.currentCategory = category;
          
          // Update active filter button
          filterButtons.forEach(b => b.classList.remove('active'));
          target.classList.add('active');
          
          // Filter projects
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

  initializeAllSlideshows() {
    const slideshowContainers = document.querySelectorAll('.project-slideshow');
    
    slideshowContainers.forEach(container => {
      const slideshowId = container.id;
      if (slideshowId) {
        this.initializeSlideshow(slideshowId);
      }
    });
  }

  initializeSlideshow(slideshowId: string) {
    const container = document.getElementById(slideshowId);
    if (!container) return;

    const slides = container.querySelectorAll('.slideshow-slide');
    const prevBtn = container.querySelector('.prev-btn') as HTMLElement;
    const nextBtn = container.querySelector('.next-btn') as HTMLElement;
    const counter = container.querySelector('.slideshow-counter') as HTMLElement;

    if (slides.length === 0) return;

    let currentIndex = 0;
    let isTransitioning = false;

    // Start auto-slide with consistent timing for all projects
    const interval = setInterval(() => {
      if (!isTransitioning) {
        // Sequential order: 1,2,3,4,5 then back to 1
        currentIndex = (currentIndex + 1) % slides.length;
        this.nextSlide(slides, currentIndex, slides.length, isTransitioning, counter);
      }
    }, 8000); // Consistent 8 seconds for all projects

    this.slideshowIntervals.set(slideshowId, interval);

    // Manual navigation with sequential order
    if (prevBtn) {
      prevBtn.addEventListener('click', () => {
        this.stopAutoSlide(slideshowId);
        // Sequential backward: 5,4,3,2,1 then back to 5
        currentIndex = this.prevSlide(slides, currentIndex, slides.length, isTransitioning, counter);
        this.startAutoSlide(slideshowId);
      });
    }

    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        this.stopAutoSlide(slideshowId);
        // Sequential forward: 1,2,3,4,5 then back to 1
        currentIndex = this.nextSlide(slides, currentIndex, slides.length, isTransitioning, counter);
        this.startAutoSlide(slideshowId);
      });
    }

    // Pause on hover with consistent timing
    container.addEventListener('mouseenter', () => {
      this.stopAutoSlide(slideshowId);
    });

    container.addEventListener('mouseleave', () => {
      setTimeout(() => {
        this.startAutoSlide(slideshowId);
      }, 1500); // Consistent 1.5 seconds before resuming
    });
  }

  nextSlide(slides: NodeListOf<Element>, currentIndex: number, totalSlides: number, isTransitioning: boolean, counter: HTMLElement): number {
    if (isTransitioning) return currentIndex;
    
    isTransitioning = true;
    const newIndex = (currentIndex + 1) % totalSlides;
    
    // Update active slide
    slides.forEach((slide, index) => {
      if (index === newIndex) {
        slide.classList.add('active');
      } else {
        slide.classList.remove('active');
      }
    });

    // Update counter
    if (counter) {
      counter.textContent = `${newIndex + 1} / ${totalSlides}`;
    }

    setTimeout(() => {
      isTransitioning = false;
    }, 500);

    return newIndex;
  }

  prevSlide(slides: NodeListOf<Element>, currentIndex: number, totalSlides: number, isTransitioning: boolean, counter: HTMLElement): number {
    if (isTransitioning) return currentIndex;
    
    isTransitioning = true;
    const newIndex = (currentIndex - 1 + totalSlides) % totalSlides;
    
    // Update active slide
    slides.forEach((slide, index) => {
      if (index === newIndex) {
        slide.classList.add('active');
      } else {
        slide.classList.remove('active');
      }
    });

    // Update counter
    if (counter) {
      counter.textContent = `${newIndex + 1} / ${totalSlides}`;
    }

    setTimeout(() => {
      isTransitioning = false;
    }, 500);

    return newIndex;
  }

  stopAutoSlide(slideshowId: string) {
    const interval = this.slideshowIntervals.get(slideshowId);
    if (interval) {
      clearInterval(interval);
      this.slideshowIntervals.set(slideshowId, null);
    }
  }

  startAutoSlide(slideshowId: string) {
    const container = document.getElementById(slideshowId);
    if (!container) return;

    const slides = container.querySelectorAll('.slideshow-slide');
    if (slides.length === 0) return;

    const interval = setInterval(() => {
      const currentIndex = Array.from(slides).findIndex(slide => slide.classList.contains('active'));
      if (currentIndex !== -1) {
        this.nextSlide(slides, currentIndex, slides.length, false, container.querySelector('.slideshow-counter') as HTMLElement);
      }
    }, 8000); // Consistent 8 seconds for all projects

    this.slideshowIntervals.set(slideshowId, interval);
  }

  private initializeAnimations(): void {
    // Intersection Observer for fade-in animations for OUR CLIENTS and Get a Quote sections
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-in');
        }
      });
    }, { threshold: 0.1 });

    // Observe OUR CLIENTS section
    const clientsSection = document.querySelector('.clients-section');
    if (clientsSection) {
      observer.observe(clientsSection);
    }

    // Observe Get a Quote section
    const ctaSection = document.querySelector('.projects-cta');
    if (ctaSection) {
      observer.observe(ctaSection);
    }

    // Observe other sections that might need animation
    document.querySelectorAll('.section-header').forEach(item => {
      observer.observe(item);
    });
  }
}
