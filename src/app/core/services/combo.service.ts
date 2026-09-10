// ============================================================
// ARIDHU — Combo Service (Connected to Backend API)
// ============================================================

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Combo, ComboProduct, Product } from '../models';
import { COMBOS } from '../data/combos.mock';
import { ProductService } from './product.service';
import { environment } from '../../../environments/environment';

export interface ComboWithProducts extends Combo {
  resolvedProducts: Array<ComboProduct & { product: Product }>;
  individualTotal: number;
  savings: number;
}

@Injectable({ providedIn: 'root' })
export class ComboService {
  private apiUrl = `${environment.apiUrl}/combos`;

  constructor(
    private http: HttpClient,
    private productService: ProductService
  ) {}

  getAll(): Observable<Combo[]> {
    return this.http.get<Combo[]>(this.apiUrl).pipe(
      catchError(() => of([...COMBOS]))
    );
  }

  getFeatured(): Observable<Combo[]> {
    return this.getAll();
  }

  getActive(): Observable<Combo[]> {
    return this.getAll();
  }

  getBySlug(slug: string): Observable<Combo | null> {
    return this.http.get<Combo>(`${this.apiUrl}/${slug}`).pipe(
      catchError(() => of(COMBOS.find(c => c.slug === slug) ?? null))
    );
  }

  getById(id: string): Observable<Combo | null> {
    return this.getAll().pipe(
      map(combos => combos.find(c => c.id === id || (c as any)._id === id) ?? null)
    );
  }

  getBySlugWithProducts(slug: string): Observable<ComboWithProducts | null> {
    return this.getBySlug(slug).pipe(
      map(combo => {
        if (!combo) return null;
        const comboItems = (combo as any).items || (combo as any).comboProducts || [];
        const resolvedProducts = comboItems.map((item: any, idx: number) => ({
          comboId: combo.id,
          productId: item.productId,
          quantity: 1,
          displayOrder: idx + 1,
          product: {
            id: item.productId,
            name: item.name,
            slug: item.productSlug || 'kalyana-rasam-powder',
            price: 100,
            weight: item.weight || 100,
            unit: item.unit || 'g',
            categoryId: 'cat-rasam',
            categorySlug: 'rasam',
            tags: [],
            featured: false,
            status: 'active',
            imageUrl: item.imageUrl || 'assets/images/kalyana-rasam.png',
            shortDescription: '',
            description: '',
            usage: '',
            storage: '',
            createdAt: '',
            updatedAt: '',
          } as any,
        }));

        const individualTotal = resolvedProducts.length * 100;
        const savings = individualTotal - combo.price;

        return {
          ...combo,
          resolvedProducts,
          individualTotal,
          savings,
        };
      })
    );
  }
}
