import { NgModule, provideBrowserGlobalErrorListeners } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { provideHttpClient } from '@angular/common/http';

import { AppRoutingModule } from './app-routing-module';
import { SharedModule } from './shared/shared.module';
import { App } from './app';

import { MainLayoutComponent } from './layouts/main-layout/main-layout.component';
import { AdminLayoutComponent } from './layouts/admin-layout/admin-layout.component';

import { HomeComponent } from './pages/home/home.component';
import { ShopComponent } from './pages/shop/shop.component';
import { ProductDetailComponent } from './pages/product-detail/product-detail.component';
import { ComboDetailComponent } from './pages/combo-detail/combo-detail.component';
import { CartComponent } from './pages/cart/cart.component';
import { CheckoutComponent } from './pages/checkout/checkout.component';
import { OrderSuccessComponent } from './pages/order-success/order-success.component';
import { CategoryComponent } from './pages/category/category.component';
import { AboutComponent } from './pages/about/about.component';
import { ContactComponent } from './pages/contact/contact.component';
import { SearchComponent } from './pages/search/search.component';
import { TrackOrderComponent } from './pages/track-order/track-order.component';
import { ShippingPolicyComponent } from './pages/shipping-policy/shipping-policy.component';
import { ReturnsPolicyComponent } from './pages/returns-policy/returns-policy.component';
import { PrivacyPolicyComponent } from './pages/privacy-policy/privacy-policy.component';
import { TermsPolicyComponent } from './pages/terms-policy/terms-policy.component';

import { AdminLoginComponent } from './admin/login/login.component';
import { AdminDashboardComponent } from './admin/dashboard/dashboard.component';
import { AdminProductsComponent } from './admin/products/products.component';
import { AdminCategoriesComponent } from './admin/categories/categories.component';
import { AdminCombosComponent } from './admin/combos/combos.component';
import { AdminOrdersComponent } from './admin/orders/orders.component';

@NgModule({
  declarations: [
    App,
    MainLayoutComponent,
    AdminLayoutComponent,
    HomeComponent,
    ShopComponent,
    ProductDetailComponent,
    ComboDetailComponent,
    CartComponent,
    CheckoutComponent,
    OrderSuccessComponent,
    CategoryComponent,
    AboutComponent,
    ContactComponent,
    SearchComponent,
    TrackOrderComponent,
    ShippingPolicyComponent,
    ReturnsPolicyComponent,
    PrivacyPolicyComponent,
    TermsPolicyComponent,
    AdminLoginComponent,
    AdminDashboardComponent,
    AdminProductsComponent,
    AdminCategoriesComponent,
    AdminCombosComponent,
    AdminOrdersComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    AppRoutingModule,
  ],
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideHttpClient(),
  ],
  bootstrap: [App]
})
export class AppModule { }
