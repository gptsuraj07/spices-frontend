import { Component, Input } from '@angular/core';
import { Combo } from '../../../core/models';
import { CartService } from '../../../core/services/cart.service';
import { ToastService } from '../../../core/services/toast.service';

@Component({
  selector: 'app-combo-card',
  standalone: false,
  template: `
    <article class="combo-card">
      <!-- Image -->
      <div class="combo-card__image">
        <a [routerLink]="['/combo', combo.slug]" [attr.aria-label]="combo.name">
          <ng-container *ngIf="combo.imageUrl; else placeholder">
            <img [src]="combo.imageUrl" [alt]="combo.name" class="combo-card__img" loading="lazy"/>
          </ng-container>
          <ng-template #placeholder>
            <app-image-placeholder variant="combo" aspect="4/3"></app-image-placeholder>
          </ng-template>
        </a>
        <!-- Badge -->
        <div class="combo-card__badge-overlay" *ngIf="combo.badge">
          <app-badge [badge]="combo.badge"></app-badge>
        </div>
        <!-- Variety count -->
        <div class="combo-card__count-pill">
          {{ combo.comboProducts.length }} varieties
        </div>
      </div>

      <!-- Content -->
      <div class="combo-card__content">
        <p class="combo-card__label">Collection</p>
        <h3 class="combo-card__name">
          <a [routerLink]="['/combo', combo.slug]">{{ combo.name }}</a>
        </h3>
        <p class="combo-card__desc">{{ combo.shortDescription }}</p>

        <div class="combo-card__footer">
          <app-price [price]="combo.price" [compareAtPrice]="combo.compareAtPrice" size="base"></app-price>
          <div class="combo-card__actions">
            <a [routerLink]="['/combo', combo.slug]" class="btn btn-outline btn-sm">Explore</a>
            <button class="btn btn-primary btn-sm" type="button" (click)="addToCart()">
              Add to Cart
            </button>
          </div>
        </div>
      </div>
    </article>
  `,
  styleUrls: ['./combo-card.component.scss'],
})
export class ComboCardComponent {
  @Input() combo!: Combo;

  constructor(
    private cartService: CartService,
    private toastService: ToastService,
  ) {}

  addToCart(): void {
    this.cartService.addItem({
      itemId: this.combo.id,
      itemType: 'combo',
      name: this.combo.name,
      slug: this.combo.slug,
      imageUrl: this.combo.imageUrl,
      price: this.combo.price,
      quantity: 1,
      weight: null,
      categoryId: null,
    });
    this.toastService.success(`${this.combo.name} added to cart`);
  }
}
