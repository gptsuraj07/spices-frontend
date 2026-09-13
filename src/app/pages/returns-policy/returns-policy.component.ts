import { Component } from '@angular/core';

@Component({
  selector: 'app-returns-policy',
  standalone: false,
  template: `
    <div class="policy-page page-enter">
      <!-- Hero Banner -->
      <div class="policy-hero">
        <div class="container">
          <app-breadcrumb [items]="[{label: 'Returns & Refund Policy'}]"></app-breadcrumb>
          <div class="policy-hero__content">
            <span class="policy-tag">CUSTOMER SATISFACTION &amp; ASSURANCE</span>
            <h1 class="policy-hero__title">Returns &amp; Refund Policy</h1>
            <p class="policy-hero__sub">
              Your trust in our authentic South Indian spice blends is our top priority. Because our products are edible spice powders freshly ground in small batches, we maintain strict quality control and food safety guidelines.
            </p>
          </div>
        </div>
      </div>

      <!-- Policy Content Body -->
      <div class="container policy-body">
        <div class="policy-card">

          <!-- Section 1 -->
          <div class="policy-section">
            <div class="section-icon">🛡️</div>
            <div class="section-text">
              <h2>1. Return Policy for Food Products</h2>
              <p>
                Due to food safety, hygiene regulations, and the consumable nature of handcrafted spice powders, <strong>we cannot accept returns or exchanges for opened or delivered spice packages</strong> unless the item delivered is damaged, leaking, defective, or incorrect.
              </p>
            </div>
          </div>

          <!-- Section 2 -->
          <div class="policy-section">
            <div class="section-icon">⚠️</div>
            <div class="section-text">
              <h2>2. Damaged, Leaking or Incorrect Shipments</h2>
              <p>
                If your order arrives damaged during transit, has a broken seal, or if you received an incorrect product, we will immediately send a fresh replacement or issue a full refund at zero additional cost to you.
              </p>
              <div class="steps-box">
                <h3>Steps to claim a replacement or refund:</h3>
                <ol>
                  <li>Contact our customer support team within <strong>48 hours of delivery</strong>.</li>
                  <li>Share your <strong>Order ID</strong> along with clear <strong>photos or a quick video</strong> showing the outer parcel packaging and the damaged / incorrect item.</li>
                  <li>Reach us via WhatsApp/Phone at <a href="tel:+919840218588" class="policy-link">+91 9840218588</a> or Email at <a href="mailto:aridhu2026&#64;gmail.com" class="policy-link">aridhu2026&#64;gmail.com</a>.</li>
                </ol>
              </div>
            </div>
          </div>

          <!-- Section 3 -->
          <div class="policy-section">
            <div class="section-icon">🔄</div>
            <div class="section-text">
              <h2>3. Order Cancellations</h2>
              <p>
                You may request an order cancellation within <strong>2 hours of placing your order</strong>, provided the order has not already been dispatched by our logistics team.
              </p>
              <p>
                Once an order has been packed and handed over to our courier partner, it cannot be cancelled.
              </p>
            </div>
          </div>

          <!-- Section 4 -->
          <div class="policy-section">
            <div class="section-icon">💳</div>
            <div class="section-text">
              <h2>4. Refund Method &amp; Timelines</h2>
              <p>
                Upon verification of a damaged or incorrect shipment claim, your refund will be initiated immediately.
              </p>
              <ul>
                <li><strong>Prepaid Orders (UPI / Net Banking / Cards):</strong> Refund will be credited back to your original payment account within <strong>3 to 5 business days</strong>.</li>
                <li><strong>Cash on Delivery (COD) / Bank Transfer:</strong> Refund will be transferred directly to your bank account / UPI ID supplied during customer support resolution within <strong>2 to 4 business days</strong>.</li>
              </ul>
            </div>
          </div>

          <!-- Section 5 -->
          <div class="policy-section">
            <div class="section-icon">💬</div>
            <div class="section-text">
              <h2>5. Need Assistance?</h2>
              <p>Our family team is here to assist you with any questions or order concerns:</p>
              <div class="contact-box">
                <p><strong>Customer Helpline &amp; WhatsApp:</strong> <a href="tel:+919840218588">+91 9840218588</a></p>
                <p><strong>Support Email:</strong> <a href="mailto:aridhu2026&#64;gmail.com">aridhu2026&#64;gmail.com</a></p>
                <p class="small-text">Mon – Sat, 9:00 AM – 7:00 PM IST</p>
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

    .policy-link {
      color: v.$green-primary;
      font-weight: 700;
      text-decoration: underline;
      &:hover { color: v.$brown-deep; }
    }

    .steps-box {
      background: v.$ivory-dark;
      border-left: 4px solid v.$green-primary;
      padding: 1.25rem 1.5rem;
      border-radius: 0 12px 12px 0;
      margin-top: 1rem;

      h3 {
        font-size: 1rem;
        font-weight: 700;
        color: v.$brown-deep;
        margin-bottom: 0.5rem;
      }

      ol {
        margin: 0.5rem 0 0 1.25rem;
        color: v.$text-secondary;
        font-size: 0.925rem;
        line-height: 1.65;

        li {
          margin-bottom: 0.4rem;
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
export class ReturnsPolicyComponent {}
