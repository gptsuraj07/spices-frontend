import { Component } from '@angular/core';

@Component({
  selector: 'app-shipping-policy',
  standalone: false,
  template: `
    <div class="policy-page page-enter">
      <!-- Hero Banner -->
      <div class="policy-hero">
        <div class="container">
          <app-breadcrumb [items]="[{label: 'Shipping Policy'}]"></app-breadcrumb>
          <div class="policy-hero__content">
            <span class="policy-tag">DELIVERY &amp; DISPATCH</span>
            <h1 class="policy-hero__title">Shipping &amp; Delivery Policy</h1>
            <p class="policy-hero__sub">
              At Aridhu, every spice blend is freshly roasted and ground in small batches to preserve its natural volatile aromatic oils. Here is everything you need to know about how we package, dispatch, and deliver your orders across India.
            </p>
          </div>
        </div>
      </div>

      <!-- Policy Content Body -->
      <div class="container policy-body">
        <div class="policy-card">

          <!-- Section 1 -->
          <div class="policy-section">
            <div class="section-icon">📦</div>
            <div class="section-text">
              <h2>1. Processing &amp; Small-Batch Grinding</h2>
              <p>
                To guarantee maximum freshness, our spice powders are not mass-produced or stored in warehouses for long periods. Orders are packed directly from our small batch fresh pounding cycles.
              </p>
              <ul>
                <li><strong>Order Processing Time:</strong> Orders placed before 12:00 PM IST are processed and prepared within <strong>24 to 48 business hours</strong>.</li>
                <li><strong>Dispatch Days:</strong> Monday through Saturday (excluding national holidays and public festivals).</li>
              </ul>
            </div>
          </div>

          <!-- Section 2 -->
          <div class="policy-section">
            <div class="section-icon">🚚</div>
            <div class="section-text">
              <h2>2. Shipping Rates &amp; Coverage (Chennai Only)</h2>
              <p>Online website checkout and <strong>FREE Delivery is available for orders inside Chennai</strong> (Minimum Order Value: ₹500).</p>
              
              <div class="policy-table-wrapper">
                <table class="policy-table">
                  <thead>
                    <tr>
                      <th>Online Order Requirement</th>
                      <th>Delivery Fee</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td><strong>Minimum Order Value (Inside Chennai)</strong></td>
                      <td><strong>₹500</strong></td>
                    </tr>
                    <tr>
                      <td><strong>Shipping Charges (Inside Chennai)</strong></td>
                      <td><strong>FREE (₹0)</strong></td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div class="contact-box" style="margin-top: 1rem;">
                <p><strong>💬 Orders Outside Chennai or Orders Under ₹500:</strong></p>
                <p>
                  For all orders <strong>outside Chennai</strong>, or if you wish to purchase smaller quantities under ₹500, please contact us through WhatsApp at <a href="https://wa.me/919840218588?text=Hi%20Aridhu%20Foods%2C%20I%20would%20like%20to%20place%20an%20order%20for%20delivery%20outside%20Chennai" target="_blank" rel="noopener">+91 9840218588</a> for further enquiries and order assistance.
                </p>
              </div>
            </div>
          </div>

          <!-- Section 3 -->
          <div class="policy-section">
            <div class="section-icon">📍</div>
            <div class="section-text">
              <h2>3. Order Tracking</h2>
              <p>
                As soon as your order is dispatched from our unit in Tamil Nadu, you will receive an SMS and Email containing your unique shipment tracking number and courier tracking link.
              </p>
              <p>
                You can also track your order status anytime on our website using our dedicated <a routerLink="/track-order" class="policy-link">Track Order Page</a> with your Order ID or phone number.
              </p>
            </div>
          </div>

          <!-- Section 4 -->
          <div class="policy-section">
            <div class="section-icon">🌿</div>
            <div class="section-text">
              <h2>4. Food-Grade Aroma Seal Packaging</h2>
              <p>
                All Aridhu products are sealed in multi-layer food-grade, moisture-barrier pouches. This multi-layered barrier shields whole spices from ambient air, humidity, and direct sunlight during transit, ensuring that when you open the pack, the aroma is as fresh as the day it was pounded.
              </p>
            </div>
          </div>

          <!-- Section 5 -->
          <div class="policy-section">
            <div class="section-icon">📞</div>
            <div class="section-text">
              <h2>5. Address Modifications &amp; Assistance</h2>
              <p>
                If you accidentally entered an incomplete or incorrect shipping address, please contact our support team immediately within <strong>2 hours</strong> of placing your order:
              </p>
              <div class="contact-box">
                <p><strong>Phone / WhatsApp:</strong> <a href="tel:+919840218588">+91 9840218588</a></p>
                <p><strong>Email:</strong> <a href="mailto:aridhu2026&#64;gmail.com">aridhu2026&#64;gmail.com</a></p>
                <p class="small-text">Hours: Monday – Saturday, 9:00 AM – 7:00 PM IST</p>
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

    .policy-table-wrapper {
      overflow-x: auto;
      margin-top: 1rem;
      border: 1px solid v.$border-light;
      border-radius: 12px;
    }

    .policy-table {
      width: 100%;
      border-collapse: collapse;
      font-size: 0.9rem;
      text-align: left;

      th {
        background: v.$ivory-dark;
        color: v.$brown-deep;
        font-weight: 700;
        padding: 0.875rem 1.25rem;
        border-bottom: 1px solid v.$border-light;
      }

      td {
        padding: 0.875rem 1.25rem;
        border-bottom: 1px solid v.$border-light;
        color: v.$text-secondary;
      }

      tr:last-child td {
        border-bottom: none;
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
export class ShippingPolicyComponent {}
