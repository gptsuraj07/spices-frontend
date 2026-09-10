import { Component, OnInit } from '@angular/core';
import { CartService } from '../../core/services/cart.service';
import { Cart, CartSummary, CartItem } from '../../core/models';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-cart',
  standalone: false,
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss'],
})
export class CartComponent implements OnInit {
  cart$!: Observable<Cart>;
  summary$!: Observable<CartSummary>;
  couponCode = '';
  couponError = '';

  constructor(public cartService: CartService) {}

  ngOnInit(): void {
    this.cart$ = this.cartService.cart$;
    this.summary$ = this.cartService.summary$;
  }

  updateQuantity(item: CartItem, qty: number): void {
    this.cartService.updateQuantity(item.id, qty);
  }

  removeItem(item: CartItem): void {
    this.cartService.removeItem(item.id);
  }

  applyCoupon(): void {
    if (!this.couponCode.trim()) return;
    const applied = this.cartService.applyCoupon(this.couponCode.trim().toUpperCase());
    if (!applied) {
      this.couponError = 'Invalid coupon code.';
    } else {
      this.couponError = '';
    }
  }

  quickApplyCoupon(code: string): void {
    this.couponCode = code;
    this.applyCoupon();
  }

  getShippingProgress(subtotal: number): number {
    if (!subtotal) return 0;
    return Math.min(100, Math.round((subtotal / 500) * 100));
  }

  clearCart(): void {
    if (confirm('Are you sure you want to clear your cart?')) {
      this.cartService.clearCart();
    }
  }

  trackById(_: number, item: CartItem): string {
    return item.id;
  }
}
