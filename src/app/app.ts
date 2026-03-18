import { Component, signal, HostListener, AfterViewInit } from '@angular/core';
import { RouterOutlet, RouterLink, Router, NavigationEnd } from '@angular/router';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements AfterViewInit {
  protected readonly title = signal('interior-website');
  isScrolled = false;
  isMenuOpen = false;
  transparentHeader = true; // used to toggle transparent background on home

  constructor(private router: Router) {
    // update header background whenever navigation ends
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.transparentHeader = event.urlAfterRedirects === '/';
        // close menu when navigation completes
        this.closeMenu();
      }
    });
  }

  // scroll-to-top helper used by links
  scrollTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // Enhanced scroll to top for home page with full-height hero
  scrollToTop(event: Event) {
    event.preventDefault();
    
    // Scroll to top smoothly
    window.scrollTo({ top: 0, behavior: 'smooth' });
    
    // Animate company name when scrolling to home
    setTimeout(() => {
      const companyTitle = document.querySelector('.company-title');
      const companySubtitle = document.querySelector('.company-subtitle');
      
      if (companyTitle) {
        gsap.fromTo(companyTitle,
          { y: 15, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.8, ease: 'power2.out' }
        );
      }
      
      if (companySubtitle) {
        gsap.fromTo(companySubtitle,
          { y: 15, opacity: 0 },
          { y: 0, opacity: 0.8, duration: 0.8, ease: 'power2.out', delay: 0.2 }
        );
      }
    }, 100);
    
    // Update URL to home route
    this.router.navigate(['/']);
  }

  @HostListener('window:scroll')
  onWindowScroll() {
    this.isScrolled = window.scrollY > 50;
  }

  ngAfterViewInit() {
    this.initGSAPAnimations();
    this.initHeaderAnimation();
  }

  initHeaderAnimation() {
    // Page load animation for logo container (symbol + text) and sub‑elements
    gsap.fromTo('.logo-container',
      { y: 15, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8, ease: 'power2.out' }
    );

    gsap.fromTo('.logo-image',
      { y: 15, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.8,
        ease: 'power2.out'
      }
    );

    gsap.fromTo('.company-title',
      { y: 15, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.8,
        ease: 'power2.out',
        delay: 0.1
      }
    );

    gsap.fromTo('.company-subtitle',
      { y: 15, opacity: 0 },
      {
        y: 0,
        opacity: 0.8,
        duration: 0.8,
        ease: 'power2.out',
        delay: 0.2
      }
    );
  }

  initGSAPAnimations() {
    // First, ensure all elements are visible immediately (no initial hiding)
    // This prevents content from being invisible if GSAP/ScrollTrigger fails
    
    // Add a small delay to ensure DOM is ready, then run animations
    setTimeout(() => {
      // Fade in up animations - use from() to animate from hidden state
      gsap.utils.toArray('.fade-in-up').forEach((el: any) => {
        // Skip if already visible
        if (el.style.opacity === '1' || getComputedStyle(el).opacity === '1') return;
        
        gsap.fromTo(el, 
          { y: 30, opacity: 0 },
          {
            scrollTrigger: {
              trigger: el,
              start: 'top 90%',
              toggleActions: 'play none none none'
            },
            y: 0,
            opacity: 1,
            duration: 0.8,
            ease: 'power2.out'
          }
        );
      });

      // Safety timeout: If animations haven't completed by 3 seconds, force visibility
      // This ensures content never stays hidden due to animation failures
      setTimeout(() => {
        gsap.utils.toArray('.fade-in-up').forEach((el: any) => {
          const opacity = getComputedStyle(el).opacity;
          if (parseFloat(opacity) < 0.5) {
            gsap.to(el, { opacity: 1, y: 0, duration: 0.5, overwrite: false });
          }
        });
      }, 3000);
    }, 100);

    // Hero image parallax
    gsap.to('.hero-image img', {
      scrollTrigger: {
        trigger: '.hero',
        start: 'top top',
        end: 'bottom top',
        scrub: true
      },
      y: 100,
      scale: 1.1
    });

    // Image reveal animations
    gsap.utils.toArray('.reveal-image').forEach((el: any) => {
      gsap.fromTo(el.querySelector('img'), 
        { scale: 1.2 },
        {
          scrollTrigger: {
            trigger: el,
            start: 'top 80%',
            end: 'bottom 20%',
            scrub: 1
          },
          scale: 1,
          ease: 'none'
        }
      );
    });

    // Smooth reveal for project cards
    gsap.utils.toArray('.project-card, .project-item, .team-card').forEach((el: any, i: number) => {
      gsap.fromTo(el,
        { y: 80, opacity: 0 },
        {
          scrollTrigger: {
            trigger: el,
            start: 'top 90%',
            toggleActions: 'play none none reverse'
          },
          y: 0,
          opacity: 1,
          duration: 0.8,
          delay: i * 0.1,
          ease: 'power2.out'
        }
      );
    });

    // Text split animation for headings
    gsap.utils.toArray('h2').forEach((el: any) => {
      gsap.fromTo(el,
        { y: 30, opacity: 0 },
        {
          scrollTrigger: {
            trigger: el,
            start: 'top 85%',
            toggleActions: 'play none none reverse'
          },
          y: 0,
          opacity: 1,
          duration: 0.8,
          ease: 'power2.out'
        }
      );
    });

    // Staggered animations for service cards
    gsap.fromTo('.service-card, .value-card',
      { y: 50, opacity: 0 },
      {
        scrollTrigger: {
          trigger: '.services-grid, .values-grid',
          start: 'top 80%'
        },
        y: 0,
        opacity: 1,
        duration: 0.6,
        stagger: 0.15,
        ease: 'power2.out'
      }
    );
  }

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
    if (this.isMenuOpen) {
      document.body.style.overflow = 'hidden';
      // Animate menu items
      gsap.fromTo('.menu-link', 
        { x: -50, opacity: 0 },
        { 
          x: 0, 
          opacity: 1, 
          duration: 0.5, 
          stagger: 0.1, 
          ease: 'power2.out',
          delay: 0.2
        }
      );
    } else {
      document.body.style.overflow = '';
    }
  }

  closeMenu() {
    this.isMenuOpen = false;
    document.body.style.overflow = '';
  }
}
