import { Component, OnInit, OnDestroy, signal, ElementRef, ViewChild, AfterViewInit, inject } from '@angular/core';
import { RouterLink, Router } from '@angular/router';
import { NgFor } from '@angular/common';

@Component({
  selector: 'app-home',
  imports: [RouterLink, NgFor],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild('heroContent') heroContent!: ElementRef;
  
  heroImages = [
    'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=1920&q=80',
    'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=1920&q=80',
    'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=1920&q=80',
    'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=1920&q=80',
    'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1920&q=80'
  ];
  
  // changeable duration for the hero slideshow (milliseconds)
  slideDuration = 6000; // default 6 seconds – adjust as needed or expose via input

  
  currentImageIndex = signal(0);
  private intervalId: any;
  private isAnimating = false;
  private router = inject(Router);
  
  ngOnInit() {
    this.currentImageIndex.set(0);
    this.startSlideshow();
  }
  
  private scrollObserver?: IntersectionObserver;

  ngAfterViewInit() {
    if (this.heroContent?.nativeElement) {
      setTimeout(() => {
        this.heroContent.nativeElement.classList.add('hero-content-visible');
      }, 500);
    }
    this.initScrollReveal();
  }

  private initScrollReveal() {
    const els = document.querySelectorAll<HTMLElement>(
      '.lux-reveal, .lux-reveal-left, .lux-reveal-right, .lux-reveal-scale'
    );
    if (!els.length) return;
    this.scrollObserver = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          (e.target as HTMLElement).classList.add('lux-visible');
          this.scrollObserver!.unobserve(e.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -50px 0px' });
    els.forEach(el => this.scrollObserver!.observe(el));
  }
  
  ngOnDestroy() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
    this.scrollObserver?.disconnect();
  }
  
  startSlideshow() {
    // clear any existing timer first
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
    this.intervalId = setInterval(() => {
      this.nextSlide();
    }, this.slideDuration);
  }
  
  goToSlide(index: number) {
    if (index === this.currentImageIndex() || this.isAnimating) return;
    // stop the automatic loop so manual control feels responsive
    clearInterval(this.intervalId);
    this.currentImageIndex.set(index);
    // restart slideshow timer after a moment so users can read
    this.startSlideshow();
  }
  
  nextSlide() {
    if (this.isAnimating) return;
    this.isAnimating = true;
    
    const nextIndex = (this.currentImageIndex() + 1) % this.heroImages.length;
    this.currentImageIndex.set(nextIndex);
    
    // Use CSS transitions for smooth content changes
    if (this.heroContent?.nativeElement) {
      this.heroContent.nativeElement.classList.remove('hero-content-visible');
      setTimeout(() => {
        this.heroContent.nativeElement.classList.add('hero-content-visible');
        this.isAnimating = false;
      }, 500);
    } else {
      this.isAnimating = false;
    }
  }
  
  isActive(index: number): boolean {
    return index === this.currentImageIndex();
  }

  scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  goToPortfolio() {
    this.router.navigate(['/portfolio']).then(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }
}
