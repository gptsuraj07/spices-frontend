import { Component } from '@angular/core';

@Component({
  selector: 'app-privacy-policy',
  standalone: false,
  template: `
    <div class="policy-page page-enter">
      <!-- Hero Banner -->
      <div class="policy-hero">
        <div class="container">
          <app-breadcrumb [items]="[{label: 'Privacy Policy'}]"></app-breadcrumb>
          <div class="policy-hero__content">
            <span class="policy-tag">DATA PRIVACY &amp; SECURITY</span>
            <h1 class="policy-hero__title">Privacy Policy</h1>
            <p class="policy-hero__sub">
              At Aridhu Foods ("Aridhu", "we", "our", or "us"), we are committed to safeguarding your personal privacy. This Privacy Policy outlines how your personal information is collected, used, protected, and disclosed when you visit or make a purchase from our website.
            </p>
          </div>
        </div>
      </div>

      <!-- Policy Content Body -->
      <div class="container policy-body">
        <div class="policy-card">

          <!-- Section 1 -->
          <div class="policy-section">
            <div class="section-icon">🔒</div>
            <div class="section-text">
              <h2>1. Information We Collect</h2>
              <p>When you visit our store, place an order, or contact us, we collect necessary personal details to fulfill your requests:</p>
              <ul>
                <li><strong>Contact Information:</strong> Full name, delivery address, pincode, email address, and phone number.</li>
                <li><strong>Order History:</strong> Details about the products and combos purchased, order timestamps, and transaction IDs.</li>
                <li><strong>Device &amp; Usage Information:</strong> IP address, browser type, and navigation paths on our website to optimize user experience.</li>
              </ul>
            </div>
          </div>



          <!-- Section 3 -->
          <div class="policy-section">
            <div class="section-icon">🎯</div>
            <div class="section-text">
              <h2>3. How We Use Your Information</h2>
              <p>We strictly use your personal data for legitimate business purposes:</p>
              <ul>
                <li>To process, pack, and dispatch your spice blend orders.</li>
                <li>To send shipment tracking notifications via SMS, WhatsApp, and Email.</li>
                <li>To respond to your customer service inquiries, recipe questions, or order assistance.</li>
                <li>To prevent fraudulent transactions and maintain website security.</li>
              </ul>
              <p>
                <strong>Zero Spam Guarantee:</strong> We do NOT sell, rent, or trade your contact information to third-party advertisers or telemarketers.
              </p>
            </div>
          </div>

          <!-- Section 4 -->
          <div class="policy-section">
            <div class="section-icon">🍪</div>
            <div class="section-text">
              <h2>4. Cookies &amp; Local Session Storage</h2>
              <p>
                Our website utilizes essential browser cookies and local storage to remember your shopping cart items, selected products, and site preferences as you browse. You can disable cookies in your browser settings at any time, though some shopping cart functionality may be affected.
              </p>
            </div>
          </div>

          <!-- Section 5 -->
          <div class="policy-section">
            <div class="section-icon">📞</div>
            <div class="section-text">
              <h2>5. Contact Our Privacy Officer</h2>
              <p>
                If you have any questions about this Privacy Policy, wish to inspect the personal data we hold about you, or request account data deletion, please contact us:
              </p>
              <div class="contact-box">
                <p><strong>Aridhu Foods Privacy Officer</strong></p>
                <p><strong>Email:</strong> <a href="mailto:aridhu2026&#64;gmail.com">aridhu2026&#64;gmail.com</a></p>
                <p><strong>Phone / WhatsApp:</strong> <a href="tel:+919840218588">+91 9840218588</a></p>
                <p class="small-text">Location: Adyar, Tamil Nadu, India</p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  `,
  styles: [`
    @use 'styles/variables' as v;
    @use 'styles/mixins' as m;

    .policy-page {
      min-height: 100vh;
      background: v.$ivory;
      padding-bottom: 5rem;
    }

    .policy-hero {
      background: linear-gradient(160deg, v.$ivory 0%, v.$ivory-dark 100%);
      padding: 3rem 0 2.5rem;
      border-bottom: 1px solid v.$border-light;

      &__content {
        max-width: 720px;
        margin-top: 1rem;
      }

      .policy-tag {
        font-size: 0.75rem;
        letter-spacing: 0.12em;
        color: v.$green-primary;
        font-weight: 800;
        text-transform: uppercase;
      }

      &__title {
        font-family: v.$font-display;
        font-size: clamp(2rem, 3.5vw, 3rem);
        font-weight: 700;
        color: v.$brown-deep;
        margin: 0.5rem 0 1rem;
      }

      &__sub {
        font-size: 1.05rem;
        color: v.$text-secondary;
        line-height: 1.6;
      }
    }

    .policy-body {
      padding-top: 3rem;
    }

    .policy-card {
      background: white;
      border-radius: 1.25rem;
      border: 1px solid v.$border-light;
      padding: 3rem;
      box-shadow: 0 10px 30px -5px rgba(0,0,0,0.04);
      display: flex;
      flex-direction: column;
      gap: 2.5rem;

      @include m.respond-to('md') {
        padding: 1.5rem;
        gap: 2rem;
      }
    }

    .policy-section {
      display: flex;
      gap: 1.5rem;
      align-items: flex-start;

      @include m.respond-to('md') {
        flex-direction: column;
        gap: 0.75rem;
      }

      .section-icon {
        width: 48px;
        height: 48px;
        border-radius: 12px;
        background: v.$green-bg;
        font-size: 1.5rem;
        @include m.flex-center;
        flex-shrink: 0;
      }

      .section-text {
        flex: 1;

        h2 {
          font-family: v.$font-display;
          font-size: 1.35rem;
          font-weight: 700;
          color: v.$brown-deep;
          margin-bottom: 0.75rem;
        }

        p {
          font-size: 0.95rem;
          color: v.$text-secondary;
          line-height: 1.65;
          margin-bottom: 0.75rem;
        }

        ul {
          margin: 0.5rem 0 1rem 1.25rem;
          color: v.$text-secondary;
          font-size: 0.95rem;
          line-height: 1.7;

          li {
            margin-bottom: 0.35rem;
          }
        }
      }
    }

    .contact-box {
      background: v.$ivory;
      border: 1px solid v.$border-light;
      border-radius: 12px;
      padding: 1.25rem;
      margin-top: 0.75rem;

      p {
        margin-bottom: 0.35rem;
        font-size: 0.925rem;

        a {
          color: v.$green-primary;
          font-weight: 700;
          text-decoration: none;
          &:hover { text-decoration: underline; }
        }
      }

      .small-text {
        font-size: 0.825rem;
        color: v.$text-muted;
        margin-top: 0.5rem;
        margin-bottom: 0;
      }
    }
  `]
})
export class PrivacyPolicyComponent {}
