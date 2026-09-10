import { Component, Input } from '@angular/core';
import { ProductBadge } from '../../../core/models';

@Component({
  selector: 'app-badge',
  standalone: false,
  template: `
    <span *ngIf="badge" class="badge-pill" [class]="'badge-pill--' + badge" [attr.aria-label]="badgeLabel">
      {{ badgeText }}
    </span>
  `,
  styleUrls: ['./badge.component.scss'],
})
export class BadgeComponent {
  @Input() badge: ProductBadge = null;

  get badgeText(): string {
    const labels: Record<string, string> = {
      popular: 'Popular',
      new: 'New',
      best_seller: 'Best Seller',
      limited: 'Limited',
    };
    return this.badge ? labels[this.badge] ?? '' : '';
  }

  get badgeLabel(): string {
    return `Badge: ${this.badgeText}`;
  }
}
