import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-price',
  standalone: false,
  template: `
    <div class="price-block" [class.price-block--large]="size === 'large'" [class.price-block--small]="size === 'small'">
      <span class="price-block__current" [attr.aria-label]="'Price: ₹' + price">
        ₹{{ price | number:'1.0-0' }}
      </span>
      <ng-container *ngIf="compareAtPrice && compareAtPrice > price">
        <span class="price-block__compare" aria-label="Original price: ₹{{ compareAtPrice }}">
          ₹{{ compareAtPrice | number:'1.0-0' }}
        </span>
        <span class="price-block__discount" aria-label="{{ discountPercent }}% off">
          {{ discountPercent }}% off
        </span>
      </ng-container>
      <span *ngIf="weight" class="price-block__weight">
        / {{ weight }}{{ weightUnit }}
      </span>
    </div>
  `,
  styleUrls: ['./price.component.scss'],
})
export class PriceComponent {
  @Input() price: number = 0;
  @Input() compareAtPrice: number | null = null;
  @Input() weight: number | null = null;
  @Input() weightUnit: string = 'g';
  @Input() size: 'small' | 'base' | 'large' = 'base';

  get discountPercent(): number {
    if (!this.compareAtPrice || this.compareAtPrice <= this.price) return 0;
    return Math.round(((this.compareAtPrice - this.price) / this.compareAtPrice) * 100);
  }
}
