import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Product } from '../../../core/models';
import { CartService } from '../../../core/services/cart.service';
import { ToastService } from '../../../core/services/toast.service';

@Component({
  selector: 'app-product-card',
  standalone: false,
  template: `
    <article class="pcard" [class.pcard--featured]="product.featured" tabindex="0">
      <!-- Image Area -->
      <div class="pcard__image-wrap">
        <a [routerLink]="['/product', product.slug]" class="pcard__image-link" [attr.aria-label]="product.name">
          <ng-container *ngIf="getImageUrl(product.imageUrl) as formattedUrl; else placeholder">
            <img
              [src]="formattedUrl"
              [alt]="product.name"
              class="pcard__image"
              loading="lazy"
            />
          </ng-container>
          <ng-template #placeholder>
            <app-image-placeholder variant="product" aspect="1/1"></app-image-placeholder>
          </ng-template>
        </a>

        <!-- Quick view action -->
        <button class="pcard__quick-badge" type="button" (click)="onQuickView.emit(product)">
          Quick View
        </button>

        <!-- Product Numbering Badge (e.g. 01) -->
        <div class="pcard__number" *ngIf="index !== undefined && index !== null">
          <span>0{{ index + 1 }}</span>
        </div>
      </div>

      <!-- Content Area -->
      <div class="pcard__content">
        <!-- Tamil Badge & Category Tag -->
        <div class="pcard__tag-row">
          <span class="pcard__tamil-title">{{ getTamilName(product.name) }}</span>
          <span class="pcard__cat-tag">{{ getCategoryTag() }}</span>
        </div>

        <!-- Name -->
        <h3 class="pcard__name">
          <a [routerLink]="['/product', product.slug]" class="pcard__name-link">
            {{ product.name }}
          </a>
        </h3>

        <!-- Short Description / Aroma & Heat -->
        <div class="pcard__aroma-row">
          <span class="pcard__aroma-tag">🌿 {{ getAromaProfile() }}</span>
          <span class="pcard__heat-tag">{{ getSpiceHeat() }}</span>
        </div>

        <!-- Weight Badge Pill -->
        <div class="pcard__meta-row">
          <span class="pcard__weight-pill">{{ product.weight }}{{ product.weightUnit }}</span>
          <span class="pcard__batch-tag">Small Batch</span>
        </div>

        <!-- Price + Action Footer -->
        <div class="pcard__footer">
          <div class="pcard__price-box">
            <span class="pcard__price-label">Price</span>
            <span class="pcard__price">₹{{ product.price }}</span>
          </div>

          <button
            class="pcard__add-btn"
            type="button"
            [class.pcard__add-btn--adding]="adding"
            [disabled]="product.status === 'out_of_stock' || product.stock === 0"
            (click)="addToCart()"
            [attr.aria-label]="'Add ' + product.name + ' to cart'"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/>
              <path d="M16 10a4 4 0 0 1-8 0"/>
            </svg>
            <span *ngIf="!adding">Add</span>
            <span *ngIf="adding">...</span>
          </button>
        </div>

        <!-- Out of stock -->
        <div class="pcard__oos" *ngIf="product.status === 'out_of_stock' || product.stock === 0">
          Out of stock
        </div>
      </div>
    </article>
  `,
  styleUrls: ['./product-card.component.scss'],
})
export class ProductCardComponent {
  @Input() product!: Product;
  @Input() index?: number;
  @Input() showCategory = true;
  @Output() onQuickView = new EventEmitter<Product>();

  adding = false;

  private tamilNames: Record<string, string> = {
    'Kalyana Rasam Powder': 'கல்யாண ரசம் பொடி',
    'Milagu Rasam Powder': 'தாளித்த மிளகு ரசம் பொடி',
    'Kandathippili Rasam Powder': 'கண்டதிப்பிலி ரசம் பொடி',
    'Kollu Rasam Powder': 'கொள்ளு ரசம் பொடி',
    'Cinnamon Rasam Powder': 'இலவங்கப்பட்டை ரசம் பொடி',
    'Poricha Rasam Powder': 'பொரிச்ச ரசம் பொடி',
    'Ginger Lemon Rasam Powder': 'இஞ்சி எலுமிச்சை ரசம் பொடி',
    'Vatha Kuzhambu Powder': 'வத்த குழம்பு பொடி',
    'Ennai Kathirikai Kuzhambu Powder': 'எண்ணெய் கத்திரிக்காய் குழம்பு பொடி',
    'Mor Kuzhambu Powder': 'மோர் குழம்பு பொடி',
    'Talaga Kuzhambu Powder': 'தஞ்சாவூர் தாளக குழம்பு பொடி',
    'Vendaya Vendaikai Kuzhambu Powder': 'வெந்தய வெண்டைக்காய் பொடி',
    'Kootu Kuzhambu Powder': 'கூட்டு குழம்பு பொடி',
    'Narthangai Kuzhambu Powder': 'நார்த்தங்காய் குழம்பு பொடி',
    'Sambar Powder': 'அரிது சாம்பார் பொடி',
    'Idli / Dosa Chilli Powder': 'இட்லி / தோசை மிளகாய் பொடி',
  };

  constructor(
    private cartService: CartService,
    private toastService: ToastService,
  ) {}

  private aromaProfiles: Record<string, { heat: string; aroma: string }> = {
    'Kalyana Rasam Powder': { heat: '🌶️🌶️ Medium', aroma: 'Tangy & Peppery' },
    'Milagu Rasam Powder': { heat: '🌶️🌶️🌶️ Fiery', aroma: 'Black Pepper Warmth' },
    'Kandathippili Rasam Powder': { heat: '🌶️🌶️ Medium', aroma: 'Herbal & Earthy' },
    'Kollu Rasam Powder': { heat: '🌶️ Mild', aroma: 'Wholesome Horsegram' },
    'Cinnamon Rasam Powder': { heat: '🌶️ Mild', aroma: 'Sweet Cinnamon Spice' },
    'Poricha Rasam Powder': { heat: '🌶️ Mild', aroma: 'Gentle Roasted Lentil' },
    'Ginger Lemon Rasam Powder': { heat: '🌶️🌶️ Medium', aroma: 'Zesty Ginger Citrus' },
    'Vatha Kuzhambu Powder': { heat: '🌶️🌶️🌶️ Fiery', aroma: 'Tangy Sundakkai Spice' },
    'Ennai Kathirikai Kuzhambu Powder': { heat: '🌶️🌶️ Medium', aroma: 'Rich Roasted Sesame' },
    'Mor Kuzhambu Powder': { heat: '🌶️ Mild', aroma: 'Creamy Coconut & Cumin' },
    'Talaga Kuzhambu Powder': { heat: '🌶️🌶️ Medium', aroma: 'Tanjore Festival Blend' },
    'Vendaya Vendaikai Kuzhambu Powder': { heat: '🌶️ Mild', aroma: 'Bittersweet Fenugreek' },
    'Kootu Kuzhambu Powder': { heat: '🌶️ Mild', aroma: 'Subtle Cumin & Coconut' },
    'Narthangai Kuzhambu Powder': { heat: '🌶️🌶️ Medium', aroma: 'Sun-Dried Citron Tang' },
  };

  getImageUrl(url: string | null | undefined): string | null {
    if (!url || !url.trim()) return null;
    if (url.startsWith('/')) {
      return `http://localhost:5000${url}`;
    }
    return url;
  }

  getTamilName(name: string): string {
    return this.tamilNames[name] || 'அரிது பாரம்பரிய பொடி';
  }

  getSpiceHeat(): string {
    return this.aromaProfiles[this.product?.name]?.heat || '🌶️🌶️ Medium';
  }

  getAromaProfile(): string {
    return this.aromaProfiles[this.product?.name]?.aroma || 'Hand-Roasted Aroma';
  }

  getCategoryTag(): string {
    if (!this.product) return 'powders';
    if (this.product.categoryId === 'cat-rasam') return 'rasam';
    if (this.product.categoryId === 'cat-kozhambu') return 'kozhambu';
    return 'powders';
  }

  addToCart(): void {
    if (this.adding) return;
    this.adding = true;
    this.cartService.addItem({
      itemId: this.product.id,
      itemType: 'product',
      name: this.product.name,
      slug: this.product.slug,
      imageUrl: this.product.imageUrl,
      price: this.product.price,
      quantity: 1,
      weight: this.product.weight,
      categoryId: this.product.categoryId,
    });
    this.toastService.success(`${this.product.name} added to cart`);
    setTimeout(() => { this.adding = false; }, 600);
  }
}
