// ============================================================
// ARIDHU — Search Service
// ============================================================

import { Injectable } from '@angular/core';
import { Observable, combineLatest, of } from 'rxjs';
import { map, debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { SearchResult } from '../models';
import { ProductService } from './product.service';
import { ComboService } from './combo.service';
import { CategoryService } from './category.service';

@Injectable({ providedIn: 'root' })
export class SearchService {
  constructor(
    private productService: ProductService,
    private comboService: ComboService,
    private categoryService: CategoryService,
  ) {}

  search(query: string): Observable<SearchResult[]> {
    if (!query.trim()) return of([]);

    const q = query.toLowerCase().trim();

    return combineLatest([
      this.productService.search(q),
      this.comboService.getActive(),
      this.categoryService.getActive(),
    ]).pipe(
      map(([products, combos, categories]) => {
        const results: SearchResult[] = [];

        // Products
        products.forEach(p => {
          results.push({
            id: p.id,
            type: 'product',
            name: p.name,
            slug: p.slug,
            imageUrl: p.imageUrl,
            price: p.price,
            categoryName: undefined,
          });
        });

        // Combos
        combos
          .filter(c => c.name.toLowerCase().includes(q) || c.tags.some(t => t.includes(q)))
          .forEach(c => {
            results.push({
              id: c.id,
              type: 'combo',
              name: c.name,
              slug: c.slug,
              imageUrl: c.imageUrl,
              price: c.price,
            });
          });

        // Categories
        categories
          .filter(cat => cat.name.toLowerCase().includes(q))
          .forEach(cat => {
            results.push({
              id: cat.id,
              type: 'category',
              name: cat.name,
              slug: cat.slug,
              imageUrl: cat.imageUrl,
            });
          });

        return results;
      })
    );
  }
}
