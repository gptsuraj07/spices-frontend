// ============================================================
// ARIDHU ADMIN — Orders Component
// Full order management with payment verify/reject and shipping
// ============================================================

import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { OrderService } from '../../core/services/order.service';
import {
  Order, OrderStatus, PaymentStatus,
  ORDER_STATUS_LABEL, ORDER_TIMELINE_STEPS
} from '../../core/models';

@Component({
  selector: 'app-admin-orders',
  standalone: false,
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.scss'],
})
export class AdminOrdersComponent implements OnInit {
  orders: Order[] = [];
  filtered: Order[] = [];
  loading = true;
  selectedOrder: Order | null = null;

  filterStatus  = 'all';
  filterPayment = 'all';
  searchQuery   = '';

  // Shipping modal
  showShippingModal = false;
  shippingOrder: Order | null = null;
  shippingProvider = '';
  shippingTracking = '';
  shippingSaving   = false;

  // Confirm dialog
  confirmDialog: {
    visible: boolean;
    title: string;
    message: string;
    action: 'verify' | 'reject' | 'status';
    order: Order | null;
    targetStatus?: OrderStatus;
  } = { visible: false, title: '', message: '', action: 'verify', order: null };

  // Expose constants to template
  readonly STATUS_LABEL = ORDER_STATUS_LABEL;
  readonly mainStatusSteps: OrderStatus[] = ['ORDER_PLACED', 'PAYMENT_CONFIRMED', 'PROCESSING', 'SHIPPED', 'DELIVERED'];

  getStatusLabel(s: string | OrderStatus): string {
    return (s && this.STATUS_LABEL[s as OrderStatus]) ? this.STATUS_LABEL[s as OrderStatus] : s;
  }

  constructor(
    private orderService: OrderService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.loadOrders();
  }

  loadOrders(): void {
    this.loading = true;
    this.orderService.getAll().subscribe(orders => {
      this.orders = orders;
      this.applyFilter();
      this.loading = false;
    });
  }

  // ── Filtering ─────────────────────────────────────────────

  applyFilter(): void {
    let result = [...this.orders];

    if (this.searchQuery.trim()) {
      const q = this.searchQuery.toLowerCase();
      result = result.filter(o =>
        o.orderNumber.toLowerCase().includes(q) ||
        o.customer.name.toLowerCase().includes(q) ||
        o.customer.phone.includes(q)
      );
    }

    if (this.filterStatus !== 'all') {
      result = result.filter(o => o.status === this.filterStatus);
    }

    if (this.filterPayment !== 'all') {
      result = result.filter(o => o.payment?.status === this.filterPayment);
    }

    this.filtered = result;
  }

  setStatusFilter(status: string): void {
    this.filterStatus = status;
    this.applyFilter();
  }

  setPaymentFilter(payment: string): void {
    this.filterPayment = payment;
    this.applyFilter();
  }

  // ── Order Detail ──────────────────────────────────────────

  openOrder(order: Order): void {
    this.selectedOrder = { ...order };
  }

  closeOrder(): void {
    this.selectedOrder = null;
  }

  viewOrderDetail(order: Order): void {
    this.router.navigate(['/admin/orders', order.id]);
  }

  // ── Payment Actions ───────────────────────────────────────

  promptVerifyPayment(order: Order): void {
    this.confirmDialog = {
      visible: true,
      title:   'Verify Payment',
      message: `Mark payment for ${order.orderNumber} as verified? This will set the order to PAYMENT_CONFIRMED.`,
      action:  'verify',
      order,
    };
  }

  promptRejectPayment(order: Order): void {
    this.confirmDialog = {
      visible: true,
      title:   'Reject Payment',
      message: `Reject payment for ${order.orderNumber}? This cannot be undone. Order will be marked as PAYMENT_FAILED.`,
      action:  'reject',
      order,
    };
  }

  promptUpdateStatus(order: Order, status: OrderStatus): void {
    this.confirmDialog = {
      visible: true,
      title:   'Update Order Status',
      message: `Move order ${order.orderNumber} to "${ORDER_STATUS_LABEL[status]}"?`,
      action:  'status',
      order,
      targetStatus: status,
    };
  }

  confirmDialogAction(): void {
    const { action, order, targetStatus } = this.confirmDialog;
    if (!order) return;
    this.confirmDialog.visible = false;

    if (action === 'verify') {
      this.orderService.verifyPayment(order.id).subscribe(updated => {
        this.refreshOrder(updated);
      });
    } else if (action === 'reject') {
      this.orderService.rejectPayment(order.id).subscribe(updated => {
        this.refreshOrder(updated);
      });
    } else if (action === 'status' && targetStatus) {
      if (targetStatus === 'SHIPPED') {
        // Open shipping modal instead
        this.openShippingModal(order);
      } else {
        this.orderService.updateOrderStatus(order.id, targetStatus).subscribe(updated => {
          this.refreshOrder(updated);
        });
      }
    }
  }

  cancelDialog(): void {
    this.confirmDialog.visible = false;
  }

  // ── Shipping Modal ────────────────────────────────────────

  openShippingModal(order: Order): void {
    this.shippingOrder    = order;
    this.shippingProvider = order.fulfillment?.provider || '';
    this.shippingTracking = order.fulfillment?.trackingNumber || '';
    this.showShippingModal = true;
    this.confirmDialog.visible = false;
  }

  closeShippingModal(): void {
    this.showShippingModal = false;
    this.shippingOrder    = null;
  }

  saveShipping(): void {
    if (!this.shippingOrder || this.shippingSaving) return;
    this.shippingSaving = true;

    this.orderService.updateShippingDetails(
      this.shippingOrder.id,
      this.shippingProvider,
      this.shippingTracking,
    ).subscribe(updated => {
      this.shippingSaving = false;
      this.showShippingModal = false;
      this.refreshOrder(updated);
    });
  }

  // ── Helpers ───────────────────────────────────────────────

  private refreshOrder(updated: Order): void {
    if (!updated || (!updated.id && !(updated as any)._id)) {
      this.loadOrders();
      return;
    }

    const updatedId = updated.id || (updated as any)._id;
    const idx = this.orders.findIndex(o =>
      (o.id && o.id === updatedId) ||
      ((o as any)._id && (o as any)._id === updatedId) ||
      (o.orderNumber && o.orderNumber === updated.orderNumber)
    );

    if (idx !== -1) {
      this.orders[idx] = updated;
    } else {
      this.loadOrders();
      return;
    }

    this.applyFilter();

    if (this.selectedOrder) {
      const selectedId = this.selectedOrder.id || (this.selectedOrder as any)._id;
      if (
        (selectedId && selectedId === updatedId) ||
        (this.selectedOrder.orderNumber && this.selectedOrder.orderNumber === updated.orderNumber)
      ) {
        this.selectedOrder = { ...updated };
      }
    }
  }

  getStatusClass(s: string): string {
    const map: Record<string, string> = {
      ORDER_PLACED:          'badge--amber',
      PAYMENT_VERIFICATION:  'badge--amber',
      PAYMENT_CONFIRMED:     'badge--green',
      PROCESSING:            'badge--blue',
      SHIPPED:               'badge--purple',
      OUT_FOR_DELIVERY:      'badge--purple',
      DELIVERED:             'badge--green',
      PAYMENT_FAILED:        'badge--red',
      CANCELLED:             'badge--red',
    };
    return map[s] ?? 'badge--gray';
  }

  getPaymentClass(s: string): string {
    const map: Record<string, string> = {
      PENDING_VERIFICATION: 'badge--amber',
      PAID:                 'badge--green',
      FAILED:               'badge--red',
      REFUNDED:             'badge--gray',
    };
    return map[s] ?? 'badge--gray';
  }

  changeStatus(order: Order, newStatus: OrderStatus | string): void {
    if (!order || !newStatus || order.status === newStatus) return;
    const target = newStatus as OrderStatus;
    if (target === 'SHIPPED') {
      this.openShippingModal(order);
    } else {
      this.promptUpdateStatus(order, target);
    }
  }

  nextStatus(current: OrderStatus): OrderStatus | null {
    const flow: OrderStatus[] = [
      'PAYMENT_CONFIRMED', 'PROCESSING', 'SHIPPED', 'DELIVERED'
    ];
    const idx = flow.indexOf(current);
    return idx !== -1 && idx < flow.length - 1 ? flow[idx + 1] : null;
  }

  canAdvanceStatus(order: Order): boolean {
    return this.nextStatus(order.status) !== null &&
           order.status !== 'DELIVERED' &&
           order.status !== 'CANCELLED';
  }

  formatDate(d: string | undefined): string {
    if (!d) return 'N/A';
    return new Date(d).toLocaleDateString('en-IN', {
      day: '2-digit', month: 'short', year: 'numeric'
    });
  }

  formatDateTime(d: string | undefined): string {
    if (!d) return 'N/A';
    return new Date(d).toLocaleString('en-IN', {
      day: '2-digit', month: 'short', year: 'numeric',
      hour: '2-digit', minute: '2-digit', hour12: true,
    });
  }

  // ── Stats for header ──────────────────────────────────────

  totalRevenue(): number {
    return this.orders
      .filter(o => o.payment?.status === 'PAID')
      .reduce((s, o) => s + o.total, 0);
  }

  pendingVerificationCount(): number {
    return this.orders.filter(o => o.payment?.status === 'PENDING_VERIFICATION').length;
  }

  countByStatus(status: OrderStatus): number {
    return this.orders.filter(o => o.status === status).length;
  }
}
