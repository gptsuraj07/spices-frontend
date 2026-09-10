// ============================================================
// ARIDHU — Cart Service
// Persists to localStorage. Ready for backend sync later.
// ============================================================

import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Cart, CartItem, CartItemType, CartSummary } from '../models';

const CART_STORAGE_KEY = 'aridhu_cart';
const FREE_SHIPPING_THRESHOLD = 500; // ₹500+  → free shipping
const SHIPPING_FLAT = 60;             // ₹60 flat shipping

@Injectable({ providedIn: 'root' })
export class CartService {
  private cart$$ = new BehaviorSubject<Cart>(this._loadCart());

  /** Observable cart state */
  cart$: Observable<Cart> = this.cart$$.asObservable();

  /** Observable cart summary */
  summary$: Observable<CartSummary> = this.cart$.pipe(
    map(cart => this._computeSummary(cart))
  );

  /** Observable item count */
  itemCount$: Observable<number> = this.cart$.pipe(
    map(cart => cart.items.reduce((sum, i) => sum + i.quantity, 0))
  );

  // ── Read ───────────────────────────────────────────────────
  getCart(): Cart {
    return this.cart$$.value;
  }

  getItem(itemId: string, itemType: CartItemType): CartItem | null {
    return this.cart$$.value.items.find(
      i => i.itemId === itemId && i.itemType === itemType
    ) ?? null;
  }

  getSummary(): CartSummary {
    return this._computeSummary(this.cart$$.value);
  }

  isEmpty(): boolean {
    return this.cart$$.value.items.length === 0;
  }

  // ── Mutate ─────────────────────────────────────────────────
  addItem(item: Omit<CartItem, 'id' | 'addedAt'>): void {
    const cart = { ...this.cart$$.value };
    const existing = cart.items.find(
      i => i.itemId === item.itemId && i.itemType === item.itemType
    );

    if (existing) {
      existing.quantity += item.quantity;
    } else {
      cart.items = [
        ...cart.items,
        {
          ...item,
          id: this._generateId(),
          addedAt: new Date().toISOString(),
        },
      ];
    }

    this._updateCart(cart);
  }

  updateQuantity(cartItemId: string, quantity: number): void {
    if (quantity < 1) {
      this.removeItem(cartItemId);
      return;
    }

    const cart = { ...this.cart$$.value };
    cart.items = cart.items.map(i =>
      i.id === cartItemId ? { ...i, quantity } : i
    );
    this._updateCart(cart);
  }

  removeItem(cartItemId: string): void {
    const cart = { ...this.cart$$.value };
    cart.items = cart.items.filter(i => i.id !== cartItemId);
    this._updateCart(cart);
  }

  clear(): void {
    this._updateCart(this._emptyCart());
  }

  clearCart(): void {
    this.clear();
  }

  applyCoupon(code: string): boolean {
    // Mock: no real coupon validation yet
    // When backend is ready: POST /api/coupons/validate
    const cart = { ...this.cart$$.value };
    cart.couponCode = code;
    // Mock discount: 10% for 'ARIDHU10'
    if (code === 'ARIDHU10') {
      const subtotal = cart.items.reduce((sum, i) => sum + i.price * i.quantity, 0);
      cart.discountAmount = Math.floor(subtotal * 0.1);
      this._updateCart(cart);
      return true;
    }
    return false;
  }

  removeCoupon(): void {
    const cart = { ...this.cart$$.value };
    cart.couponCode = null;
    cart.discountAmount = 0;
    this._updateCart(cart);
  }

  // ── Private ────────────────────────────────────────────────
  private _computeSummary(cart: Cart): CartSummary {
    const subtotal = cart.items.reduce((sum, i) => sum + i.price * i.quantity, 0);
    const discount = cart.discountAmount ?? 0;
    const isFreeShipping = (subtotal - discount) >= FREE_SHIPPING_THRESHOLD;
    const shipping = cart.items.length === 0 ? 0 : (isFreeShipping ? 0 : SHIPPING_FLAT);
    const total = Math.max(0, subtotal - discount + shipping);
    const itemCount = cart.items.reduce((sum, i) => sum + i.quantity, 0);

    return { subtotal, discount, shipping, total, itemCount, isFreeShipping };
  }

  private _updateCart(cart: Cart): void {
    cart.updatedAt = new Date().toISOString();
    this.cart$$.next(cart);
    this._saveCart(cart);
  }

  private _saveCart(cart: Cart): void {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
    } catch (e) {
      console.warn('Could not save cart to localStorage', e);
    }
  }

  private _loadCart(): Cart {
    try {
      const stored = localStorage.getItem(CART_STORAGE_KEY);
      if (stored) return JSON.parse(stored) as Cart;
    } catch (e) {
      console.warn('Could not load cart from localStorage', e);
    }
    return this._emptyCart();
  }

  private _emptyCart(): Cart {
    return {
      items: [],
      couponCode: null,
      discountAmount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
  }

  private _generateId(): string {
    return `ci-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
  }
}
