// ============================================================
// ARIDHU — Shared Module
// ============================================================

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { ProductCardComponent } from './components/product-card/product-card.component';
import { CategoryCardComponent } from './components/category-card/category-card.component';
import { ComboCardComponent } from './components/combo-card/combo-card.component';
import { ImagePlaceholderComponent } from './components/image-placeholder/image-placeholder.component';
import { QuantitySelectorComponent } from './components/quantity-selector/quantity-selector.component';
import { BreadcrumbComponent } from './components/breadcrumb/breadcrumb.component';
import { FilterSidebarComponent } from './components/filter-sidebar/filter-sidebar.component';
import { ToastContainerComponent } from './components/toast/toast-container.component';
import { PriceComponent } from './components/price/price.component';
import { BadgeComponent } from './components/badge/badge.component';

import { Nl2brPipe } from './pipes/nl2br.pipe';
import { ProductNamePipe } from './pipes/product-name.pipe';
import { CategorySlugPipe } from './pipes/category-slug.pipe';

@NgModule({
  declarations: [
    HeaderComponent,
    FooterComponent,
    ProductCardComponent,
    CategoryCardComponent,
    ComboCardComponent,
    ImagePlaceholderComponent,
    QuantitySelectorComponent,
    BreadcrumbComponent,
    FilterSidebarComponent,
    ToastContainerComponent,
    PriceComponent,
    BadgeComponent,
    Nl2brPipe,
    ProductNamePipe,
    CategorySlugPipe,
  ],
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    FormsModule,
  ],
  exports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    FormsModule,
    HeaderComponent,
    FooterComponent,
    ProductCardComponent,
    CategoryCardComponent,
    ComboCardComponent,
    ImagePlaceholderComponent,
    QuantitySelectorComponent,
    BreadcrumbComponent,
    FilterSidebarComponent,
    ToastContainerComponent,
    PriceComponent,
    BadgeComponent,
    Nl2brPipe,
    ProductNamePipe,
    CategorySlugPipe,
  ],
})
export class SharedModule {}
