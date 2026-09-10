// ============================================================
// ARIDHU — Category Service (Connected to Backend API)
// ============================================================

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Category } from '../models';
import { CATEGORIES } from '../data/categories.mock';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class CategoryService {
  private apiUrl = `${environment.apiUrl}/categories`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<Category[]> {
    return this.http.get<Category[]>(this.apiUrl).pipe(
      catchError(() => of(CATEGORIES))
    );
  }

  getActive(): Observable<Category[]> {
    return this.getAll();
  }

  getBySlug(slug: string): Observable<Category | null> {
    return this.getAll().pipe(
      map(cats => cats.find(c => c.slug === slug) ?? null),
      catchError(() => of(CATEGORIES.find(c => c.slug === slug) ?? null))
    );
  }
}
