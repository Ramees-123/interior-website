import { Component, signal, computed, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './contact.html',
  styleUrl: './contact.css',
})
export class Contact implements OnDestroy {
  // Form data model for new premium form
  formData = {
    name: '',
    phone: '',
    email: '',
    service: '',
    message: ''
  };
  
  contactForm = new FormGroup({
    firstName: new FormControl('', [Validators.required]),
    lastName: new FormControl('', [Validators.required]),
    email: new FormControl('', [Validators.required, Validators.email]),
    phone: new FormControl('', [Validators.required, Validators.pattern(/^\+?[\d\s\-()]{10,}$/)]),
    message: new FormControl('', [Validators.required])
  });
  
  submitted = false;
  showSuccessDialog = signal(false);
  showErrorDialog = signal(false);
  errorMessage = signal('');
  isSending = signal(false);
  showPhoneModal = signal(false);
  showEmailModal = signal(false);
  showLocationModal = signal(false);
  
  // Studio status - real-time open/closed status
  private statusCheckInterval: any;
  currentTime = signal(new Date());
  
  // Business hours configuration (24-hour format)
  private readonly openingHour = 9;  // 9:00 AM
  private readonly closingHour = 18; // 6:00 PM
  
  isOpen = computed(() => {
    const now = this.currentTime();
    const day = now.getDay();
    const hour = now.getHours();
    
    // Sunday is 0, Saturday is 6
    // Closed on Sunday
    if (day === 0) return false;
    
    // Open from 9:00 AM to 6:00 PM (18:00) on Mon-Sat
    return hour >= this.openingHour && hour < this.closingHour;
  });
  
  statusText = computed(() => {
    return this.isOpen() ? 'Currently Open' : 'Currently Closed';
  });
  
  statusDotClass = computed(() => {
    return this.isOpen() ? 'status-dot open' : 'status-dot closed';
  });
  
  constructor() {
    // Update time every minute for real-time status
    this.statusCheckInterval = setInterval(() => {
      this.currentTime.set(new Date());
    }, 60000); // Check every minute
  }
  
  ngOnDestroy(): void {
    if (this.statusCheckInterval) {
      clearInterval(this.statusCheckInterval);
    }
  }
  
  // Contact Information
  private locationAddress = 'Kozhikode, Kerala';
  private phoneNumber = '+91 62388 35584';
  private emailAddress = 'andspacio@gmail.com';
  private googleMapsUrl = 'https://maps.app.goo.gl/KUDLWjPfT2b5Tc6fA?g_st=aw';
  
  // Web3Forms Access Key - Get free key from https://web3forms.com
  // This is a demo key - replace with your own key
  private web3formsAccessKey = '98f39a3c-bc25-44da-8313-397262deb4fd';
  private destinationEmail = 'andspacio@gmail.com';
  
  getErrorMessage(field: string): string {
    const control = this.contactForm.get(field);
    if (!control || !control.errors || !control.touched) return '';
    
    if (control.errors['required']) {
      return `${this.formatFieldName(field)} is required`;
    }
    if (control.errors['email']) {
      return 'Please enter a valid email address';
    }
    if (control.errors['pattern']) {
      return 'Please enter a valid phone number';
    }
    return '';
  }
  
  formatFieldName(field: string): string {
    return field.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
  }
  
  async onSubmit(contactForm: any) {
    this.submitted = true;

    if (
      !this.formData.name?.trim() ||
      !this.formData.phone?.trim() ||
      !this.formData.email?.trim() ||
      !this.formData.service?.trim() ||
      !this.formData.message?.trim()
    ) {
      setTimeout(() => {
        const firstInvalid = document.querySelector(
          '.input-shell.invalid, .premium-select.invalid, .textarea-shell.invalid'
        ) as HTMLElement | null;

        firstInvalid?.scrollIntoView({
          behavior: 'smooth',
          block: 'center'
        });
      }, 50);

      return;
    }

    this.isSending.set(true);
    this.errorMessage.set('');

    try {
      const data = new FormData();
      data.append('access_key', this.web3formsAccessKey);
      data.append('to', this.destinationEmail);
      data.append('subject', 'New Contact Form Submission - Interior Website');
      data.append('from_name', this.formData.name);
      data.append('email', this.formData.email);
      data.append('phone', this.formData.phone);
      data.append('message', `Service: ${this.formData.service}\n\n${this.formData.message}`);
      data.append('botcheck', '');

      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        body: data
      });

      const result = await response.json();

      if (result.success) {
        this.sendWhatsAppMessage(this.formData);
        this.showSuccessDialog.set(true);

        this.formData = {
          name: '',
          phone: '',
          email: '',
          service: '',
          message: ''
        };

        this.submitted = false;
        contactForm.resetForm();
      } else {
        this.errorMessage.set('Failed to send message. Please try again later.');
        this.showErrorDialog.set(true);
      }
    } catch (error) {
      this.errorMessage.set('Network error. Please check your connection and try again.');
      this.showErrorDialog.set(true);
    } finally {
      this.isSending.set(false);
    }
  }
  
  sendWhatsAppMessage(formData: any) {
    // Format the message for WhatsApp
    const whatsappNumber = '916238835584'; // 8137866292 with country code 91
    const message = `*New Inquiry from Andspacio Website*\n\n` +
        `*Name:* ${formData.name}\n` +
        `*Email:* ${formData.email}\n` +
        `*Phone:* ${formData.phone}\n` +
        `*Service:* ${formData.service}\n\n` +
        `*Message:*\n${formData.message}`;
    
    // Encode the message for URL
    const encodedMessage = encodeURIComponent(message);
    
    // Create WhatsApp URL
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;
    
    // Open WhatsApp in a new tab
    window.open(whatsappUrl, '_blank');
  }
  
  closeDialog() {
    this.showSuccessDialog.set(false);
  }
  
  closeErrorDialog() {
    this.showErrorDialog.set(false);
  }
  
  // Location Card - Opens Google Maps
  openLocation(event: Event) {
    // Add ripple effect
    this.addRippleEffect(event);
    this.showLocationModal.set(true);
  }

  closeLocationModal() {
    this.showLocationModal.set(false);
  }
  
  // Phone Card - Opens Modal
  openPhoneModal(event: Event) {
    this.addRippleEffect(event);
    this.showPhoneModal.set(true);
  }
  
  closePhoneModal() {
    this.showPhoneModal.set(false);
  }
  
  // Call Now - Initiates phone call
  makeCall(event: Event) {
    this.addRippleEffect(event);
    window.location.href = `tel:${this.phoneNumber}`;
    this.closePhoneModal();
  }
  
  // WhatsApp Chat
  chatOnWhatsApp(event: Event) {
    this.addRippleEffect(event);
    const message = encodeURIComponent(`Hello! I'm interested in your interior design services.`);
    const whatsappUrl = `https://wa.me/916238835584?text=${message}`;
    window.open(whatsappUrl, '_blank');
    this.closePhoneModal();
  }

  // Email Card - Opens Gmail modal
  openEmail(event: Event) {
    this.addRippleEffect(event);
    this.showEmailModal.set(true);
  }
  
  closeEmailModal() {
    this.showEmailModal.set(false);
  }
  
  // Send Email via Gmail
  sendEmail(event: Event) {
    this.addRippleEffect(event);
    const subject = encodeURIComponent('Interior Design Inquiry');
    const body = encodeURIComponent('Hello! I would like to discuss my interior design requirements.');
    // Open in Gmail app/website
    window.open(`https://mail.google.com/mail/?view=cm&fs=1&to=${this.emailAddress}&su=${subject}&body=${body}`, '_blank');
    this.closeEmailModal();
  }
  
  // Open Default Email App
  openDefaultEmail(event: Event) {
    this.addRippleEffect(event);
    const subject = encodeURIComponent('Interior Design Inquiry');
    const body = encodeURIComponent('Hello! I would like to discuss my interior design requirements.');
    window.location.href = `mailto:${this.emailAddress}?subject=${subject}&body=${body}`;
    this.closeEmailModal();
  }
  
  // Ripple Effect for Click Animation
  private addRippleEffect(event: Event) {
    const target = event.currentTarget as HTMLElement;
    const rect = target.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = (event as MouseEvent).clientX - rect.left - size / 2;
    const y = (event as MouseEvent).clientY - rect.top - size / 2;
    
    const ripple = document.createElement('span');
    ripple.style.position = 'absolute';
    ripple.style.borderRadius = '50%';
    ripple.style.background = 'rgba(255, 255, 255, 0.6)';
    ripple.style.transform = 'scale(0)';
    ripple.style.animation = 'ripple 0.6s linear';
    ripple.style.left = `${x}px`;
    ripple.style.top = `${y}px`;
    ripple.style.width = `${size}px`;
    ripple.style.height = `${size}px`;
    ripple.style.pointerEvents = 'none';
    ripple.style.zIndex = '10';
    
    target.style.position = 'relative';
    target.style.overflow = 'hidden';
    target.appendChild(ripple);
    
    setTimeout(() => {
      ripple.remove();
    }, 600);
  }
  
  // Handle keyboard navigation for accessibility
  handleKeyDown(event: KeyboardEvent, action: string) {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      switch(action) {
        case 'location':
          this.openLocation(event);
          break;
        case 'phone':
          this.openPhoneModal(event);
          break;
        case 'email':
          this.openEmail(event);
          break;
      }
    }
  }
}
