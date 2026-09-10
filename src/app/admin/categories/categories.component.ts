import { Component, OnInit } from '@angular/core';
import { Category } from '../../core/models';
import { CategoryService } from '../../core/services/category.service';

@Component({
  selector: 'app-admin-categories',
  standalone: false,
  template: `
    <div class="admin-categories">
      <h1 style="font-size: 1.875rem; font-weight: 700; color: #111827; margin-bottom: 1.5rem;">Categories</h1>
      <div style="background: white; border-radius: 0.75rem; border: 1px solid #E5E7EB; overflow: hidden;">
        <table style="width: 100%; border-collapse: collapse; text-align: left;">
          <thead style="background: #F9FAFB; border-bottom: 1px solid #E5E7EB;">
            <tr>
              <th style="padding: 0.75rem 1rem; font-size: 0.875rem; color: #4B5563;">Category Name</th>
              <th style="padding: 0.75rem 1rem; font-size: 0.875rem; color: #4B5563;">Slug</th>
              <th style="padding: 0.75rem 1rem; font-size: 0.875rem; color: #4B5563;">Product Count</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let c of categories" style="border-bottom: 1px solid #F3F4F6;">
              <td style="padding: 1rem; font-weight: 600;">{{ c.name }}</td>
              <td style="padding: 1rem; color: #6B7280;">{{ c.slug }}</td>
              <td style="padding: 1rem; font-weight: 600;">{{ c.productCount }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  `
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
