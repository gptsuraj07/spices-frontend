// ============================================================
// ARIDHU — Product Service (Connected to Backend API & Local Fallback)
// ============================================================

import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Product, ProductFilter, SortOption, PaginatedResponse } from '../models';
import { ALL_PRODUCTS } from '../data/products.mock';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class ProductService {
  private apiUrl = `${environment.apiUrl}/products`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<Product[]> {
    return this.http.get<Product[]>(this.apiUrl).pipe(
      map(data => data && data.length > 0 ? data : ALL_PRODUCTS),
      catchError(() => of([...ALL_PRODUCTS]))
    );
  }

  getFeatured(): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.apiUrl}/featured`).pipe(
      map(data => data && data.length > 0 ? data : ALL_PRODUCTS.filter(p => p.featured && p.status === 'active')),
      catchError(() => of(ALL_PRODUCTS.filter(p => p.featured && p.status === 'active')))
    );
  }

  getByCategory(categoryId: string): Observable<Product[]> {
    return this.http.get<Product[]>(this.apiUrl, { params: new HttpParams().set('categoryId', categoryId) }).pipe(
      map(data => data && data.length > 0 ? data : ALL_PRODUCTS.filter(p => p.categoryId === categoryId)),
      catchError(() => of(ALL_PRODUCTS.filter(p => p.categoryId === categoryId && p.status === 'active')))
    );
  }

  getByCategorySlug(slug: string): Observable<Product[]> {
    const catMap: Record<string, string> = {
      'rasam': 'cat-rasam',
      'kozhambu': 'cat-kozhambu',
      'sambar': 'cat-sambar',
      'tiffin-mixes': 'cat-tiffin',
      'tiffin': 'cat-tiffin',
    };
    const catId = catMap[slug] || slug;

    return this.http.get<Product[]>(this.apiUrl, { params: new HttpParams().set('categorySlug', slug) }).pipe(
      map(data => data && data.length > 0 ? data : ALL_PRODUCTS.filter(p => p.categoryId === catId)),
      catchError(() => of(ALL_PRODUCTS.filter(p => p.categoryId === catId)))
    );
  }

  getBySlug(slug: string): Observable<Product | null> {
    return this.http.get<Product>(`${this.apiUrl}/${slug}`).pipe(
      catchError(() => of(ALL_PRODUCTS.find(p => p.slug === slug) ?? null))
    );
  }

  getById(id: string): Observable<Product | null> {
    return this.getAll().pipe(
      map(prods => prods.find(p => p.id === id || (p as any)._id === id) ?? null)
    );
  }

  getManyByIds(ids: string[]): Observable<Product[]> {
    return this.getAll().pipe(
      map(prods => prods.filter(p => ids.includes(p.id) || ids.includes((p as any)._id)))
    );
  }

  filter(filter: ProductFilter, sort: SortOption = 'featured', page = 1, perPage = 50): Observable<PaginatedResponse<Product>> {
    let params = new HttpParams().set('sort', sort);
    if (filter.categoryId) params = params.set('categoryId', filter.categoryId);
    if (filter.minPrice !== undefined) params = params.set('minPrice', filter.minPrice.toString());
    if (filter.maxPrice !== undefined) params = params.set('maxPrice', filter.maxPrice.toString());
    if (filter.search) params = params.set('search', filter.search);

    return this.http.get<Product[]>(this.apiUrl, { params }).pipe(
      map(data => {
        let results = (data && data.length > 0) ? data : [...ALL_PRODUCTS];

        if (filter.categoryId) {
          results = results.filter(p => p.categoryId === filter.categoryId);
        }
        if (filter.search) {
          const q = filter.search.toLowerCase();
          results = results.filter(p => p.name.toLowerCase().includes(q) || p.shortDescription.toLowerCase().includes(q));
        }

        const total = results.length;
        const start = (page - 1) * perPage;
        const paginatedData = results.slice(start, start + perPage);

        return {
          data: paginatedData,
          total,
          page,
          perPage,
          totalPages: Math.ceil(total / perPage),
        };
      }),
      catchError(() => {
        let results = [...ALL_PRODUCTS];
        if (filter.categoryId) results = results.filter(p => p.categoryId === filter.categoryId);
        if (filter.search) {
          const q = filter.search.toLowerCase();
          results = results.filter(p => p.name.toLowerCase().includes(q) || p.shortDescription.toLowerCase().includes(q));
        }
        return of({
          data: results,
          total: results.length,
          page: 1,
          perPage: 50,
          totalPages: 1,
        });
      })
    );
  }

  search(query: string): Observable<Product[]> {
    if (!query.trim()) return of([]);
    return this.http.get<Product[]>(this.apiUrl, { params: new HttpParams().set('search', query) }).pipe(
      map(data => data && data.length > 0 ? data : ALL_PRODUCTS.filter(p => p.name.toLowerCase().includes(query.toLowerCase()))),
      catchError(() => of(ALL_PRODUCTS.filter(p => p.name.toLowerCase().includes(query.toLowerCase()))))
    );
  }

  searchProducts(query: string): Observable<Product[]> {
    return this.search(query);
  }

  deleteProduct(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`).pipe(
      catchError(() => of({ message: 'Deleted locally' }))
    );
  }

  uploadProductImage(productId: string, file: File): Observable<Product> {
    const formData = new FormData();
    formData.append('file', file, file.name);
    return this.http.post<Product>(`${environment.apiUrl}/admin/products/${productId}/image`, formData);
  }

  removeProductImage(productId: string): Observable<Product> {
    return this.http.delete<Product>(`${environment.apiUrl}/admin/products/${productId}/image`);
  }

  createProduct(productData: Partial<Product>): Observable<Product> {
    return this.http.post<Product>(`${environment.apiUrl}/admin/products`, productData);
  }

  updateProduct(productId: string, productData: Partial<Product>): Observable<Product> {
    return this.http.put<Product>(`${environment.apiUrl}/admin/products/${productId}`, productData);
  }
}
