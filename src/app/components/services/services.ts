import { Component, AfterViewInit, OnDestroy } from '@angular/core';

@Component({
  selector: 'app-services',
  imports: [],
  templateUrl: './services.html',
  styleUrl: './services.css',
})
export class Services implements AfterViewInit, OnDestroy {
  private observers: IntersectionObserver[] = [];
  private intervalIds: number[] = [];
  private mouseMoveHandler?: (e: MouseEvent) => void;
  private scrollHandler?: () => void;

  ngAfterViewInit(): void {
    this.initScrollReveal();
    this.init3DTiltCards();
    this.initAnimatedCounters();
    this.initParallaxBackground();
    this.initCursorLightEffect();
    this.initStaggerAnimations();
  }

  ngOnDestroy(): void {
    this.observers.forEach(observer => observer.disconnect());

    if (this.mouseMoveHandler) {
      window.removeEventListener('mousemove', this.mouseMoveHandler);
    }

    if (this.scrollHandler) {
      window.removeEventListener('scroll', this.scrollHandler);
    }
  }

  private initScrollReveal(): void {
    const elements = document.querySelectorAll('.fade-in-up');

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
          (entry.target as HTMLElement).style.transitionDelay = `${index * 0.12}s`;
          entry.target.classList.add('show');
        }
      });
    }, { threshold: 0.15 });

    elements.forEach(el => observer.observe(el));
    this.observers.push(observer);
  }

  private init3DTiltCards(): void {
    const cards = document.querySelectorAll('.service-card');

    cards.forEach(card => {
      const element = card as HTMLElement;

      card.addEventListener('mousemove', (e) => {
        if (window.innerWidth <= 768) return;

        const rect = element.getBoundingClientRect();
        const x = (e as MouseEvent).clientX - rect.left;
        const y = (e as MouseEvent).clientY - rect.top;

        const rotateX = ((y / rect.height) - 0.5) * 8;
        const rotateY = ((x / rect.width) - 0.5) * -8;

        element.style.transform =
          `perspective(1200px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-12px) scale(1.02)`;
      });

      card.addEventListener('mouseleave', () => {
        element.style.transform = '';
      });

      card.addEventListener('touchstart', () => {
        element.classList.add('touch-active');
      }, { passive: true });

      card.addEventListener('touchend', () => {
        element.classList.remove('touch-active');
        element.style.transform = '';
      }, { passive: true });
    });
  }

  private initAnimatedCounters(): void {
    const counters = document.querySelectorAll('.stat-number');

    // always reset to 0 first
    counters.forEach(counter => {
      (counter as HTMLElement).innerText = '0';
      counter.classList.remove('counted', 'count-animate', 'count-complete');
    });

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          this.startCounter(entry.target as HTMLElement);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.25 });

    counters.forEach(counter => observer.observe(counter));
    this.observers.push(observer);

    // immediate check for counters already in viewport
    setTimeout(() => {
      this.forceTriggerCounters();
    }, 100);
  }

  private forceTriggerCounters(): void {
    const counters = document.querySelectorAll('.stat-number');

    counters.forEach(counter => {
      const rect = (counter as HTMLElement).getBoundingClientRect();

      if (rect.top < window.innerHeight) {
        this.startCounter(counter as HTMLElement);
      }
    });
  }

  private startCounter(el: HTMLElement): void {
    if (el.classList.contains('counted')) return;

    el.classList.add('counted');
    el.classList.add('count-animate');

    const target = Number(el.getAttribute('data-target') || '0');
    const duration = 5000; // Increased from 2200 to 4000ms for slower animation
    const startTime = performance.now();

    el.innerText = '0';

    const easeOutCubic = (t: number): number => {
      return 1 - Math.pow(1 - t, 3);
    };

    const updateCount = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = easeOutCubic(progress);
      const currentValue = Math.floor(target * eased);

      el.innerText = currentValue.toString();

      if (progress < 1) {
        requestAnimationFrame(updateCount);
      } else {
        el.innerText = target.toString();
        el.classList.remove('count-animate');
        el.classList.add('count-complete');
      }
    };

    requestAnimationFrame(updateCount);
  }

  private initParallaxBackground(): void {
    this.scrollHandler = () => {
      const banner = document.querySelector('.banner-image img') as HTMLElement | null;
      if (!banner || window.innerWidth <= 768) return;

      const scroll = window.scrollY;
      banner.style.transform = `scale(1.07) translateY(${scroll * 0.12}px)`;
    };

    window.addEventListener('scroll', this.scrollHandler, { passive: true });
  }

  private initCursorLightEffect(): void {
    if (window.innerWidth <= 768) return;

    let glow = document.querySelector('.cursor-glow') as HTMLElement | null;

    if (!glow) {
      glow = document.createElement('div');
      glow.className = 'cursor-glow';
      document.body.appendChild(glow);
    }

    this.mouseMoveHandler = (e: MouseEvent) => {
      if (!glow) return;
      glow.style.left = `${e.clientX}px`;
      glow.style.top = `${e.clientY}px`;
    };

    window.addEventListener('mousemove', this.mouseMoveHandler, { passive: true });
  }

  private initStaggerAnimations(): void {
    const cards = document.querySelectorAll('.services-grid .service-card');

    cards.forEach((card, index) => {
      (card as HTMLElement).style.transitionDelay = `${index * 0.12}s`;
    });
  }
}
