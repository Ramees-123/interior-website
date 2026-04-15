import { Component, signal, HostListener, AfterViewInit } from '@angular/core';
import { RouterOutlet, RouterLink, Router, NavigationEnd, NavigationStart } from '@angular/router';

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
  private readonly instagramUrl = 'https://www.instagram.com/andspacio_interior?igsh=MWk5MXJpbTh5dzNtaA==';
  private readonly whatsappNumber = '916238835584';

  constructor(private router: Router) {
    // Show loader when navigation starts, hide when it ends
    this.router.events.subscribe(event => {
      if (event instanceof NavigationStart) {
        // Show loader when user clicks a link
        this.showLoader();
      }
      if (event instanceof NavigationEnd) {
        this.transparentHeader = event.urlAfterRedirects === '/';
        // Close menu when navigation completes
        this.closeMenu();
        // Hide loader after navigation completes
        this.hideLoader();
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
    
    // Update URL to home route
    this.router.navigate(['/']);
  }

  // Enhanced scrolling functionality for all menu items
  scrollToSection(sectionId: string, event: Event) {
    event.preventDefault();
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'start',
        inline: 'nearest'
      });
    }
    this.closeMenu();
  }

  // Scroll to specific sections with offset
  scrollToSectionWithOffset(sectionId: string, offset: number = 0) {
    const element = document.getElementById(sectionId);
    if (element) {
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;
      
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
    this.closeMenu();
  }

  // Enhanced scroll behavior for smooth scrolling
  initSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', (e) => {
        e.preventDefault();
        const target = anchor.getAttribute('href');
        if (target && target !== '#') {
          const element = document.querySelector(target);
          if (element) {
            element.scrollIntoView({
              behavior: 'smooth',
              block: 'start'
            });
          }
        }
      });
    });
  }

  @HostListener('window:scroll')
  onWindowScroll() {
    this.isScrolled = window.scrollY > 50;
  }

  ngAfterViewInit() {
    // Initialize loader hide after initial page load animation completes
    this.hideLoader();
  }

  private showLoader() {
    const loader = document.getElementById('mobileLoader');
    if (loader) {
      // Remove hidden class to show loader
      loader.classList.remove('hidden');
    }
  }

  private hideLoader() {
    const loader = document.getElementById('mobileLoader');
    if (loader) {
      setTimeout(() => {
        loader.classList.add('hidden');
      }, 2000); // 2 seconds to match animation duration
      
      // Fallback: force hide if not already hidden
      setTimeout(() => {
        if (!loader.classList.contains('hidden')) {
          loader.classList.add('hidden');
        }
      }, 4000);
    }
  }

  private initMobileLoader() {
    const loader = document.getElementById('mobileLoader');
    if (loader) {
      setTimeout(() => {
        loader.classList.add('hidden');
      }, 2000); // 2 seconds to match animation duration
      
      // Fallback: force hide if not already hidden
      setTimeout(() => {
        if (!loader.classList.contains('hidden')) {
          loader.classList.add('hidden');
        }
      }, 4000);
    }
  }

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
    if (this.isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  }

  closeMenu() {
    this.isMenuOpen = false;
    document.body.style.overflow = '';
  }

  openInstagram() {
    window.open(this.instagramUrl, '_blank');
  }

  openWhatsAppChat() {
    const message = encodeURIComponent(`Hello! I'm interested in your interior design services.`);
    const whatsappUrl = `https://wa.me/${this.whatsappNumber}?text=${message}`;
    window.open(whatsappUrl, '_blank');
  }
}
