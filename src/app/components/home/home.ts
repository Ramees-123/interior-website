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
    'https://images.unsplash.com/photo-1615529328331-f8917597711f?w=1920&q=80',
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
  
  ngAfterViewInit() {
    // Add CSS animation classes for hero content
    if (this.heroContent?.nativeElement) {
      setTimeout(() => {
        this.heroContent.nativeElement.classList.add('hero-content-visible');
      }, 500);
    }
  }
  
  ngOnDestroy() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
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
}
