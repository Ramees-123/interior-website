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
      // Animate menu items using CSS classes
      const menuLinks = document.querySelectorAll('.menu-link');
      menuLinks.forEach((link, index) => {
        setTimeout(() => {
          link.classList.add('active');
        }, index * 100);
      });
    } else {
      document.body.style.overflow = '';
      // Remove animation classes
      const menuLinks = document.querySelectorAll('.menu-link');
      menuLinks.forEach(link => {
        link.classList.remove('active');
      });
    }
  }

  closeMenu() {
    this.isMenuOpen = false;
    document.body.style.overflow = '';
  }
}
