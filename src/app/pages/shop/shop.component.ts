import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Product, Category, ProductFilter, SortOption, Combo } from '../../core/models';
import { ProductService } from '../../core/services/product.service';
import { CategoryService } from '../../core/services/category.service';
import { ComboService } from '../../core/services/combo.service';
import { CartService } from '../../core/services/cart.service';
import { ToastService } from '../../core/services/toast.service';
import { ALL_PRODUCTS } from '../../core/data/products.mock';
import { environment } from '../../../environments/environment';

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

  // Quantity State per Product
  productQuantities: Record<string, number> = {};

  getQuantity(productId: string): number {
    return this.productQuantities[productId] || 1;
  }

  incrementQuantity(productId: string, event: Event): void {
    event.stopPropagation();
    const qty = this.getQuantity(productId);
    if (qty < 99) {
      this.productQuantities[productId] = qty + 1;
    }
  }

  decrementQuantity(productId: string, event: Event): void {
    event.stopPropagation();
    const qty = this.getQuantity(productId);
    if (qty > 1) {
      this.productQuantities[productId] = qty - 1;
    }
  }

  quickAddProduct(product: Product, event: Event): void {
    event.stopPropagation();
    if (this.addingProductId) return;
    this.addingProductId = product.id;

    const qty = this.getQuantity(product.id);

    this.cartService.addItem({
      itemId: product.id,
      itemType: 'product',
      name: product.name,
      slug: product.slug,
      imageUrl: product.imageUrl,
      price: product.price,
      quantity: qty,
      weight: product.weight,
      categoryId: product.categoryId,
    });

    this.toastService.success(`${product.name} (x${qty}) added to cart!`);
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

  private get currentProductCatalog(): Product[] {
    return (this.products && this.products.length > 0) ? this.products : this.allCatalogProducts;
  }

  get productsByKozhambu(): Product[] {
    return this.currentProductCatalog.filter(p => p.categoryId === 'cat-kozhambu' || p.categorySlug === 'kozhambu');
  }

  get productsByRasam(): Product[] {
    return this.currentProductCatalog.filter(p => p.categoryId === 'cat-rasam' || p.categorySlug === 'rasam');
  }

  get productsBySambar(): Product[] {
    return this.currentProductCatalog.filter(p => p.categoryId === 'cat-sambar' || p.categorySlug === 'sambar');
  }

  get productsByTiffin(): Product[] {
    return this.currentProductCatalog.filter(p => p.categoryId === 'cat-tiffin' || p.categorySlug === 'tiffin-mixes' || p.categorySlug === 'tiffin');
  }

  getImageUrl(url: string | null | undefined): string | null {
    if (!url || !url.trim()) return null;
    if (url.startsWith('http://') || url.startsWith('https://')) return url;
    if (url.startsWith('/assets/')) return url;
    if (url.startsWith('/uploads/')) {
      const base = environment.apiUrl.replace(/\/api\/?$/, '');
      return `${base}${url}`;
    }
    return url;
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
      { name: 'Narthangai Kozhambu Powder' },
    ];
  }
}
