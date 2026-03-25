import { Component, signal } from '@angular/core';
import { FormsModule, ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-contact',
  imports: [FormsModule, ReactiveFormsModule],
  templateUrl: './contact.html',
  styleUrl: './contact.css',
})
export class Contact {
  contactForm = new FormGroup({
    firstName: new FormControl('', [Validators.required]),
    lastName: new FormControl('', [Validators.required]),
    email: new FormControl('', [Validators.required, Validators.email]),
    phone: new FormControl('', [Validators.required, Validators.pattern(/^\+?[\d\s\-()]{10,}$/)]),
    message: new FormControl('', [Validators.required])
  });
  
  submitted = signal(false);
  showSuccessDialog = signal(false);
  showErrorDialog = signal(false);
  errorMessage = signal('');
  isSending = signal(false);
  showPhoneModal = signal(false);
  showEmailModal = signal(false);
  
  // Contact Information
  private locationAddress = 'Kozhikode, Kerala';
  private phoneNumber = '+91 62388 35584';
  private emailAddress = 'andspacio@gmail.com';
  private googleMapsUrl = 'https://maps.app.goo.gl/WQ6vCrF5PEztmFSw9?g_st=aw';
  
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
  
  async onSubmit(event: Event) {
    event.preventDefault();
    this.submitted.set(true);
    
    if (this.contactForm.valid) {
      this.isSending.set(true);
      
      const formData = this.contactForm.value;
      
      // Prepare data for Web3Forms
      const data = new FormData();
      data.append('access_key', this.web3formsAccessKey);
      data.append('to', this.destinationEmail);
      data.append('subject', 'New Contact Form Submission - Interior Website');
      data.append('from_name', `${formData.firstName} ${formData.lastName}`);
      data.append('email', formData.email || '');
      data.append('phone', formData.phone || '');
      data.append('message', formData.message || '');
      data.append('botcheck', '');
      
      try {
        // Send to Web3Forms API
        const response = await fetch('https://api.web3forms.com/submit', {
          method: 'POST',
          body: data
        });
        
        const result = await response.json();
        
        if (result.success) {
          // Also send WhatsApp message
          this.sendWhatsAppMessage(formData);
          
          // Show success dialog
          this.showSuccessDialog.set(true);
          
          // Reset form
          this.contactForm.reset();
          this.submitted.set(false);
        } else {
          // Show custom error dialog
          this.errorMessage.set('Failed to send message. Please try again later.');
          this.showErrorDialog.set(true);
        }
      } catch (error) {
        // Show custom error dialog
        this.errorMessage.set('Network error. Please check your connection and try again.');
        this.showErrorDialog.set(true);
      } finally {
        this.isSending.set(false);
      }
    } else {
      // Mark all fields as touched to show errors
      Object.keys(this.contactForm.controls).forEach(key => {
        this.contactForm.get(key)?.markAsTouched();
      });
    }
  }
  
  sendWhatsAppMessage(formData: any) {
    // Format the message for WhatsApp
    const whatsappNumber = '916238835584'; // 8137866292 with country code 91
  const message = `*New Inquiry from Andspacio Website*\n\n` +
      `*Name:* ${formData.firstName} ${formData.lastName}\n` +
      `*Email:* ${formData.email}\n` +
      `*Phone:* ${formData.phone}\n\n` +
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
    window.open(this.googleMapsUrl, '_blank');
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
