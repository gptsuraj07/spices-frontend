// ============================================================
// ARIDHU — Order Service
// Handles all order operations: creation, tracking, admin actions
// ============================================================

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import {
  Order, OrderStatus, PaymentStatus, CartItem, Address, CartSummary,
  StatusHistoryEntry, PaymentDetails, FulfillmentDetails
} from '../models';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class OrderService {
  private apiUrl = `${environment.apiUrl}/orders`;

  constructor(private http: HttpClient) {}

  // ── Helpers ───────────────────────────────────────────────

  /** Generate ARU-YYYYMMDD-XXXX format order number */
  generateOrderNumber(): string {
    const now = new Date();
    const yyyy = now.getFullYear();
    const mm   = String(now.getMonth() + 1).padStart(2, '0');
    const dd   = String(now.getDate()).padStart(2, '0');
    const xxxx = String(Math.floor(1000 + Math.random() * 9000));
    return `ARU-${yyyy}${mm}${dd}-${xxxx}`;
  }

  /** Normalize a raw API order to always have payment/fulfillment/statusHistory */
  private normalizeOrder(o: any): Order {
    // Handle legacy orders with flat paymentStatus/paymentMethod fields
    const payment: PaymentDetails = o.payment ?? {
      method:  o.paymentMethod  ?? 'UPI',
      status:  this.normalizeLegacyPaymentStatus(o.paymentStatus ?? 'PENDING_VERIFICATION'),
      utrNumber: o.utrNumber,
    };
    const fulfillment: FulfillmentDetails = o.fulfillment ?? {};
    const statusHistory: StatusHistoryEntry[] = o.statusHistory ?? [
      {
        status:    this.normalizeLegacyOrderStatus(o.status ?? 'ORDER_PLACED'),
        timestamp: o.createdAt ?? new Date().toISOString(),
        note:      'Order placed',
      }
    ];
    const status: OrderStatus = this.normalizeLegacyOrderStatus(o.status ?? 'ORDER_PLACED');

    return {
      id:              o.id || o._id,
      orderNumber:     o.orderNumber ?? `ARU-${Date.now().toString().slice(-12)}`,
      customerId:      o.customerId  ?? null,
      customer:        o.customer    ?? { name: 'Guest', email: '', phone: '' },
      shippingAddress: o.shippingAddress ?? {},
      items:           (o.items ?? []).map((it: any) => ({
        itemId:    it.itemId   ?? it.id ?? '',
        itemType:  it.itemType ?? 'product',
        name:      it.name     ?? 'Item',
        imageUrl:  it.imageUrl ?? null,
        price:     it.price    ?? 0,
        quantity:  it.quantity ?? it.qty ?? 1,
        subtotal:  it.subtotal ?? (it.price ?? 0) * (it.quantity ?? it.qty ?? 1),
      })),
      subtotal:       o.subtotal ?? 0,
      discount:       o.discount ?? 0,
      shipping:       o.shipping ?? 0,
      total:          o.total    ?? 0,
      couponCode:     o.couponCode ?? null,
      status,
      payment,
      fulfillment,
      statusHistory,
      adminNotes:     o.adminNotes,
      notes:          o.notes ?? null,
      createdAt:      o.createdAt ?? new Date().toISOString(),
      updatedAt:      o.updatedAt ?? new Date().toISOString(),
    };
  }

  private normalizeLegacyOrderStatus(s: string): OrderStatus {
    const map: Record<string, OrderStatus> = {
      pending:          'ORDER_PLACED',
      confirmed:        'PAYMENT_VERIFICATION',
      payment_verified: 'PAYMENT_CONFIRMED',
      processing:       'PROCESSING',
      shipped:          'SHIPPED',
      out_for_delivery: 'OUT_FOR_DELIVERY',
      delivered:        'DELIVERED',
      cancelled:        'CANCELLED',
      refunded:         'CANCELLED',
      // New statuses (pass through)
      ORDER_PLACED:          'ORDER_PLACED',
      PAYMENT_VERIFICATION:  'PAYMENT_VERIFICATION',
      PAYMENT_CONFIRMED:     'PAYMENT_CONFIRMED',
      PROCESSING:            'PROCESSING',
      SHIPPED:               'SHIPPED',
      OUT_FOR_DELIVERY:      'OUT_FOR_DELIVERY',
      DELIVERED:             'DELIVERED',
      PAYMENT_FAILED:        'PAYMENT_FAILED',
      CANCELLED:             'CANCELLED',
    };
    return map[s] ?? 'ORDER_PLACED';
  }

  private normalizeLegacyPaymentStatus(s: string): PaymentStatus {
    const map: Record<string, PaymentStatus> = {
      pending:               'PENDING_VERIFICATION',
      paid:                  'PAID',
      failed:                'FAILED',
      refunded:              'REFUNDED',
      PENDING_VERIFICATION:  'PENDING_VERIFICATION',
      PAID:                  'PAID',
      FAILED:                'FAILED',
      REFUNDED:              'REFUNDED',
    };
    return map[s] ?? 'PENDING_VERIFICATION';
  }

  // ── Customer: Create Order ─────────────────────────────────

  createOrder(params: {
    customer:       { name: string; email: string; phone: string };
    shippingAddress: Address;
    items:           CartItem[];
    summary:         CartSummary;
    couponCode:      string | null;
    paymentMethod?:  string;
    utrNumber?:      string;
  }): Observable<Order> {
    const orderNumber = this.generateOrderNumber();
    const now = new Date().toISOString();

    const initialHistory: StatusHistoryEntry[] = [
      { status: 'ORDER_PLACED', timestamp: now, note: 'Order placed successfully' },
      { status: 'PAYMENT_VERIFICATION', timestamp: now, note: 'Awaiting payment verification' },
    ];

    const payment: PaymentDetails = {
      method:    params.paymentMethod ?? 'UPI',
      status:    'PENDING_VERIFICATION',
      utrNumber: params.utrNumber,
    };

    const payload = {
      orderNumber,
      customer:        params.customer,
      shippingAddress: params.shippingAddress,
      items: params.items.map(ci => ({
        itemId:   ci.itemId,
        itemType: ci.itemType,
        name:     ci.name,
        imageUrl: ci.imageUrl,
        price:    ci.price,
        quantity: ci.quantity,
        subtotal: ci.price * ci.quantity,
      })),
      subtotal:      params.summary.subtotal,
      discount:      params.summary.discount,
      shipping:      params.summary.shipping,
      total:         params.summary.total,
      couponCode:    params.couponCode,
      status:        'ORDER_PLACED',
      payment,
      fulfillment:   {},
      statusHistory: initialHistory,
      notes:         null,
      createdAt:     now,
      updatedAt:     now,
    };

    return this.http.post<any>(this.apiUrl, payload).pipe(
      map(o => this.normalizeOrder(o)),
      catchError(err => {
        console.error('Error saving order to backend:', err);
        // Fallback local order
        const fallback: Order = this.normalizeOrder({
          ...payload,
          id: `ord-${Date.now()}`,
          customerId: null,
        });
        return of(fallback);
      })
    );
  }

  // ── Customer: Submit UTR number ────────────────────────────

  submitUtrNumber(orderId: string, utrNumber: string): Observable<Order> {
    return this.http.patch<any>(`${this.apiUrl}/${orderId}`, {
      'payment.utrNumber': utrNumber,
      utrNumber,   // top-level backup for legacy handling
    }).pipe(
      map(o => this.normalizeOrder(o)),
      catchError(err => {
        console.error('Error submitting UTR:', err);
        return of({} as Order);
      })
    );
  }

  // ── Customer: Get order by number (public) ─────────────────

  getOrderByNumber(orderNumber: string): Observable<Order | null> {
    // Try the dedicated by-number endpoint first, fall back to generic
    return this.http.get<any>(`${this.apiUrl}/${encodeURIComponent(orderNumber)}`).pipe(
      map(o => this.normalizeOrder(o)),
      catchError(() => of(null))
    );
  }

  // ── Admin: Get all orders ──────────────────────────────────

  getAll(): Observable<Order[]> {
    return this.http.get<any[]>(this.apiUrl).pipe(
      map(orders => orders.map(o => this.normalizeOrder(o))),
      catchError(err => {
        console.error('Error fetching orders from backend:', err);
        return of([]);
      })
    );
  }

  // ── Admin: Get order by ID ─────────────────────────────────

  getById(id: string): Observable<Order | null> {
    return this.http.get<any>(`${this.apiUrl}/${id}`).pipe(
      map(o => this.normalizeOrder(o)),
      catchError(() => of(null))
    );
  }

  // ── Admin: Update order status ─────────────────────────────

  updateOrderStatus(id: string, status: OrderStatus, note?: string): Observable<Order> {
    const now = new Date().toISOString();
    const historyEntry: StatusHistoryEntry = { status, timestamp: now, note };
    return this.http.patch<any>(`${this.apiUrl}/${id}`, {
      status,
      updatedAt: now,
      $push: { statusHistory: historyEntry },  // MongoDB push if supported
      _historyEntry: historyEntry,              // fallback signal for backend
    }).pipe(
      map(o => this.normalizeOrder(o)),
      catchError(err => {
        console.error('Error updating order status:', err);
        return of({} as Order);
      })
    );
  }

  // ── Admin: Verify payment ──────────────────────────────────

  verifyPayment(id: string, adminName = 'Admin'): Observable<Order> {
    const now = new Date().toISOString();
    const historyEntry: StatusHistoryEntry = {
      status:    'PAYMENT_CONFIRMED',
      timestamp: now,
      note:      'Payment verified by admin',
    };
    return this.http.patch<any>(`${this.apiUrl}/${id}`, {
      status:            'PAYMENT_CONFIRMED',
      payment:           { status: 'PAID', verifiedAt: now, verifiedBy: adminName, method: 'UPI' },
      paymentStatus:     'paid',   // legacy compat
      updatedAt:         now,
      _historyEntry:     historyEntry,
    }).pipe(
      map(o => this.normalizeOrder(o)),
      catchError(err => {
        console.error('Error verifying payment:', err);
        return of({} as Order);
      })
    );
  }

  // ── Admin: Reject payment ──────────────────────────────────

  rejectPayment(id: string): Observable<Order> {
    const now = new Date().toISOString();
    const historyEntry: StatusHistoryEntry = {
      status:    'PAYMENT_FAILED',
      timestamp: now,
      note:      'Payment rejected by admin',
    };
    return this.http.patch<any>(`${this.apiUrl}/${id}`, {
      status:        'PAYMENT_FAILED',
      payment:       { status: 'FAILED', method: 'UPI' },
      paymentStatus: 'failed',   // legacy compat
      updatedAt:     now,
      _historyEntry: historyEntry,
    }).pipe(
      map(o => this.normalizeOrder(o)),
      catchError(err => {
        console.error('Error rejecting payment:', err);
        return of({} as Order);
      })
    );
  }

  // ── Admin: Update shipping details ─────────────────────────

  updateShippingDetails(id: string, provider: string, trackingNumber: string): Observable<Order> {
    const now = new Date().toISOString();
    const historyEntry: StatusHistoryEntry = {
      status:    'SHIPPED',
      timestamp: now,
      note:      `Shipped via ${provider}. Tracking: ${trackingNumber}`,
    };
    const fulfillment: FulfillmentDetails = { provider, trackingNumber, shippedAt: now };
    return this.http.patch<any>(`${this.apiUrl}/${id}`, {
      status:        'SHIPPED',
      fulfillment,
      updatedAt:     now,
      _historyEntry: historyEntry,
    }).pipe(
      map(o => this.normalizeOrder(o)),
      catchError(err => {
        console.error('Error updating shipping details:', err);
        return of({} as Order);
      })
    );
  }

  // ── Admin: Generic update (for misc patches) ───────────────

  updateOrder(id: string, updates: Partial<Order>): Observable<Order> {
    return this.http.patch<any>(`${this.apiUrl}/${id}`, { ...updates, updatedAt: new Date().toISOString() }).pipe(
      map(o => this.normalizeOrder(o)),
      catchError(err => {
        console.error('Error updating order:', err);
        return of(updates as Order);
      })
    );
  }

  // ── Admin: Delete order ────────────────────────────────────

  deleteOrder(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`).pipe(
      catchError(err => {
        console.error('Error deleting order:', err);
        return of({ message: 'Deleted' });
      })
    );
  }
}
