import { Component, Input } from '@angular/core';

export type PlaceholderVariant = 'product' | 'category' | 'combo' | 'hero' | 'generic';
export type PlaceholderAspect = '1/1' | '4/3' | '3/4' | '16/9' | '3/2' | '2/3';

@Component({
  selector: 'app-image-placeholder',
  standalone: false,
  template: `
    <div
      class="img-ph"
      [class]="'img-ph--' + variant"
      [style.aspect-ratio]="aspect"
      [attr.aria-label]="ariaLabel || 'Image placeholder'"
      role="img"
    >
      <div class="img-ph__inner">
        <div class="img-ph__icon">
          <ng-container [ngSwitch]="variant">
            <svg *ngSwitchCase="'product'" class="img-ph__svg" viewBox="0 0 48 48" fill="none">
              <circle cx="24" cy="18" r="10" stroke="currentColor" stroke-width="1.5" stroke-dasharray="3 2"/>
              <path d="M8 38c0-8.837 7.163-16 16-16s16 7.163 16 16" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-dasharray="3 2"/>
              <circle cx="24" cy="18" r="4" fill="currentColor" opacity="0.2"/>
            </svg>
            <svg *ngSwitchCase="'category'" class="img-ph__svg" viewBox="0 0 48 48" fill="none">
              <path d="M24 6 L42 18 L42 36 Q24 46 6 36 L6 18 Z" stroke="currentColor" stroke-width="1.5" fill="none" stroke-dasharray="3 2"/>
              <circle cx="24" cy="24" r="5" fill="currentColor" opacity="0.2"/>
            </svg>
            <svg *ngSwitchCase="'combo'" class="img-ph__svg" viewBox="0 0 48 48" fill="none">
              <rect x="6" y="12" width="28" height="28" rx="4" stroke="currentColor" stroke-width="1.5" stroke-dasharray="3 2"/>
              <rect x="14" y="8" width="28" height="28" rx="4" stroke="currentColor" stroke-width="1.5" opacity="0.5" stroke-dasharray="3 2"/>
              <circle cx="20" cy="26" r="4" fill="currentColor" opacity="0.2"/>
            </svg>
            <svg *ngSwitchDefault class="img-ph__svg" viewBox="0 0 48 48" fill="none">
              <rect x="6" y="6" width="36" height="36" rx="6" stroke="currentColor" stroke-width="1.5" stroke-dasharray="3 2"/>
              <circle cx="16" cy="18" r="4" fill="currentColor" opacity="0.3"/>
              <path d="M6 32 L16 22 L24 30 L32 20 L42 32" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" opacity="0.5"/>
            </svg>
          </ng-container>
        </div>
        <span class="img-ph__label" *ngIf="showLabel">{{ labelText }}</span>
      </div>
      <!-- Subtle botanical decoration -->
      <div class="img-ph__decoration" aria-hidden="true">
        <svg class="img-ph__leaf img-ph__leaf--tl" viewBox="0 0 40 60" fill="none">
          <path d="M20 55 C20 55 0 40 5 20 C10 5 25 2 30 15 C35 28 25 42 20 55Z" fill="currentColor" opacity="0.08"/>
        </svg>
        <svg class="img-ph__leaf img-ph__leaf--br" viewBox="0 0 40 60" fill="none">
          <path d="M20 5 C20 5 40 20 35 40 C30 55 15 58 10 45 C5 32 15 18 20 5Z" fill="currentColor" opacity="0.08"/>
        </svg>
      </div>
    </div>
  `,
  styleUrls: ['./image-placeholder.component.scss'],
})
export class ImagePlaceholderComponent {
  @Input() variant: PlaceholderVariant = 'product';
  @Input() aspect: PlaceholderAspect = '1/1';
  @Input() showLabel = false;
  @Input() ariaLabel = '';

  get labelText(): string {
    const labels: Record<PlaceholderVariant, string> = {
      product: 'Product Image',
      category: 'Category Image',
      combo: 'Collection Image',
      hero: 'Hero Image',
      generic: 'Image',
    };
    return labels[this.variant];
  }
}
