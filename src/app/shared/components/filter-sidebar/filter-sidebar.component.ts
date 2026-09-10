import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Category, ProductFilter } from '../../../core/models';

@Component({
  selector: 'app-filter-sidebar',
  standalone: false,
  template: `
    <aside class="filter-sidebar" [class.filter-sidebar--open]="isOpen" role="complementary" aria-label="Product filters">
      <div class="filter-sidebar__header">
        <h2 class="filter-sidebar__title">Filters</h2>
        <button class="filter-sidebar__close" type="button" (click)="close.emit()" aria-label="Close filters">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        </button>
      </div>

      <form [formGroup]="filterForm" (ngChange)="onFilterChange()">

        <!-- Category -->
        <div class="filter-sidebar__section">
          <h3 class="filter-sidebar__section-title">Category</h3>
          <ul class="filter-sidebar__options">
            <li>
              <label class="filter-sidebar__option">
                <input type="radio" formControlName="categoryId" value="" (change)="onFilterChange()"/>
                <span class="filter-sidebar__option-label">All Categories</span>
              </label>
            </li>
            <li *ngFor="let cat of categories">
              <label class="filter-sidebar__option">
                <input type="radio" formControlName="categoryId" [value]="cat.id" (change)="onFilterChange()"/>
                <span class="filter-sidebar__option-label">{{ cat.name }}</span>
                <span class="filter-sidebar__option-count">{{ cat.productCount }}</span>
              </label>
            </li>
          </ul>
        </div>

        <!-- Price -->
        <div class="filter-sidebar__section">
          <h3 class="filter-sidebar__section-title">Price Range</h3>
          <div class="filter-sidebar__price-range">
            <div class="filter-sidebar__price-inputs">
              <div class="filter-sidebar__price-field">
                <span class="filter-sidebar__price-symbol">₹</span>
                <input type="number" formControlName="minPrice" placeholder="Min" (change)="onFilterChange()" class="filter-sidebar__price-input"/>
              </div>
              <span class="filter-sidebar__price-sep">—</span>
              <div class="filter-sidebar__price-field">
                <span class="filter-sidebar__price-symbol">₹</span>
                <input type="number" formControlName="maxPrice" placeholder="Max" (change)="onFilterChange()" class="filter-sidebar__price-input"/>
              </div>
            </div>
          </div>
        </div>

        <!-- Availability -->
        <div class="filter-sidebar__section">
          <h3 class="filter-sidebar__section-title">Availability</h3>
          <label class="filter-sidebar__option">
            <input type="checkbox" formControlName="inStockOnly" (change)="onFilterChange()"/>
            <span class="filter-sidebar__option-label">In Stock Only</span>
          </label>
        </div>

        <!-- Clear all -->
        <button type="button" class="filter-sidebar__clear btn btn-ghost" (click)="clearFilters()">
          Clear All Filters
        </button>
      </form>
    </aside>
  `,
  styleUrls: ['./filter-sidebar.component.scss'],
})
export class FilterSidebarComponent implements OnInit {
  @Input() categories: Category[] = [];
  @Input() isOpen = false;
  @Output() filterChange = new EventEmitter<ProductFilter>();
  @Output() close = new EventEmitter<void>();

  @Input() currentFilter: ProductFilter = {};

  filterForm!: FormGroup;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.filterForm = this.fb.group({
      categoryId: [this.currentFilter.categoryId || ''],
      minPrice: [this.currentFilter.minPrice || null],
      maxPrice: [this.currentFilter.maxPrice || null],
      inStockOnly: [false],
    });
  }

  ngOnChanges(): void {
    if (this.filterForm) {
      this.filterForm.patchValue({
        categoryId: this.currentFilter?.categoryId || '',
        minPrice: this.currentFilter?.minPrice || null,
        maxPrice: this.currentFilter?.maxPrice || null,
      }, { emitEvent: false });
    }
  }

  onFilterChange(): void {
    const v = this.filterForm.value;
    const filter: ProductFilter = {};
    if (v.categoryId) filter.categoryId = v.categoryId;
    if (v.minPrice) filter.minPrice = +v.minPrice;
    if (v.maxPrice) filter.maxPrice = +v.maxPrice;
    if (v.inStockOnly) filter.status = 'active';
    this.filterChange.emit(filter);
  }

  clearFilters(): void {
    this.filterForm.reset({ categoryId: '', minPrice: null, maxPrice: null, inStockOnly: false });
    this.filterChange.emit({});
  }
}
