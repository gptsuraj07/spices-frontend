import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastService } from '../../core/services/toast.service';

@Component({
  selector: 'app-contact',
  standalone: false,
  template: `
    <div class="contact-page page-enter">
      <!-- Hero Banner -->
      <div class="contact-hero">
        <div class="container">
          <app-breadcrumb [items]="[{label: 'Contact Us'}]"></app-breadcrumb>
          <div class="contact-hero__content">
            <span class="section-label">We'd Love to Hear From You</span>
            <h1 class="contact-hero__title">Contact Aridhu</h1>
            <p class="contact-hero__sub">
              Have a question about our traditional South Indian spice blends, custom orders, or bulk catering enquiries? Send us a message and our family team will get back to you promptly.
            </p>
          </div>
        </div>
      </div>

      <div class="container contact-body">
        <div class="contact-grid">
          
          <!-- Contact Info Cards -->
          <div class="contact-info">
            <div class="info-card">
              <div class="info-card__icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.64 3.48a2 2 0 0 1 1.43-2.17h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/>
                </svg>
              </div>
              <div class="info-card__content">
                <h3>Phone & WhatsApp</h3>
                <p><a href="tel:+919840218588">+91 9840218588</a></p>
                <span class="info-card__hint">Mon – Sat, 9:00 AM – 7:00 PM IST</span>
              </div>
            </div>

            <div class="info-card">
              <div class="info-card__icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                  <polyline points="22,6 12,13 2,6"/>
                </svg>
              </div>
              <div class="info-card__content">
                <h3>Email Support</h3>
                <p><a href="mailto:aridhu2026&#64;gmail.com">aridhu2026&#64;gmail.com</a></p>
                <span class="info-card__hint">Responses within 24 hours</span>
              </div>
            </div>

            <div class="info-card">
              <div class="info-card__icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                  <circle cx="12" cy="10" r="3"/>
                </svg>
              </div>
              <div class="info-card__content">
                <h3>Location</h3>
                <p>Aridhu Foods, Adyar</p>
              </div>
            </div>

            <div class="info-card info-card--highlight">
              <div class="info-card__icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M20 7h-9M14 17H5M12 3v18M18 13l3 3-3 3M6 7L3 4l3-3"/>
                </svg>
              </div>
              <div class="info-card__content">
                <h3>Bulk & Custom Orders</h3>
                <p>Looking for wedding return gifts, festival gift boxes, or restaurant supply?</p>
                <a href="mailto:aridhu2026&#64;gmail.com" class="info-card__link">Contact Bulk Sales &rarr;</a>
              </div>
            </div>
          </div>

          <!-- Contact Form -->
          <div class="contact-form-wrap">
            <h2 class="form-title">Send a Message</h2>
            <form [formGroup]="contactForm" (ngSubmit)="onSubmit()" class="contact-form">
              <div class="form-group">
                <label for="name">Your Name *</label>
                <input type="text" id="name" formControlName="name" placeholder="Enter your full name" class="form-control" [class.is-invalid]="isFieldInvalid('name')" />
                <span class="error-msg" *ngIf="isFieldInvalid('name')">Name is required</span>
              </div>

              <div class="form-row">
                <div class="form-group">
                  <label for="email">Email Address *</label>
                  <input type="email" id="email" formControlName="email" placeholder="name&#64;example.com" class="form-control" [class.is-invalid]="isFieldInvalid('email')" />
                  <span class="error-msg" *ngIf="isFieldInvalid('email')">Valid email is required</span>
                </div>
                <div class="form-group">
                  <label for="phone">Phone / WhatsApp</label>
                  <input type="tel" id="phone" formControlName="phone" placeholder="+91 98765 43210" class="form-control" />
                </div>
              </div>

              <div class="form-group">
                <label for="subject">Topic *</label>
                <select id="subject" formControlName="subject" class="form-control">
                  <option value="General Query">General Query</option>
                  <option value="Order Status">Order Status</option>
                  <option value="Spice Ingredients & Allergic Query">Spice Ingredients &amp; Recipe Advice</option>
                  <option value="Bulk Order Request">Bulk / Wedding Gift Order Request</option>
                </select>
              </div>

              <div class="form-group">
                <label for="message">Message *</label>
                <textarea id="message" formControlName="message" rows="5" placeholder="How can we help you today?" class="form-control" [class.is-invalid]="isFieldInvalid('message')"></textarea>
                <span class="error-msg" *ngIf="isFieldInvalid('message')">Message is required</span>
              </div>

              <button type="submit" class="btn btn-primary btn-lg btn-block" [disabled]="submitting">
                <span *ngIf="!submitting">Send Message &rarr;</span>
                <span *ngIf="submitting">Sending Message...</span>
              </button>
            </form>
          </div>

        </div>

        <!-- FAQ Section -->
        <div class="contact-faq">
          <h2 class="faq-title">Frequently Asked Questions</h2>
          <div class="faq-grid">
            <div class="faq-item">
              <h4>What is the shelf life of Aridhu spice blends?</h4>
              <p>Our spice blends are freshly roasted and ground in small batches without artificial preservatives. They retain peak aroma and taste for up to 9 months when stored in an airtight container away from moisture.</p>
            </div>
            <div class="faq-item">
              <h4>Do you ship internationally?</h4>
              <p>Currently we ship across all states and union territories in India. International shipping to select countries is coming soon!</p>
            </div>
            <div class="faq-item">
              <h4>Are there any added MSG, artificial colors, or anti-caking agents?</h4>
              <p>No. Aridhu products contain 100% natural spices, slow-dried herbs, and traditional salt proportions. Zero synthetic additives or colors.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    @use 'styles/variables' as v;
    @use 'styles/mixins' as m;

    .contact-page {
      min-height: 100vh;
      background: v.$ivory;
      padding-bottom: 5rem;
    }

    .contact-hero {
      background: linear-gradient(160deg, v.$ivory 0%, v.$ivory-dark 100%);
      padding: 3rem 0 2.5rem;
      border-bottom: 1px solid v.$border-light;

      &__content {
        max-width: 680px;
        margin-top: 1rem;
      }

      &__title {
        font-family: v.$font-display;
        font-size: clamp(2.25rem, 4vw, 3.5rem);
        font-weight: v.$fw-bold;
        color: v.$brown-deep;
        margin: 0.5rem 0 1rem;
      }

      &__sub {
        font-size: 1.125rem;
        color: v.$text-secondary;
        line-height: 1.6;
      }
    }

    .contact-body {
      padding-top: 3rem;
    }

    .contact-grid {
      display: grid;
      grid-template-columns: 1fr 1.3fr;
      gap: 3rem;
      align-items: start;

      @include m.respond-to('lg') {
        grid-template-columns: 1fr;
        gap: 2.5rem;
      }
    }

    .contact-info {
      display: flex;
      flex-direction: column;
      gap: 1.25rem;
    }

    .info-card {
      background: white;
      padding: 1.5rem;
      border-radius: 1rem;
      border: 1px solid v.$border-light;
      box-shadow: 0 4px 12px rgba(0,0,0,0.03);
      display: flex;
      gap: 1.25rem;
      align-items: flex-start;

      &__icon {
        width: 48px;
        height: 48px;
        border-radius: 50%;
        background: v.$green-bg;
        color: v.$green-primary;
        @include m.flex-center;
        flex-shrink: 0;
      }

      &__content {
        h3 {
          font-size: 1.125rem;
          font-weight: 700;
          color: v.$brown-deep;
          margin-bottom: 0.25rem;
        }

        p {
          font-size: 0.95rem;
          color: v.$text-secondary;
          margin: 0;
          
          a {
            color: v.$green-primary;
            text-decoration: none;
            font-weight: 600;
            &:hover { text-decoration: underline; }
          }
        }
      }

      &__hint {
        font-size: 0.825rem;
        color: v.$text-muted;
        display: block;
        margin-top: 0.25rem;
      }

      &__link {
        display: inline-block;
        margin-top: 0.5rem;
        color: v.$green-primary;
        font-weight: 700;
        font-size: 0.9rem;
        text-decoration: none;
        &:hover { text-decoration: underline; }
      }

      &--highlight {
        background: linear-gradient(135deg, rgba(v.$green-primary, 0.05) 0%, rgba(v.$turmeric, 0.08) 100%);
        border-color: rgba(v.$green-primary, 0.2);
      }
    }

    .contact-form-wrap {
      background: white;
      padding: 2.5rem;
      border-radius: 1.25rem;
      border: 1px solid v.$border-light;
      box-shadow: 0 10px 25px -5px rgba(0,0,0,0.05);

      @include m.respond-to('md') {
        padding: 1.5rem;
      }
    }

    .form-title {
      font-family: v.$font-display;
      font-size: 1.75rem;
      font-weight: 700;
      color: v.$brown-deep;
      margin-bottom: 1.5rem;
    }

    .contact-form {
      display: flex;
      flex-direction: column;
      gap: 1.25rem;
    }

    .form-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1.25rem;

      @include m.respond-to('md') {
        grid-template-columns: 1fr;
      }
    }

    .form-group {
      display: flex;
      flex-direction: column;
      gap: 0.375rem;

      label {
        font-size: 0.875rem;
        font-weight: 600;
        color: v.$brown-dark;
      }
    }

    .form-control {
      width: 100%;
      padding: 0.75rem 1rem;
      border: 1px solid v.$border-light;
      border-radius: 0.625rem;
      font-family: v.$font-body;
      font-size: 0.95rem;
      background: v.$ivory;
      transition: border-color 0.2s, box-shadow 0.2s;

      &:focus {
        outline: none;
        border-color: v.$green-primary;
        box-shadow: 0 0 0 3px rgba(v.$green-primary, 0.12);
        background: white;
      }

      &.is-invalid {
        border-color: #DC2626;
      }
    }

    .error-msg {
      font-size: 0.8rem;
      color: #DC2626;
    }

    .btn-block {
      width: 100%;
      justify-content: center;
      margin-top: 0.5rem;
    }

    .contact-faq {
      margin-top: 4rem;
      padding-top: 3rem;
      border-top: 1px solid v.$border-light;

      .faq-title {
        font-family: v.$font-display;
        font-size: 2rem;
        font-weight: 700;
        color: v.$brown-deep;
        margin-bottom: 2rem;
        text-align: center;
      }

      .faq-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
        gap: 2rem;
      }

      .faq-item {
        background: white;
        padding: 1.75rem;
        border-radius: 1rem;
        border: 1px solid v.$border-light;

        h4 {
          font-size: 1.05rem;
          font-weight: 700;
          color: v.$brown-deep;
          margin-bottom: 0.75rem;
        }

        p {
          font-size: 0.925rem;
          color: v.$text-secondary;
          line-height: 1.6;
          margin: 0;
        }
      }
    }
  `]
})
export class ContactComponent implements OnInit {
  contactForm!: FormGroup;
  submitting = false;

  constructor(
    private fb: FormBuilder,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.contactForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: [''],
      subject: ['General Query', Validators.required],
      message: ['', Validators.required]
    });
  }

  isFieldInvalid(field: string): boolean {
    const control = this.contactForm.get(field);
    return !!(control && control.invalid && (control.dirty || control.touched));
  }

  onSubmit(): void {
    if (this.contactForm.invalid) {
      this.contactForm.markAllAsTouched();
      return;
    }

    this.submitting = true;

    // Simulate sending message
    setTimeout(() => {
      this.submitting = false;
      this.toastService.show('Thank you! Your message has been received. We will get back to you shortly.', 'success');
      this.contactForm.reset({
        subject: 'General Query'
      });
    }, 800);
  }
}
