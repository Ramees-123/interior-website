import { Component, AfterViewInit, ElementRef, ViewChild, OnDestroy } from '@angular/core';

@Component({
  selector: 'app-about',
  imports: [],
  templateUrl: './about.html',
  styleUrl: './about.css',
})
export class About implements AfterViewInit, OnDestroy {
  @ViewChild('designVideo', { static: false }) videoElement!: ElementRef<HTMLVideoElement>;
  @ViewChild('videoOverlay', { static: false }) overlayElement!: ElementRef<HTMLDivElement>;
  @ViewChild('playButton', { static: false }) playButtonElement!: ElementRef<HTMLDivElement>;
  @ViewChild('projectVideo', { static: false }) projectVideoElement!: ElementRef<HTMLVideoElement>;
  @ViewChild('theaterOverlay', { static: false }) theaterOverlayElement!: ElementRef<HTMLDivElement>;
  @ViewChild('theaterPlayBtn', { static: false }) theaterPlayBtnElement!: ElementRef<HTMLDivElement>;

  private observers: IntersectionObserver[] = [];
  private countUpStarted = false;

  ngAfterViewInit() {
    this.initVideo();
    this.initProjectVideo();
    this.initScrollReveal();
    this.initCountUp();
  }

  ngOnDestroy() {
    this.observers.forEach(o => o.disconnect());
  }

  // ── Scroll reveal ──────────────────────────────────────────────────────────
  private initScrollReveal() {
    const elements = document.querySelectorAll<HTMLElement>(
      '.lux-reveal, .lux-reveal-left, .lux-reveal-right, .lux-reveal-scale'
    );
    if (!elements.length) return;

    const obs = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          (entry.target as HTMLElement).classList.add('lux-visible');
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });

    elements.forEach(el => obs.observe(el));
    this.observers.push(obs);
  }

  // ── Count-up numbers ───────────────────────────────────────────────────────
  private initCountUp() {
    const statEls = document.querySelectorAll<HTMLElement>('.stat-count');
    if (!statEls.length) return;

    const obs = new IntersectionObserver((entries) => {
      if (this.countUpStarted) return;
      const visible = entries.some(e => e.isIntersecting);
      if (!visible) return;
      this.countUpStarted = true;
      obs.disconnect();

      statEls.forEach(el => {
        const target = parseFloat(el.dataset['target'] || '0');
        const suffix = el.dataset['suffix'] || '';
        const duration = 1800;
        const start = performance.now();
        const step = (now: number) => {
          const progress = Math.min((now - start) / duration, 1);
          const eased = 1 - Math.pow(1 - progress, 3);
          const value = Math.round(eased * target);
          el.textContent = value + suffix;
          if (progress < 1) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
      });
    }, { threshold: 0.3 });

    statEls.forEach(el => obs.observe(el));
    this.observers.push(obs);
  }

  // ── Video helpers ──────────────────────────────────────────────────────────
  private playVideo(video: HTMLVideoElement, container: HTMLElement) {
    video.play().then(() => container.classList.add('playing'))
      .catch(() => { video.play(); container.classList.add('playing'); });
  }

  private bindVideo(
    video: HTMLVideoElement | undefined,
    overlay: HTMLElement | undefined,
    btn: HTMLElement | undefined,
    container: HTMLElement | null
  ) {
    if (!video || !overlay || !btn || !container) return;
    const play = () => this.playVideo(video, container);
    overlay.addEventListener('click', play);
    btn.addEventListener('click', play);
    video.addEventListener('play',  () => container.classList.add('playing'));
    video.addEventListener('pause', () => container.classList.remove('playing'));
    video.addEventListener('ended', () => container.classList.remove('playing'));
    video.addEventListener('click', e => e.stopPropagation());
  }

  private initVideo() {
    setTimeout(() => {
      this.bindVideo(
        this.videoElement?.nativeElement,
        this.overlayElement?.nativeElement,
        this.playButtonElement?.nativeElement,
        document.querySelector('.video-wrapper')
      );
    }, 300);
  }

  private initProjectVideo() {
    setTimeout(() => {
      this.bindVideo(
        this.projectVideoElement?.nativeElement,
        this.theaterOverlayElement?.nativeElement,
        this.theaterPlayBtnElement?.nativeElement,
        document.querySelector('.video-stage')
      );
    }, 300);
  }
}
