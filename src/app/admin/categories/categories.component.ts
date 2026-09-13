import { Component, OnInit } from '@angular/core';
import { Category } from '../../core/models';
import { CategoryService } from '../../core/services/category.service';

@Component({
  selector: 'app-admin-categories',
  standalone: false,
  template: `
    <div class="ap-page">
      <div class="ap-header">
        <div>
          <h1 class="adash__title">Categories</h1>
          <p class="adash__subtitle">Manage your product categories.</p>
        </div>
      </div>

      <div class="adm-card">
        <!-- Desktop Table View -->
        <div class="adm-table-wrap adm-table-wrap--desktop">
          <table class="adm-table">
            <thead>
              <tr>
                <th>Category Name</th>
                <th>Slug</th>
                <th>Product Count</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let c of categories">
                <td style="font-weight: 600; color: #2A160C;">{{ c.name }}</td>
                <td style="color: #786A5E;">{{ c.slug }}</td>
                <td style="font-weight: 600;">{{ c.productCount || 0 }} products</td>
                <td><span class="adm-badge badge--green">Active</span></td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Mobile Cards List View (< 768px) -->
        <div class="ap-mobile-cards-list">
          <div class="ap-mobile-card" *ngFor="let c of categories">
            <div class="ap-mobile-card__header">
              <div>
                <div class="ap-name">{{ c.name }}</div>
                <div class="ap-meta">slug: {{ c.slug }}</div>
              </div>
              <span class="adm-badge badge--green">Active</span>
            </div>
            <div class="ap-mobile-card__footer">
              <span class="ap-meta" style="font-weight: 600; font-size: 0.85rem; color: #2A160C;">
                📦 {{ c.productCount || 0 }} Products
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styleUrls: ['../products/products.component.scss']
})
export class AdminCategoriesComponent implements OnInit {
  categories: Category[] = [];

  constructor(private categoryService: CategoryService) {}

  ngOnInit(): void {
    this.categoryService.getAll().subscribe(res => {
      this.categories = res;
    });
  }
}
