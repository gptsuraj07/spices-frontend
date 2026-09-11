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

  getComboItems(combo: any): { name: string; tamilName?: string }[] {
    if (combo.items && combo.items.length) {
      return combo.items;
    }
    const isRasam = (combo.slug && combo.slug.includes('rasam')) || (combo.name && combo.name.includes('Rasam'));
    if (isRasam) {
      return [
        { name: 'Kalyana Rasam Powder', tamilName: 'கல்யாண ரசம்' },
        { name: 'Ginger Lemon Rasam Powder', tamilName: 'இஞ்சி எலுமிச்சை ரசம்' },
        { name: 'Mor Rasam Powder', tamilName: 'மோர் ரசம்' },
        { name: 'Kandathippili Rasam Powder', tamilName: 'கண்டத்திப்பிலி ரசம்' },
        { name: 'Cinnamon Rasam Powder', tamilName: 'இலவங்கப்பட்டை ரசம்' },
        { name: 'Kollu Rasam Powder', tamilName: 'கொள்ளு ரசம்' },
        { name: 'Poricha Rasam Powder', tamilName: 'பொரிச்ச ரசம்' },
      ];
    }
    return [
      { name: 'Vatha Kozhambu Powder', tamilName: 'வத்த குழம்பு' },
      { name: 'Ennai Kathirikai Kozhambu Powder', tamilName: 'எண்ணெய் கத்திரிக்காய்' },
      { name: 'Mor Kozhambu Powder', tamilName: 'மோர் குழம்பு' },
      { name: 'Talaga Kozhambu Powder', tamilName: 'தாளக குழம்பு' },
      { name: 'Vendaya Vendaikai Kozhambu Powder', tamilName: 'வெந்தய வெண்டைக்காய்' },
      { name: 'Kootu Kozhambu Powder', tamilName: 'கூட்டு குழம்பு' },
      { name: 'Narthangai Kuzhambu Powder', tamilName: 'நார்த்தங்காய் குழம்பு' },
    ];
  }
}
