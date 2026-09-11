import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Product } from '../../../core/models';
import { CartService } from '../../../core/services/cart.service';
import { ToastService } from '../../../core/services/toast.service';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-product-card',
  standalone: false,
  template: `
    <article class="pcard" [class.pcard--featured]="product.featured" tabindex="0">
      <!-- Visual Banner / Image Area -->
      <div class="pcard__image-wrap">
        <a [routerLink]="['/product', product.slug]" class="pcard__image-link" [attr.aria-label]="product.name">
          <ng-container *ngIf="getImageUrl(product.imageUrl) as formattedUrl; else artBanner">
            <img
              [src]="formattedUrl"
              [alt]="product.name"
              class="pcard__image"
              loading="lazy"
            />
          </ng-container>
          
          <!-- Rich Heritage Spice Art Banner when no image is uploaded -->
          <ng-template #artBanner>
            <div class="pcard__art-banner" [class]="'pcard__art-banner--' + getCategoryClass()">
              <div class="pcard__art-bg"></div>
              <div class="pcard__art-content">
                <span class="pcard__art-icon">{{ getCategoryIcon() }}</span>
                <span class="pcard__art-tamil">{{ getTamilName(product.name) }}</span>
                <span class="pcard__art-brand">ARIDHU FOODS</span>
              </div>
            </div>
          </ng-template>
        </a>

        <!-- Quick View Hover Action -->
        <button class="pcard__quick-badge" type="button" (click)="onQuickView.emit(product)">
          Quick View
        </button>

        <!-- Product Index Badge -->
        <div class="pcard__number" *ngIf="index !== undefined && index !== null">
          #{{ index + 1 }}
        </div>
      </div>

      <!-- Content Area -->
      <div class="pcard__content">
        <!-- Tag Row: Tamil Badge & Category Tag -->
        <div class="pcard__tag-row">
          <span class="pcard__tamil-title">{{ getTamilName(product.name) }}</span>
          <span class="pcard__cat-tag">{{ getCategoryTag() }}</span>
        </div>

        <!-- Product Name -->
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

        <!-- Weight & Batch Meta -->
        <div class="pcard__meta-row">
          <span class="pcard__weight-pill">{{ product.weight }}{{ product.weightUnit }}</span>
          <span class="pcard__batch-tag">Iron-Roasted</span>
        </div>

        <!-- Price & Add to Cart Footer -->
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
    'Ginger Lemon Rasam Powder': 'இஞ்சி எலுமிச்சை ரசம் பொடி',
    'Mor Rasam Powder': 'மோர் ரசம் பொடி',
    'Kandathippili Rasam Powder': 'கண்டதிப்பிலி ரசம் பொடி',
    'Cinnamon Rasam Powder': 'இலவங்கப்பட்டை ரசம் பொடி',
    'Kollu Rasam Powder': 'கொள்ளு ரசம் பொடி',
    'Poricha Rasam Powder': 'பொரிச்ச ரசம் பொடி',
    'Vatha Kuzhambu Powder': 'வத்த குழம்பு பொடி',
    'Ennai Kathirikai Kuzhambu Powder': 'எண்ணெய் கத்திரிக்காய் குழம்பு பொடி',
    'Mor Kuzhambu Powder': 'மோர் குழம்பு பொடி',
    'Talaga Kuzhambu Powder': 'தஞ்சாவூர் தாளக குழம்பு பொடி',
    'Vendaya Vendaikai Kuzhambu Powder': 'வெந்தய வெண்டைக்காய் குழம்பு பொடி',
    'Kootu Kuzhambu Powder': 'கூட்டு குழம்பு பொடி',
    'Narthangai Kuzhambu Powder': 'நார்த்தங்காய் குழம்பு பொடி',
    'Chennai Sambar Powder': 'சென்னை சாம்பார் பொடி',
    'Sambar with Coconut Milk Powder': 'தேங்காய் பால் சாம்பார் பொடி',
    'Idli Dosa Milagai Podi': 'இட்லி தோசை மிளகாய் பொடி',
    'Dal / Paruppu Podi': 'பருப்பு பொடி',
    'Kothamalli Thugayal Podi': 'கொத்தமல்லி துவையல் பொடி',
    'Pudina Thugayal Podi': 'புதினா துவையல் பொடி',
    'Vegetable / Rice Mix Podi': 'காய்கறி / சாத பொடி',
    'Arisi Upma (Tiffin Mix)': 'அரிசி உப்மா (டிபன் மிக்ஸ்)',
    'Arisi Paruppu Sadam (Tiffin Mix)': 'அரிசி பருப்பு சாதம்',
  };

  private aromaProfiles: Record<string, { heat: string; aroma: string }> = {
    'Kalyana Rasam Powder': { heat: '🌶️🌶️ Medium', aroma: 'Tangy & Peppery' },
    'Ginger Lemon Rasam Powder': { heat: '🌶️🌶️ Medium', aroma: 'Zesty Ginger Citrus' },
    'Mor Rasam Powder': { heat: '🌶️ Mild', aroma: 'Cooling Cumin & Curd' },
    'Kandathippili Rasam Powder': { heat: '🌶️🌶️ Medium', aroma: 'Herbal Long Pepper' },
    'Cinnamon Rasam Powder': { heat: '🌶️ Mild', aroma: 'Sweet Cinnamon Spice' },
    'Kollu Rasam Powder': { heat: '🌶️ Mild', aroma: 'Wholesome Horsegram' },
    'Poricha Rasam Powder': { heat: '🌶️ Mild', aroma: 'Gentle Roasted Lentil' },
    'Vatha Kuzhambu Powder': { heat: '🌶️🌶️🌶️ Fiery', aroma: 'Tangy Sundakkai Spice' },
    'Ennai Kathirikai Kuzhambu Powder': { heat: '🌶️🌶️ Medium', aroma: 'Rich Roasted Sesame' },
    'Mor Kuzhambu Powder': { heat: '🌶️ Mild', aroma: 'Creamy Coconut & Cumin' },
    'Talaga Kuzhambu Powder': { heat: '🌶️🌶️ Medium', aroma: 'Tanjore Festival Blend' },
    'Vendaya Vendaikai Kuzhambu Powder': { heat: '🌶️ Mild', aroma: 'Bittersweet Fenugreek' },
    'Kootu Kuzhambu Powder': { heat: '🌶️ Mild', aroma: 'Subtle Cumin & Coconut' },
    'Narthangai Kuzhambu Powder': { heat: '🌶️🌶️ Medium', aroma: 'Sun-Dried Citron Tang' },
    'Chennai Sambar Powder': { heat: '🌶️🌶️ Medium', aroma: 'Madras Home Roasted' },
    'Sambar with Coconut Milk Powder': { heat: '🌶️ Mild', aroma: 'Velvet Coconut Cream' },
    'Idli Dosa Milagai Podi': { heat: '🌶️🌶️🌶️ Fiery', aroma: 'Roasted Sesame & Chilli' },
    'Dal / Paruppu Podi': { heat: '🌶️ Mild', aroma: 'Golden Roasted Dal' },
    'Kothamalli Thugayal Podi': { heat: '🌶️🌶️ Medium', aroma: 'Fresh Coriander Herb' },
    'Pudina Thugayal Podi': { heat: '🌶️🌶️ Medium', aroma: 'Zesty Mint Leaf' },
    'Vegetable / Rice Mix Podi': { heat: '🌶️ Mild', aroma: 'Aromatic Stir-Fry Blend' },
    'Arisi Upma (Tiffin Mix)': { heat: '🌶️ Mild', aroma: 'Pepper Broken Rice' },
    'Arisi Paruppu Sadam (Tiffin Mix)': { heat: '🌶️ Mild', aroma: 'Kongu Rice & Lentil' },
  };

  constructor(
    private cartService: CartService,
    private toastService: ToastService,
  ) {}

  getImageUrl(url: string | null | undefined): string | null {
    if (!url || !url.trim()) return null;
    if (url.startsWith('/')) {
      const base = environment.apiUrl.replace(/\/api\/?$/, '');
      return `${base}${url}`;
    }
    return url;
  }

  getTamilName(name: string): string {
    return this.tamilNames[name] || 'அரிதுபாரம்பரிய பொடி';
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
    if (this.product.categoryId === 'cat-sambar') return 'sambar';
    if (this.product.categoryId === 'cat-tiffin') return 'tiffin';
    return 'powders';
  }

  getCategoryClass(): string {
    if (!this.product) return 'default';
    if (this.product.categoryId === 'cat-rasam') return 'rasam';
    if (this.product.categoryId === 'cat-kozhambu') return 'kozhambu';
    if (this.product.categoryId === 'cat-sambar') return 'sambar';
    if (this.product.categoryId === 'cat-tiffin') return 'tiffin';
    return 'default';
  }

  getCategoryIcon(): string {
    if (!this.product) return '🌶️';
    if (this.product.categoryId === 'cat-rasam') return '🥣';
    if (this.product.categoryId === 'cat-kozhambu') return '🍲';
    if (this.product.categoryId === 'cat-sambar') return '🥘';
    if (this.product.categoryId === 'cat-tiffin') return '🥞';
    return '🌶️';
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
