import { Component } from '@angular/core';

@Component({
  selector: 'app-terms-policy',
  standalone: false,
  template: `
    <div class="policy-page page-enter">
      <!-- Hero Banner -->
      <div class="policy-hero">
        <div class="container">
          <app-breadcrumb [items]="[{label: 'Terms of Service'}]"></app-breadcrumb>
          <div class="policy-hero__content">
            <span class="policy-tag">TERMS &amp; CONDITIONS</span>
            <h1 class="policy-hero__title">Terms of Service</h1>
            <p class="policy-hero__sub">
              Welcome to Aridhu Foods. By accessing our website, browsing our spice products, or placing an order, you agree to comply with and be bound by the following Terms and Conditions of service.
            </p>
          </div>
        </div>
      </div>

      <!-- Policy Content Body -->
      <div class="container policy-body">
        <div class="policy-card">

          <!-- Section 1 -->
          <div class="policy-section">
            <div class="section-icon">📜</div>
            <div class="section-text">
              <h2>1. General Conditions</h2>
              <p>
                Aridhu Foods reserves the right to refuse service to anyone for any reason at any time. You agree not to reproduce, duplicate, copy, sell, resell, or exploit any portion of the service, product recipes, or website content without express written permission by us.
              </p>
            </div>
          </div>

          <!-- Section 2 -->
          <div class="policy-section">
            <div class="section-icon">🌱</div>
            <div class="section-text">
              <h2>2. Product Information &amp; Shelf Life</h2>
              <p>
                Our spice powders are food products made from 100% natural spices, slow-dried herbs, and traditional salt proportions. Because we do not add synthetic anti-caking agents or chemical preservatives, minor natural oil clumping or slight color variations between seasonal batches are completely natural.
              </p>
              <ul>
                <li><strong>Storage Recommendation:</strong> Store all spice packets in a cool, dry, ceramic or stainless steel container away from direct sunlight and humidity.</li>
                <li><strong>Shelf Life:</strong> Best consumed within 9 months from the date of small batch pounding.</li>
              </ul>
            </div>
          </div>

          <!-- Section 3 -->
          <div class="policy-section">
            <div class="section-icon">💰</div>
            <div class="section-text">
              <h2>3. Pricing &amp; Modifications</h2>
              <p>
                Prices for our products are quoted in Indian Rupees (INR ₹) inclusive of all applicable taxes. Prices and product availability are subject to change without prior notice.
              </p>
            </div>
          </div>

          <!-- Section 4 -->
          <div class="policy-section">
            <div class="section-icon">⚖️</div>
            <div class="section-text">
              <h2>4. Governing Law &amp; Jurisdiction</h2>
              <p>
                These Terms of Service and any separate agreements whereby we provide you products shall be governed by and construed in accordance with the laws of India, under the jurisdiction of courts in Chennai, Tamil Nadu.
              </p>
            </div>
          </div>

          <!-- Section 5 -->
          <div class="policy-section">
            <div class="section-icon">✉️</div>
            <div class="section-text">
              <h2>5. Contact Information</h2>
              <p>Questions about the Terms of Service should be sent to us at:</p>
              <div class="contact-box">
                <p><strong>Aridhu Foods</strong></p>
                <p><strong>Email:</strong> <a href="mailto:aridhu2026&#64;gmail.com">aridhu2026&#64;gmail.com</a></p>
                <p><strong>Customer Support:</strong> <a href="tel:+919840218588">+91 9840218588</a></p>
                <p class="small-text">Adyar, Tamil Nadu, India</p>
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
export class TermsPolicyComponent {}
