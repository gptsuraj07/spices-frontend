import { Component, Input } from '@angular/core';
import { Category } from '../../../core/models';

@Component({
  selector: 'app-category-card',
  standalone: false,
  template: `
    <a
      class="cat-card"
      [routerLink]="['/category', category.slug]"
      [attr.aria-label]="'Browse ' + category.name + ' collection'"
    >
      <!-- Image area -->
      <div class="cat-card__image">
        <ng-container *ngIf="category.imageUrl; else placeholder">
          <img
            [src]="category.imageUrl"
            [alt]="category.name"
            class="cat-card__img"
            loading="lazy"
          />
        </ng-container>
        <ng-template #placeholder>
          <app-image-placeholder variant="category" aspect="4/3"></app-image-placeholder>
        </ng-template>

        <div class="cat-card__badge-overlay">
          <span class="cat-card__count" *ngIf="category.productCount">
            {{ category.productCount }} varieties
          </span>
        </div>
      </div>

      <!-- Content -->
      <div class="cat-card__content">
        <h3 class="cat-card__name">{{ category.name }}</h3>
        <p class="cat-card__desc">{{ category.shortDescription }}</p>
        <div class="cat-card__cta">
          <span class="cat-card__cta-text">Explore Collection</span>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12,5 19,12 12,19"/>
          </svg>
        </div>
      </div>
    </a>
  `,
  styleUrls: ['./category-card.component.scss'],
})
export class CategoryCardComponent {
  @Input() category!: Category;
}
