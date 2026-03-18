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
  
  // Web3Forms Access Key - Get free key from https://web3forms.com
  // This is a demo key - replace with your own key
  private web3formsAccessKey = 'ca81119b-cee1-4ca7-96a5-c29cd8c6f06a';
  private destinationEmail = 'hannaamal2715@gmail.com';
  
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
    const whatsappNumber = '918137866292'; // 8137866292 with country code 91
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
}
