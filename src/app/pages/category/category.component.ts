import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Product, Category, Combo } from '../../core/models';
import { ProductService } from '../../core/services/product.service';
import { CategoryService } from '../../core/services/category.service';
import { ComboService } from '../../core/services/combo.service';

@Component({
  selector: 'app-category',
  standalone: false,
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.scss'],
})
export class CategoryComponent implements OnInit {
  products: Product[] = [];
  combos: Combo[] = [];
  category: Category | null = null;
  loading = true;
  isCombosCategory = false;

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    private categoryService: CategoryService,
    private comboService: ComboService,
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.loading = true;
      const slug = params['slug'];
      this.isCombosCategory = (slug === 'combos' || slug === 'cat-combos');

      this.categoryService.getBySlug(slug).subscribe(cat => {
        this.category = cat;
        if (this.category && !this.category.imageUrl) {
          if (slug === 'kozhambu') this.category.imageUrl = '/assets/aridhu-kuzhambu-hero.jpg';
          if (slug === 'rasam') this.category.imageUrl = '/assets/aridhu-rasam-hero.jpg';
        }

        if (this.isCombosCategory) {
          this.comboService.getActive().subscribe(combos => {
            this.combos = combos;
            this.loading = false;
          });
        } else if (cat) {
          this.productService.getByCategorySlug(slug).subscribe(products => {
            this.products = products;
            this.loading = false;
          });
        } else {
          // Fallback if category slug wasn't matched
          this.productService.getByCategorySlug(slug).subscribe(products => {
            this.products = products;
            this.loading = false;
          });
        }
      });
    });
  }

  getComboItems(combo: any): { name: string }[] {
    if (combo.items && combo.items.length) {
      return combo.items;
    }
    const isRasam = (combo.slug && combo.slug.includes('rasam')) || (combo.name && combo.name.includes('Rasam'));
    if (isRasam) {
      return [
        { name: 'Kalyana Rasam Powder' },
        { name: 'Ginger Lemon Rasam Powder' },
        { name: 'Mor Rasam Powder' },
        { name: 'Kandathippili Rasam Powder' },
        { name: 'Cinnamon Rasam Powder' },
        { name: 'Kollu Rasam Powder' },
        { name: 'Poricha Rasam Powder' },
      ];
    }
    return [
      { name: 'Vatha Kozhambu Powder' },
      { name: 'Ennai Kathirikai Kozhambu Powder' },
      { name: 'Mor Kozhambu Powder' },
      { name: 'Talaga Kozhambu Powder' },
      { name: 'Vendaya Vendaikai Kozhambu Powder' },
      { name: 'Kootu Kozhambu Powder' },
      { name: 'Narthangai Kuzhambu Powder' },
    ];
  }
}
