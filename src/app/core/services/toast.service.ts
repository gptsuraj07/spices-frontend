// ============================================================
// ARIDHU — Toast Notification Service
// ============================================================

import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Toast, ToastType } from '../models';

@Injectable({ providedIn: 'root' })
export class ToastService {
  private toasts$$ = new BehaviorSubject<Toast[]>([]);
  toasts$: Observable<Toast[]> = this.toasts$$.asObservable();

  show(message: string, type: ToastType = 'success', duration = 3500): void {
    const toast: Toast = {
      id: `toast-${Date.now()}`,
      type,
      message,
      duration,
    };
    this.toasts$$.next([...this.toasts$$.value, toast]);
    setTimeout(() => this.dismiss(toast.id), duration);
  }

  success(message: string) { this.show(message, 'success'); }
  error(message: string)   { this.show(message, 'error', 5000); }
  warning(message: string) { this.show(message, 'warning'); }
  info(message: string)    { this.show(message, 'info'); }

  dismiss(id: string): void {
    this.toasts$$.next(this.toasts$$.value.filter(t => t.id !== id));
  }

  dismissAll(): void {
    this.toasts$$.next([]);
  }
}
