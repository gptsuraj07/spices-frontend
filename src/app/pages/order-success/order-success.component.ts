// ============================================================
// ARIDHU — Order Success Page
// Shows order confirmation with Track Order button
// ============================================================

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-order-success',
  standalone: false,
  template: `
    <div class="success-page page-enter">
      <div class="container">
        <div class="success-card">

          <!-- Animated check icon -->
          <div class="success-card__icon-wrap" aria-hidden="true">
            <svg class="success-card__check" width="48" height="48" viewBox="0 0 24 24"
                 fill="none" stroke="currentColor" stroke-width="1.8">
              <circle cx="12" cy="12" r="10"/>
              <polyline points="9,12 11,14 15,10"/>
            </svg>
          </div>

          <h1 class="success-card__title">Order Confirmed!</h1>
          <p class="success-card__order">Order #{{ orderNumber }}</p>

          <!-- Payment verification notice -->
          <div class="success-card__notice">
            <span class="success-card__notice-dot"></span>
            <span>Payment verification pending — our team will confirm within 1–2 hours.</span>
          </div>

          <p class="success-card__desc">
            Thank you for your order! Your spices will be carefully packed and dispatched
            after payment is confirmed. You'll receive an update on your phone.
          </p>

          <div class="success-card__actions">
            <a [href]="'/track-order?order=' + orderNumber" class="btn btn-primary btn-lg" id="track-order-btn">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
                <line x1="3" y1="6" x2="21" y2="6"/>
                <path d="M16 10a4 4 0 0 1-8 0"/>
              </svg>
              Track Order
            </a>
            <a routerLink="/shop" class="btn btn-outline" id="continue-shopping-btn">Continue Shopping</a>
          </div>

          <p class="success-card__footnote">
            Save your order number to track anytime: <strong>{{ orderNumber }}</strong>
          </p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    @use 'styles/variables' as v;
    @use 'styles/mixins' as m;

    .success-page {
      min-height: 100vh;
      background: v.$ivory;
      display: flex;
      align-items: center;
      padding: 4rem 0;
    }

    .success-card {
      max-width: 540px;
      margin: 0 auto;
      background: white;
      border-radius: 24px;
      padding: 3rem;
      text-align: center;
      box-shadow: 0 8px 48px rgba(0,0,0,0.08);
      border: 1px solid rgba(0,0,0,0.06);
      animation: slideUp 0.5s cubic-bezier(0.16, 1, 0.3, 1) both;

      @include m.respond-to('sm') {
        padding: 2rem 1.5rem;
        margin: 0 1rem;
      }

      &__icon-wrap {
        width: 88px;
        height: 88px;
        border-radius: 50%;
        background: v.$green-bg;
        color: v.$green-primary;
        margin: 0 auto 1.5rem;
        display: flex;
        align-items: center;
        justify-content: center;
        animation: bounceIn 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) 0.2s both;
      }

      &__check { stroke: v.$green-primary; }

      &__title {
        font-family: v.$font-display;
        font-size: 2.2rem;
        font-weight: 700;
        color: v.$brown-deep;
        margin: 0 0 0.5rem;
      }

      &__order {
        color: v.$green-primary;
        font-weight: 700;
        font-size: 1rem;
        letter-spacing: 0.08em;
        text-transform: uppercase;
        margin-bottom: 1.25rem;
      }

      &__notice {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 0.5rem;
        background: rgba(#C99A32, 0.08);
        border: 1px solid rgba(#C99A32, 0.25);
        border-radius: 50px;
        padding: 0.5rem 1rem;
        font-size: 0.8rem;
        font-weight: 500;
        color: #7A6518;
        margin-bottom: 1.25rem;
      }

      &__notice-dot {
        width: 7px;
        height: 7px;
        border-radius: 50%;
        background: #C99A32;
        flex-shrink: 0;
        animation: pulse 1.5s ease-in-out infinite;
      }

      &__desc {
        color: v.$text-secondary;
        line-height: 1.7;
        margin: 0 0 2rem;
        font-size: 0.95rem;
      }

      &__actions {
        display: flex;
        gap: 0.75rem;
        justify-content: center;
        flex-wrap: wrap;
        margin-bottom: 1.5rem;
      }

      &__footnote {
        font-size: 0.78rem;
        color: v.$text-muted;
        background: v.$ivory;
        border-radius: 8px;
        padding: 0.75rem 1rem;
      }
    }

    @keyframes bounceIn {
      0%   { transform: scale(0); opacity: 0; }
      60%  { transform: scale(1.1); }
      100% { transform: scale(1); opacity: 1; }
    }

    @keyframes slideUp {
      from { transform: translateY(24px); opacity: 0; }
      to   { transform: translateY(0); opacity: 1; }
    }

    @keyframes pulse {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.4; }
    }
  `]
})
export class OrderSuccessComponent implements OnInit {
  orderNumber = '';

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.orderNumber = params['order'] ?? 'ARU-XXXXXXXX-XXXX';
    });
  }
}
