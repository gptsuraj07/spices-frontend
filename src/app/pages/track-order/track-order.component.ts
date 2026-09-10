// ============================================================
// ARIDHU — Track Order Page
// ============================================================

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormControl, Validators } from '@angular/forms';
import { OrderService } from '../../core/services/order.service';
import {
  Order, OrderStatus, StatusHistoryEntry,
  ORDER_STATUS_LABEL, ORDER_STATUS_MESSAGE, ORDER_TIMELINE_STEPS
} from '../../core/models';

@Component({
  selector: 'app-track-order',
  standalone: false,
  templateUrl: './track-order.component.html',
  styleUrls: ['./track-order.component.scss'],
})
export class TrackOrderComponent implements OnInit {
  orderNumberCtrl = new FormControl('', [Validators.required, Validators.minLength(3)]);

  order: Order | null = null;
  loading = false;
  notFound = false;
  searched = false;

  // UTR submission
  utrCtrl = new FormControl('');
  utrSubmitting = false;
  utrSaved = false;

  // Expose constants to template
  readonly STATUS_LABEL   = ORDER_STATUS_LABEL;
  readonly STATUS_MESSAGE = ORDER_STATUS_MESSAGE;
  readonly TIMELINE_STEPS = ORDER_TIMELINE_STEPS;

  constructor(
    private orderService: OrderService,
    private route: ActivatedRoute,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      const orderNum = params['order'];
      if (orderNum) {
        this.orderNumberCtrl.setValue(orderNum);
        this.search();
      }
    });
  }

  search(): void {
    if (!this.orderNumberCtrl.value?.trim()) return;
    this.loading   = true;
    this.notFound  = false;
    this.searched  = true;
    this.order     = null;
    this.utrSaved  = false;

    const num = this.orderNumberCtrl.value.trim().toUpperCase();
    this.router.navigate([], {
      queryParams: { order: num },
      replaceUrl: true,
    });

    this.orderService.getOrderByNumber(num).subscribe(order => {
      this.loading  = false;
      this.order    = order;
      this.notFound = !order;

      if (order?.payment?.utrNumber) {
        this.utrCtrl.setValue(order.payment.utrNumber);
      }
    });
  }

  submitUtr(): void {
    const utr = this.utrCtrl.value?.trim();
    if (!utr || !this.order) return;
    this.utrSubmitting = true;
    this.orderService.submitUtrNumber(this.order.id, utr).subscribe(() => {
      this.utrSubmitting = false;
      this.utrSaved      = true;
    });
  }

  // ── Timeline helpers ───────────────────────────────────────

  /** Returns 'done' | 'current' | 'upcoming' | 'failed' for a timeline step */
  getStepState(step: OrderStatus): 'done' | 'current' | 'upcoming' | 'failed' {
    if (!this.order) return 'upcoming';
    const status = this.order.status;

    if (status === 'PAYMENT_FAILED' || status === 'CANCELLED') {
      return step === 'ORDER_PLACED' ? 'done' : 'failed';
    }

    const timelineIdx = this.TIMELINE_STEPS.indexOf(step);
    const currentIdx  = this.TIMELINE_STEPS.indexOf(status);

    if (currentIdx < 0) {
      // Current status not in main timeline (e.g. PAYMENT_VERIFICATION)
      return step === 'ORDER_PLACED' ? 'current' : 'upcoming';
    }

    if (timelineIdx < currentIdx)  return 'done';
    if (timelineIdx === currentIdx) return 'current';
    return 'upcoming';
  }

  /** Most recent history entry for a step */
  getHistoryEntry(step: OrderStatus): StatusHistoryEntry | undefined {
    if (!this.order?.statusHistory) return undefined;
    return [...this.order.statusHistory]
      .reverse()
      .find(h => h.status === step);
  }

  isPaymentPending(): boolean {
    return this.order?.payment?.status === 'PENDING_VERIFICATION';
  }

  isTerminalFailed(): boolean {
    return this.order?.status === 'PAYMENT_FAILED' || this.order?.status === 'CANCELLED';
  }

  formatDate(iso: string | undefined): string {
    if (!iso) return '';
    return new Date(iso).toLocaleDateString('en-IN', {
      day: '2-digit', month: 'short', year: 'numeric',
      hour: '2-digit', minute: '2-digit', hour12: true
    });
  }

  formatShortDate(iso: string | undefined): string {
    if (!iso) return '';
    return new Date(iso).toLocaleDateString('en-IN', {
      day: '2-digit', month: 'short', year: 'numeric',
    });
  }

  trackByStatus(_: number, step: OrderStatus): string { return step; }
}
