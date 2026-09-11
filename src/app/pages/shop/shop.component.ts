import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Product, Category, ProductFilter, SortOption, Combo } from '../../core/models';
import { ProductService } from '../../core/services/product.service';
import { CategoryService } from '../../core/services/category.service';
import { ComboService } from '../../core/services/combo.service';
import { CartService } from '../../core/services/cart.service';
import { ToastService } from '../../core/services/toast.service';
import { ALL_PRODUCTS } from '../../core/data/products.mock';

export type ShopTab = 'all' | 'cat-kozhambu' | 'cat-rasam' | 'cat-sambar' | 'cat-tiffin' | 'combos';

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
  allCatalogProducts: Product[] = ALL_PRODUCTS;
  loading = true;
  totalCount = 0;
  filterOpen = false;
  addingComboId: string | null = null;
  addingProductId: string | null = null;
  
  // Search & Filter State
  searchQuery = '';
  activeCategoryTab: ShopTab = 'all';
  currentFilter: ProductFilter = {};
  currentSort: SortOption = 'featured';

  // Quick Index state
  quickIndexCategory: 'all' | 'cat-kozhambu' | 'cat-rasam' | 'cat-sambar' | 'cat-tiffin' = 'all';
  isQuickIndexOpen = true;

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
        } else if (catParam === 'cat-sambar' || catParam === 'sambar') {
          this.activeCategoryTab = 'cat-sambar';
          this.currentFilter.categoryId = 'cat-sambar';
        } else if (catParam === 'cat-tiffin' || catParam === 'tiffin-mixes' || catParam === 'tiffin') {
          this.activeCategoryTab = 'cat-tiffin';
          this.currentFilter.categoryId = 'cat-tiffin';
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

    if (this.activeCategoryTab !== 'all' && this.activeCategoryTab !== 'combos') {
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

  selectCategoryTab(tab: ShopTab): void {
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
      else if (filter.categoryId === 'cat-sambar') this.activeCategoryTab = 'cat-sambar';
      else if (filter.categoryId === 'cat-tiffin') this.activeCategoryTab = 'cat-tiffin';
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

  // Quick Index item direct jump / order
  jumpToProduct(product: Product): void {
    // If we're on combos tab, switch back to 'all' or product category
    if (this.activeCategoryTab === 'combos') {
      this.selectCategoryTab('all');
    } else if (this.activeCategoryTab !== 'all' && this.activeCategoryTab !== product.categoryId as ShopTab) {
      this.selectCategoryTab('all');
    }

    setTimeout(() => {
      const el = document.getElementById('pcard-' + product.slug);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        el.classList.add('pcard--highlight');
        setTimeout(() => el.classList.remove('pcard--highlight'), 2000);
      }
    }, 150);
  }

  quickAddProduct(product: Product, event: Event): void {
    event.stopPropagation();
    if (this.addingProductId) return;
    this.addingProductId = product.id;

    this.cartService.addItem({
      itemId: product.id,
      itemType: 'product',
      name: product.name,
      slug: product.slug,
      imageUrl: product.imageUrl,
      price: product.price,
      quantity: 1,
      weight: product.weight,
      categoryId: product.categoryId,
    });

    this.toastService.success(`${product.name} added to cart!`);
    setTimeout(() => {
      this.addingProductId = null;
    }, 600);
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
    if (this.activeCategoryTab === 'cat-kozhambu') return 'Kuzhambu Powders (7)';
    if (this.activeCategoryTab === 'cat-rasam') return 'Rasam Powders (7)';
    if (this.activeCategoryTab === 'cat-sambar') return 'Sambar Powders (2)';
    if (this.activeCategoryTab === 'cat-tiffin') return 'Tiffin Mixes & Podis (7)';
    if (this.activeCategoryTab === 'combos') return 'Heritage Combos (2)';
    return 'All Products (23)';
  }

  get productsByKozhambu(): Product[] {
    return this.allCatalogProducts.filter(p => p.categoryId === 'cat-kozhambu');
  }

  get productsByRasam(): Product[] {
    return this.allCatalogProducts.filter(p => p.categoryId === 'cat-rasam');
  }

  get productsBySambar(): Product[] {
    return this.allCatalogProducts.filter(p => p.categoryId === 'cat-sambar');
  }

  get productsByTiffin(): Product[] {
    return this.allCatalogProducts.filter(p => p.categoryId === 'cat-tiffin');
  }

  private tamilNamesMap: Record<string, string> = {
    'Kalyana Rasam Powder': 'கல்யாண ரசம் பொடி',
    'Ginger Lemon Rasam Powder': 'இஞ்சி எலுமிச்சை ரசம்',
    'Mor Rasam Powder': 'மோர் ரசம் பொடி',
    'Kandathippili Rasam Powder': 'கண்டதிப்பிலி ரசம்',
    'Cinnamon Rasam Powder': 'இலவங்கப்பட்டை ரசம்',
    'Kollu Rasam Powder': 'கொள்ளு ரசம் பொடி',
    'Poricha Rasam Powder': 'பொரிச்ச ரசம் பொடி',
    'Vatha Kuzhambu Powder': 'வத்த குழம்பு பொடி',
    'Ennai Kathirikai Kuzhambu Powder': 'எண்ணெய் கத்திரிக்காய்',
    'Mor Kuzhambu Powder': 'மோர் குழம்பு பொடி',
    'Talaga Kuzhambu Powder': 'தாளக குழம்பு பொடி',
    'Vendaya Vendaikai Kuzhambu Powder': 'வெந்தய வெண்டைக்காய்',
    'Kootu Kuzhambu Powder': 'கூட்டு குழம்பு பொடி',
    'Narthangai Kuzhambu Powder': 'நார்த்தங்காய் குழம்பு',
    'Chennai Sambar Powder': 'சென்னை சாம்பார் பொடி',
    'Sambar with Coconut Milk Powder': 'தேங்காய் பால் சாம்பார்',
    'Idli Dosa Milagai Podi': 'இட்லி தோசை மிளகாய் பொடி',
    'Dal / Paruppu Podi': 'பருப்பு பொடி',
    'Kothamalli Thugayal Podi': 'கொத்தமல்லி துவையல்',
    'Pudina Thugayal Podi': 'புதினா துவையல் பொடி',
    'Vegetable / Rice Mix Podi': 'காய்கறி / சாத பொடி',
    'Arisi Upma (Tiffin Mix)': 'அரிசி உப்மா (டிபன் மிக்ஸ்)',
    'Arisi Paruppu Sadam (Tiffin Mix)': 'அரிசி பருப்பு சாதம்',
  };

  getTamilName(name: string): string {
    return this.tamilNamesMap[name] || 'பாரம்பரிய பொடி';
  }

  navigateToProduct(slug: string): void {
    window.location.href = `/product/${slug}`;
  }

  scrollToCategorySection(sectionId: string): void {
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
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
      { name: 'Narthangai Kozhambu Powder', tamilName: 'நார்த்தங்காய் குழம்பு' },
    ];
  }
}
