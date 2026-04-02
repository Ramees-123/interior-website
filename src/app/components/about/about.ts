import { Component, AfterViewInit, ElementRef, ViewChild } from '@angular/core';

@Component({
  selector: 'app-about',
  imports: [],
  templateUrl: './about.html',
  styleUrl: './about.css',
})
export class About implements AfterViewInit {
  // Original video elements
  @ViewChild('designVideo', { static: false }) videoElement!: ElementRef<HTMLVideoElement>;
  @ViewChild('videoOverlay', { static: false }) overlayElement!: ElementRef<HTMLDivElement>;
  @ViewChild('playButton', { static: false }) playButtonElement!: ElementRef<HTMLDivElement>;

  // New project video showcase elements
  @ViewChild('projectVideo', { static: false }) projectVideoElement!: ElementRef<HTMLVideoElement>;
  @ViewChild('theaterOverlay', { static: false }) theaterOverlayElement!: ElementRef<HTMLDivElement>;
  @ViewChild('theaterPlayBtn', { static: false }) theaterPlayBtnElement!: ElementRef<HTMLDivElement>;

  ngAfterViewInit() {
    console.log('About component initialized, setting up video functionality');
    this.initVideo();
    this.initProjectVideo();
  }

  private initVideo() {
    console.log('Initializing video functionality');
    
    const video = this.videoElement?.nativeElement;
    const overlay = this.overlayElement?.nativeElement;
    const playButton = this.playButtonElement?.nativeElement;
    const wrapper = document.querySelector('.video-wrapper') as HTMLElement;
    
    console.log('Elements found:', {
      video: !!video,
      overlay: !!overlay,
      playButton: !!playButton,
      wrapper: !!wrapper
    });

    if (video && overlay && playButton && wrapper) {
      // Direct play function
      const playVideo = () => {
        console.log('Play function called');
        
        // Try to play the video
        try {
          console.log('Attempting video.play()...');
          const playPromise = video.play();
          
          if (playPromise !== undefined) {
            playPromise.then(() => {
              console.log('Video started playing');
              wrapper.classList.add('playing');
            }).catch((error) => {
              console.log('Play promise rejected:', error);
              try {
                video.play();
                wrapper.classList.add('playing');
              } catch (e) {
                console.log('Direct play also failed:', e);
              }
            });
          } else {
            console.log('No play promise, trying direct play');
            video.play();
            wrapper.classList.add('playing');
          }
        } catch (error) {
          console.log('Initial play attempt failed:', error);
          
          // Fallback attempts
          setTimeout(() => {
            try {
              console.log('Fallback attempt 1');
              video.play();
              wrapper.classList.add('playing');
            } catch (e) {
              console.log('Fallback 1 failed:', e);
              
              setTimeout(() => {
                try {
                  console.log('Fallback attempt 2');
                  video.play();
                  wrapper.classList.add('playing');
                } catch (e2) {
                  console.log('Fallback 2 failed:', e2);
                }
              }, 500);
            }
          }, 100);
        }
      }
      
      // Add click events to all interactive elements
      overlay.addEventListener('click', playVideo);
      playButton.addEventListener('click', playVideo);
      
      // Video state handlers
      video.addEventListener('play', () => {
        wrapper.classList.add('playing');
        console.log('Video is now playing');
      });
      
      video.addEventListener('pause', () => {
        wrapper.classList.remove('playing');
        console.log('Video is paused');
      });
      
      video.addEventListener('ended', () => {
        wrapper.classList.remove('playing');
        console.log('Video ended');
      });
      
      video.addEventListener('error', (e) => {
        console.error('Video error occurred:', e);
        wrapper.classList.remove('playing');
      });
      
      // Prevent video controls from triggering play
      video.addEventListener('click', (e) => {
        e.stopPropagation();
      });
      
      console.log('Video functionality initialized successfully');
    } else {
      console.log('Some video elements not found, retrying in 1 second...');
      setTimeout(() => this.initVideo(), 1000);
    }
  }

  private initProjectVideo() {
    console.log('Initializing project video showcase functionality');
    
    const video = this.projectVideoElement?.nativeElement;
    const overlay = this.theaterOverlayElement?.nativeElement;
    const playButton = this.theaterPlayBtnElement?.nativeElement;
    const stage = document.querySelector('.video-stage') as HTMLElement;
    
    console.log('Project video elements found:', {
      video: !!video,
      overlay: !!overlay,
      playButton: !!playButton,
      stage: !!stage
    });

    if (video && overlay && playButton && stage) {
      // Direct play function for theater video
      const playTheaterVideo = () => {
        console.log('Theater play function called');
        
        try {
          console.log('Attempting theater video.play()...');
          const playPromise = video.play();
          
          if (playPromise !== undefined) {
            playPromise.then(() => {
              console.log('Theater video started playing');
              stage.classList.add('playing');
            }).catch((error) => {
              console.log('Theater play promise rejected:', error);
              try {
                video.play();
                stage.classList.add('playing');
              } catch (e) {
                console.log('Theater direct play also failed:', e);
              }
            });
          } else {
            console.log('No play promise, trying direct play');
            video.play();
            stage.classList.add('playing');
          }
        } catch (error) {
          console.log('Theater initial play attempt failed:', error);
          
          // Fallback attempts
          setTimeout(() => {
            try {
              console.log('Theater fallback attempt 1');
              video.play();
              stage.classList.add('playing');
            } catch (e) {
              console.log('Theater fallback 1 failed:', e);
              
              setTimeout(() => {
                try {
                  console.log('Theater fallback attempt 2');
                  video.play();
                  stage.classList.add('playing');
                } catch (e2) {
                  console.log('Theater fallback 2 failed:', e2);
                }
              }, 500);
            }
          }, 100);
        }
      }
      
      // Add click events to all interactive elements
      overlay.addEventListener('click', playTheaterVideo);
      playButton.addEventListener('click', playTheaterVideo);
      
      // Video state handlers for theater
      video.addEventListener('play', () => {
        stage.classList.add('playing');
        console.log('Theater video is now playing');
      });
      
      video.addEventListener('pause', () => {
        stage.classList.remove('playing');
        console.log('Theater video is paused');
      });
      
      video.addEventListener('ended', () => {
        stage.classList.remove('playing');
        console.log('Theater video ended');
      });
      
      video.addEventListener('error', (e) => {
        console.error('Theater video error occurred:', e);
        stage.classList.remove('playing');
      });
      
      // Prevent video controls from triggering play
      video.addEventListener('click', (e) => {
        e.stopPropagation();
      });
      
      console.log('Theater video functionality initialized successfully');
    } else {
      console.log('Some theater video elements not found, retrying in 1 second...');
      setTimeout(() => this.initProjectVideo(), 1000);
    }
  }
}
