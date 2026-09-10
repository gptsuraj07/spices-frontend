import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Product } from '../../core/models';
import { ProductService } from '../../core/services/product.service';

@Component({
  selector: 'app-search',
  standalone: false,
  template: `
    <div class="search-page page-enter container" style="padding: 3rem 1rem;">
      <app-breadcrumb [items]="[{label: 'Search Results'}]"></app-breadcrumb>
      <h1 style="font-family: var(--font-display); font-size: 2rem; margin-bottom: 1.5rem; color: #1E3A8A;">
        Search Results for "{{ query }}"
      </h1>
      <div *ngIf="products.length > 0; else noResults" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(260px, 1fr)); gap: 1.5rem;">
        <app-product-card *ngFor="let p of products" [product]="p"></app-product-card>
      </div>
      <ng-template #noResults>
        <div style="text-align: center; padding: 4rem 1rem;">
          <p style="font-size: 1.25rem; color: #6B7280; margin-bottom: 1rem;">No products found matching your search.</p>
          <a routerLink="/shop" class="btn btn--primary" style="display: inline-block; padding: 0.75rem 1.5rem; background: #1E3A8A; color: white; border-radius: 0.5rem; text-decoration: none;">Browse All Products</a>
        </div>
      </ng-template>
    </div>
  `
})
export class SearchComponent implements OnInit {
  query = '';
  products: Product[] = [];

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.query = params['q'] || '';
      if (this.query) {
        this.productService.searchProducts(this.query).subscribe((res: Product[]) => {
          this.products = res;
        });
      } else {
        this.products = [];
      }
    });
  }
}
