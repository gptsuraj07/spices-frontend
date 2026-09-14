// ============================================================
// ARIDHU — Combo Service (Connected to Backend API)
// ============================================================

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Combo, ComboProduct, Product } from '../models';
import { COMBOS } from '../data/combos.mock';
import { KOZHAMBU_PRODUCTS, RASAM_PRODUCTS, ALL_PRODUCTS } from '../data/products.mock';
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

  private normalizeCombo(combo: Combo): Combo {
    const isRasam = combo.slug.includes('rasam') || combo.name.toLowerCase().includes('rasam');
    const isKozhambu = combo.slug.includes('kozhambu') || combo.slug.includes('kuzhambu') || combo.name.toLowerCase().includes('kozhambu');

    const heroImage: string = isRasam
      ? '/assets/aridhu-rasam-hero.jpg'
      : (isKozhambu ? '/assets/aridhu-kuzhambu-hero.jpg' : (combo.imageUrl || '/assets/aridhu-rasam-hero.jpg'));

    return {
      ...combo,
      price: 350,
      compareAtPrice: null,
      imageUrl: heroImage,
      gallery: [heroImage],
    };
  }

  getAll(): Observable<Combo[]> {
    return this.http.get<Combo[]>(this.apiUrl).pipe(
      map(combos => combos.map(c => this.normalizeCombo(c))),
      catchError(() => of(COMBOS.map(c => this.normalizeCombo(c))))
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
      map(c => c ? this.normalizeCombo(c) : null),
      catchError(() => {
        const found = COMBOS.find(c => c.slug === slug);
        return of(found ? this.normalizeCombo(found) : null);
      })
    );
  }

  getById(id: string): Observable<Combo | null> {
    return this.getAll().pipe(
      map(combos => combos.find(c => c.id === id || (c as any)._id === id) ?? null)
    );
  }

  getBySlugWithProducts(slug: string): Observable<ComboWithProducts | null> {
    return this.getBySlug(slug).pipe(
      map((combo: Combo | null) => {
        if (!combo) return null;

        const isRasam = combo.slug.includes('rasam') || combo.name.toLowerCase().includes('rasam');
        const isKozhambu = combo.slug.includes('kozhambu') || combo.slug.includes('kuzhambu') || combo.name.toLowerCase().includes('kozhambu');

        let targetProducts: Product[] = [];
        if (isRasam) {
          targetProducts = RASAM_PRODUCTS;
        } else if (isKozhambu) {
          targetProducts = KOZHAMBU_PRODUCTS;
        } else {
          targetProducts = ALL_PRODUCTS.slice(0, 7);
        }

        const resolvedProducts: Array<ComboProduct & { product: Product }> = targetProducts.map((p, idx) => ({
          comboId: combo.id,
          productId: p.id,
          quantity: 1,
          displayOrder: idx + 1,
          product: {
            ...p,
            price: p.price || 100,
            weight: 50,
            weightUnit: 'g',
          }
        }));

        const individualTotal = 350;
        const savings = 0;

        const heroImage: string = isRasam
          ? '/assets/aridhu-rasam-hero.jpg'
          : (isKozhambu ? '/assets/aridhu-kuzhambu-hero.jpg' : (combo.imageUrl || '/assets/aridhu-rasam-hero.jpg'));

        const comboWithProducts: ComboWithProducts = {
          ...combo,
          price: 350,
          compareAtPrice: null,
          imageUrl: heroImage,
          gallery: [heroImage],
          resolvedProducts,
          individualTotal,
          savings,
        };
        return comboWithProducts;
      })
    );
  }
}
