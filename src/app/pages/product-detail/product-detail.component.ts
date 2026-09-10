import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Product } from '../../core/models';
import { ProductService } from '../../core/services/product.service';
import { CartService } from '../../core/services/cart.service';
import { ToastService } from '../../core/services/toast.service';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-product-detail',
  standalone: false,
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.scss'],
})
export class ProductDetailComponent implements OnInit {
  product: Product | null = null;
  loading = true;
  quantity = 1;
  activeTab = 'description';
  tabs = [
    { id: 'description', label: 'Description' },
    { id: 'usage', label: 'How to Use' },
    { id: 'storage', label: 'Storage' },
  ];

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    private cartService: CartService,
    private toastService: ToastService,
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.productService.getBySlug(params['slug']).subscribe(p => {
        this.product = p;
        this.loading = false;
      });
    });
  }

  getImageUrl(url: string | null | undefined): string | null {
    if (!url || !url.trim()) return null;
    if (url.startsWith('/')) {
      const base = environment.apiUrl.replace(/\/api\/?$/, '');
      return `${base}${url}`;
    }
    return url;
  }

  addToCart(): void {
    if (!this.product) return;
    this.cartService.addItem({
      itemId: this.product.id,
      itemType: 'product',
      name: this.product.name,
      slug: this.product.slug,
      imageUrl: this.product.imageUrl,
      price: this.product.price,
      quantity: this.quantity,
      weight: this.product.weight,
      categoryId: this.product.categoryId,
    });
    this.toastService.success(`${this.product.name} added to cart`);
  }
}
