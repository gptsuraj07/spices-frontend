import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

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

const routes: Routes = [
  {
    path: '',
    component: MainLayoutComponent,
    children: [
      { path: '', component: HomeComponent },
      { path: 'shop', component: ShopComponent },
      { path: 'product/:slug', component: ProductDetailComponent },
      { path: 'combo/:slug', component: ComboDetailComponent },
      { path: 'category/:slug', component: CategoryComponent },
      { path: 'cart', component: CartComponent },
      { path: 'checkout', component: CheckoutComponent },
      { path: 'order-success', component: OrderSuccessComponent },
      { path: 'about', component: AboutComponent },
      { path: 'contact', component: ContactComponent },
      { path: 'search', component: SearchComponent },
      { path: 'track-order', component: TrackOrderComponent },
      { path: 'shipping', component: ShippingPolicyComponent },
      { path: 'returns', component: ReturnsPolicyComponent },
      { path: 'privacy', component: PrivacyPolicyComponent },
      { path: 'terms', component: TermsPolicyComponent },
    ]
  },
  {
    path: 'admin/login',
    component: AdminLoginComponent
  },
  {
    path: 'admin',
    component: AdminLayoutComponent,
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: AdminDashboardComponent },
      { path: 'products', component: AdminProductsComponent },
      { path: 'categories', component: AdminCategoriesComponent },
      { path: 'combos', component: AdminCombosComponent },
      { path: 'orders', component: AdminOrdersComponent },
    ]
  },
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { scrollPositionRestoration: 'enabled' })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
