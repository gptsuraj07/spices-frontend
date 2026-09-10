import { Component, Input } from '@angular/core';

export interface BreadcrumbItem {
  label: string;
  routerLink?: string | string[];
}

@Component({
  selector: 'app-breadcrumb',
  standalone: false,
  template: `
    <nav class="breadcrumb" aria-label="Breadcrumb">
      <ol class="breadcrumb__list">
        <li class="breadcrumb__item">
          <a routerLink="/" class="breadcrumb__link">Home</a>
        </li>
        <li
          *ngFor="let item of items; let last = last"
          class="breadcrumb__item"
          [class.breadcrumb__item--active]="last"
        >
          <svg class="breadcrumb__sep" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
            <polyline points="9,18 15,12 9,6"/>
          </svg>
          <ng-container *ngIf="!last && item.routerLink">
            <a [routerLink]="item.routerLink" class="breadcrumb__link">{{ item.label }}</a>
          </ng-container>
          <ng-container *ngIf="last || !item.routerLink">
            <span class="breadcrumb__current" [attr.aria-current]="last ? 'page' : null">{{ item.label }}</span>
          </ng-container>
        </li>
      </ol>
    </nav>
  `,
  styleUrls: ['./breadcrumb.component.scss'],
})
export class BreadcrumbComponent {
  @Input() items: BreadcrumbItem[] = [];
}
