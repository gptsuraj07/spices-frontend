import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CartService } from '../../core/services/cart.service';
import { OrderService } from '../../core/services/order.service';
import { CartSummary } from '../../core/models';

@Component({
  selector: 'app-checkout',
  standalone: false,
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.scss'],
})
export class CheckoutComponent implements OnInit {
  form!: FormGroup;
  summary!: CartSummary;
  submitting = false;

  /** Current checkout step: 1 = Details, 2 = UPI Payment */
  currentStep = 1;

  /** UPI copy button state */
  upiCopied = false;

  /** Customer's UTR / Transaction ID (optional) */
  utrNumber = '';

  constructor(
    private fb: FormBuilder,
    private cartService: CartService,
    private orderService: OrderService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.summary = this.cartService.getSummary();

    // Redirect to cart if empty
    if (this.cartService.isEmpty()) {
      this.router.navigate(['/cart']);
      return;
    }

    this.form = this.fb.group({
      // Customer
      name:    ['', [Validators.required, Validators.minLength(2)]],
      email:   ['', [Validators.required, Validators.email]],
      phone:   ['', [Validators.required, Validators.pattern(/^[6-9]\d{9}$/)]],
      // Address
      line1:   ['', Validators.required],
      line2:   [''],
      city:    ['', Validators.required],
      state:   ['', Validators.required],
      pincode: ['', [Validators.required, Validators.pattern(/^\d{6}$/)]],
    });
  }

  /** Validates Step 1 and advances to UPI payment screen */
  goToPayment(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.currentStep = 2;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  /** Copy UPI ID to clipboard */
  copyUpiId(): void {
    navigator.clipboard.writeText('boim-801085880616@boi').then(() => {
      this.upiCopied = true;
      setTimeout(() => (this.upiCopied = false), 2500);
    });
  }

  /** User confirms they have paid — create order and redirect to success page */
  confirmPayment(): void {
    if (this.submitting) return;
    this.submitting = true;

    const v = this.form.value;
    const cart = this.cartService.getCart();

    this.orderService.createOrder({
      customer: { name: v.name, email: v.email, phone: v.phone },
      shippingAddress: {
        name: v.name, phone: v.phone,
        line1: v.line1, line2: v.line2,
        city: v.city, state: v.state,
        pincode: v.pincode, country: 'India',
      },
      items: cart.items,
      summary: this.summary,
      couponCode: cart.couponCode,
      paymentMethod: 'UPI',
      utrNumber: this.utrNumber.trim() || undefined,
    }).subscribe(order => {
      this.cartService.clear();
      this.router.navigate(['/order-success'], { queryParams: { order: order.orderNumber } });
    });
  }

  getError(field: string, error: string): boolean {
    const c = this.form.get(field);
    return !!(c && c.touched && c.hasError(error));
  }
}
