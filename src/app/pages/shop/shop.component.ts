import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Product, Category, ProductFilter, SortOption, Combo } from '../../core/models';
import { ProductService } from '../../core/services/product.service';
import { CategoryService } from '../../core/services/category.service';
import { ComboService } from '../../core/services/combo.service';
import { CartService } from '../../core/services/cart.service';
import { ToastService } from '../../core/services/toast.service';

@Component({
  selector: 'app-shop',
  standalone: false,
  templateUrl: './shop.component.html',
  styleUrls: ['./shop.component.scss'],
})
export class ShopComponent implements OnInit {
  products: Product[] = [];
  categories: Category[] = [];
  combos: Combo[] = [];
  loading = true;
  totalCount = 0;
  filterOpen = false;
  addingComboId: string | null = null;
  
  // Search & Filter State
  searchQuery = '';
  activeCategoryTab: 'all' | 'cat-rasam' | 'cat-kozhambu' | 'combos' = 'all';
  currentFilter: ProductFilter = {};
  currentSort: SortOption = 'featured';

  sortOptions: { value: SortOption; label: string }[] = [
    { value: 'featured', label: 'Featured' },
    { value: 'price_asc', label: 'Price: Low to High' },
    { value: 'price_desc', label: 'Price: High to Low' },
    { value: 'newest', label: 'Newest' },
    { value: 'name_asc', label: 'Name: A–Z' },
  ];

  constructor(
    private productService: ProductService,
    private categoryService: CategoryService,
    private comboService: ComboService,
    private cartService: CartService,
    private toastService: ToastService,
    private route: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    this.categoryService.getActive().subscribe(cats => { 
      this.categories = cats; 
    });

    this.comboService.getActive().subscribe(combos => {
      this.combos = combos;
    });

    this.route.queryParams.subscribe(params => {
      if (params['category']) {
        const catParam = params['category'];
        if (catParam === 'cat-rasam' || catParam === 'rasam') {
          this.activeCategoryTab = 'cat-rasam';
          this.currentFilter.categoryId = 'cat-rasam';
        } else if (catParam === 'cat-kozhambu' || catParam === 'kozhambu') {
          this.activeCategoryTab = 'cat-kozhambu';
          this.currentFilter.categoryId = 'cat-kozhambu';
        } else if (catParam === 'combos' || catParam === 'combo' || catParam === 'cat-combos') {
          this.activeCategoryTab = 'combos';
          this.currentFilter.categoryId = 'cat-combos';
        } else {
          this.currentFilter.categoryId = catParam;
        }
      }
      this.loadProducts();
    });
  }

  loadProducts(): void {
    this.loading = true;

    const filterObj: ProductFilter = {
      ...this.currentFilter,
    };

    if (this.searchQuery.trim()) {
      filterObj.search = this.searchQuery.trim();
    }

    if (this.activeCategoryTab === 'cat-rasam' || this.activeCategoryTab === 'cat-kozhambu') {
      filterObj.categoryId = this.activeCategoryTab;
    } else if (this.activeCategoryTab === 'all') {
      delete filterObj.categoryId;
    }

    this.productService.filter(filterObj, this.currentSort, 1, 50).subscribe(res => {
      this.products = res.data;
      this.totalCount = res.total;
      this.loading = false;
    });
  }

  selectCategoryTab(tab: 'all' | 'cat-rasam' | 'cat-kozhambu' | 'combos'): void {
    this.activeCategoryTab = tab;
    if (tab === 'combos') {
      this.currentFilter.categoryId = 'cat-combos';
      this.loading = false;
      return;
    }
    if (tab === 'all') {
      delete this.currentFilter.categoryId;
    } else {
      this.currentFilter.categoryId = tab;
    }
    this.loadProducts();
  }

  onSearchChange(query: string): void {
    this.searchQuery = query;
    this.loadProducts();
  }

  onFilterChange(filter: ProductFilter): void {
    this.currentFilter = filter;
    if (filter.categoryId) {
      if (filter.categoryId === 'cat-rasam') this.activeCategoryTab = 'cat-rasam';
      else if (filter.categoryId === 'cat-kozhambu') this.activeCategoryTab = 'cat-kozhambu';
      else if (filter.categoryId === 'cat-combos' || filter.categoryId === 'combos') this.activeCategoryTab = 'combos';
    } else {
      this.activeCategoryTab = 'all';
    }
    this.loadProducts();
  }

  onSortChange(sort: SortOption): void {
    this.currentSort = sort;
    this.loadProducts();
  }

  toggleFilter(): void {
    this.filterOpen = !this.filterOpen;
  }

  clearSearch(): void {
    this.searchQuery = '';
    this.loadProducts();
  }

  clearAllFilters(): void {
    this.searchQuery = '';
    this.activeCategoryTab = 'all';
    this.currentFilter = {};
    this.loadProducts();
  }

  addComboToCart(combo: Combo): void {
    if (this.addingComboId) return;
    this.addingComboId = combo.id;

    this.cartService.addItem({
      itemId: combo.id,
      itemType: 'combo',
      name: combo.name,
      slug: combo.slug,
      imageUrl: combo.imageUrl,
      price: combo.price,
      quantity: 1,
      weight: null,
      categoryId: null,
    });

    this.toastService.success(`${combo.name} added to cart!`);
    setTimeout(() => {
      this.addingComboId = null;
    }, 600);
  }

  get activeCategoryLabel(): string {
    if (this.activeCategoryTab === 'cat-rasam') return 'Rasam Powders (7)';
    if (this.activeCategoryTab === 'cat-kozhambu') return 'Kozhambu Powders (7)';
    if (this.activeCategoryTab === 'combos') return 'Heritage Combos (2)';
    return 'All Heritage Blends (14)';
  }

  getComboTamilName(name: string): string {
    if (name.includes('Rasam')) return 'ஏழு நாள் ரசம் சடங்கு பெட்டி';
    if (name.includes('Kozhambu')) return 'ஏழு நாள் குழம்பு சடங்கு பெட்டி';
    return 'பாரம்பரிய காம்போ பெட்டி';
  }

  getComboItems(combo: any): { name: string; tamilName?: string }[] {
    if (combo.items && combo.items.length) {
      return combo.items;
    }
    const isRasam = (combo.slug && combo.slug.includes('rasam')) || (combo.name && combo.name.includes('Rasam'));
    if (isRasam) {
      return [
        { name: 'Kalyana Rasam Powder', tamilName: 'கல்யாண ரசம்' },
        { name: 'Poricha Rasam Powder', tamilName: 'பொரிச்ச ரசம்' },
        { name: 'Elavangapattai Rasam Powder', tamilName: 'இலவங்கப்பட்டை ரசம்' },
        { name: 'Thalippu Milagu Rasam Powder', tamilName: 'தாளித்த மிளகு ரசம்' },
        { name: 'Inji Elumichai Rasam Powder', tamilName: 'இஞ்சி எலுமிச்சை ரசம்' },
        { name: 'Kandathippili Rasam Powder', tamilName: 'கண்டத்திப்பிலி ரசம்' },
        { name: 'Kollu Rasam Powder', tamilName: 'கொள்ளு ரசம்' },
      ];
    }
    return [
      { name: 'Vatha Kozhambu Powder', tamilName: 'வத்த குழம்பு' },
      { name: 'Pundu Kozhambu Powder', tamilName: 'பூண்டு குழம்பு' },
      { name: 'Kara Kozhambu Powder', tamilName: 'கார குழம்பு' },
      { name: 'Milagu Kozhambu Powder', tamilName: 'மிளகு குழம்பு' },
      { name: 'Mor Kozhambu Powder', tamilName: 'மோர் குழம்பு' },
      { name: 'Ennai Kathirikai Kozhambu Powder', tamilName: 'எண்ணெய் கத்திரிக்காய்' },
      { name: 'Thakkali Kozhambu Powder', tamilName: 'தக்காளி குழம்பு' },
    ];
  }
}
