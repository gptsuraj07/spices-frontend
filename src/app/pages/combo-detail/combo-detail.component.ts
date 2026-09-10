import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ComboService, ComboWithProducts } from '../../core/services/combo.service';
import { CartService } from '../../core/services/cart.service';
import { ToastService } from '../../core/services/toast.service';

@Component({
  selector: 'app-combo-detail',
  standalone: false,
  templateUrl: './combo-detail.component.html',
  styleUrls: ['./combo-detail.component.scss'],
})
export class ComboDetailComponent implements OnInit {
  combo: ComboWithProducts | null = null;
  loading = true;
  quantity = 1;

  constructor(
    private route: ActivatedRoute,
    private comboService: ComboService,
    private cartService: CartService,
    private toastService: ToastService,
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.comboService.getBySlugWithProducts(params['slug']).subscribe(combo => {
        this.combo = combo;
        this.loading = false;
      });
    });
  }

  addToCart(): void {
    if (!this.combo) return;
    this.cartService.addItem({
      itemId: this.combo.id,
      itemType: 'combo',
      name: this.combo.name,
      slug: this.combo.slug,
      imageUrl: this.combo.imageUrl,
      price: this.combo.price,
      quantity: this.quantity,
      weight: null,
      categoryId: null,
    });
    this.toastService.success(`${this.combo.name} added to cart`);
  }
}
