import { Component, OnInit } from '@angular/core';
import { Product, Combo, Category } from '../../core/models';
import { ProductService } from '../../core/services/product.service';
import { ComboService } from '../../core/services/combo.service';
import { CategoryService } from '../../core/services/category.service';
import { CartService } from '../../core/services/cart.service';
import { ToastService } from '../../core/services/toast.service';

export interface RasamDayRitual {
  code: string;
  day: string;
  name: string;
  tamilName: string;
  tagline: string;
  slug: string;
  productId: string;
  ingredients: { name: string; icon: string }[];
  heat: string;
  aroma: string;
  pairing: string;
  description: string;
}

export interface CraftStep {
  number: string;
  title: string;
  desc: string;
  icon: string;
}

@Component({
  selector: 'app-home',
  standalone: false,
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  rasam_products: Product[] = [];
  kozhambu_products: Product[] = [];
  sambar_products: Product[] = [];
  tiffin_products: Product[] = [];
  all_products: Product[] = [];
  combos: Combo[] = [];
  categories: Category[] = [];
  loading = true;
  addingRitual = false;
  addingComboId: string | null = null;

  // Active Category Filter
  selectedFilter: 'all' | 'kozhambu' | 'rasam' | 'sambar' | 'tiffin' = 'all';

  // Interactive 7-Day Rasam Ritual
  activeDayIndex = 0;
  rasamDays: RasamDayRitual[] = [
    {
      code: 'MON',
      day: 'Monday',
      name: 'Kalyana Rasam Powder',
      tamilName: '',
      tagline: 'Grand Wedding Feast Aroma',
      slug: 'kalyana-rasam-powder',
      productId: 'rasam-001',
      ingredients: [
        { name: 'Salem Coriander', icon: '🌿' },
        { name: 'Guntur Red Chilli', icon: '🌶️' },
        { name: 'Tellicherry Pepper', icon: '⚫' },
        { name: 'Pure Asafoetida', icon: '✨' },
      ],
      heat: '🌶️🌶️ Medium Spicy',
      aroma: 'Festive & Aromatic',
      pairing: 'Steaming Ponni rice, A2 ghee & potato roasted fry',
      description: 'The soul of South Indian wedding feasts. Hand-roasted spices ground to a velvety coarse texture.',
    },
    {
      code: 'TUE',
      day: 'Tuesday',
      name: 'Poricha Rasam Powder',
      tamilName: '',
      tagline: 'Wholesome Lentil & Pepper Comfort',
      slug: 'poricha-rasam-powder',
      productId: 'rasam-007',
      ingredients: [
        { name: 'Toor Dal', icon: '🌾' },
        { name: 'Cumin Seeds', icon: '🌱' },
        { name: 'Crushed Pepper', icon: '⚫' },
        { name: 'Dry Coconut', icon: '🥥' },
      ],
      heat: '🌶️🌶️ Medium Spicy',
      aroma: 'Nutty & Comforting',
      pairing: 'Warm white rice & fried appalam',
      description: 'A comforting lentil-infused Rasam that warms the stomach and eases weeknight digestion.',
    },
    {
      code: 'WED',
      day: 'Wednesday',
      name: 'Cinnamon Rasam Powder',
      tamilName: '',
      tagline: 'Digestive Cinnamon & Cumin Infusion',
      slug: 'cinnamon-rasam-powder',
      productId: 'rasam-005',
      ingredients: [
        { name: 'Ceylon Cinnamon', icon: '🪵' },
        { name: 'Salem Cumin', icon: '🌱' },
        { name: 'Tellicherry Pepper', icon: '⚫' },
        { name: 'Dry Ginger', icon: '🫚' },
      ],
      heat: '🌶️🌶️ Medium Spicy',
      aroma: 'Sweet Cinnamon & Earthy Spice',
      pairing: 'Sip hot as an herbal broth or served over hot rice',
      description: 'Infused with sweet Ceylon cinnamon bark and digestives for mid-week immune revitalization.',
    },
    {
      code: 'THU',
      day: 'Thursday',
      name: 'Mor Rasam Powder',
      tamilName: '',
      tagline: 'Cooling Cumin & Curd Comfort',
      slug: 'mor-rasam-powder',
      productId: 'rasam-003',
      ingredients: [
        { name: 'Cumin Seeds', icon: '🌱' },
        { name: 'Curry Leaves', icon: '🍃' },
        { name: 'Roasted Coriander', icon: '🌿' },
        { name: 'Mustard Seeds', icon: '🟡' },
      ],
      heat: '🌶️🌶️ Medium Spicy',
      aroma: 'Cooling & Aromatic',
      pairing: 'Tamarind rice, ghee, or enjoyed straight in a brass tumbler',
      description: 'Crafted with fine cumin and coriander to turn fresh buttermilk into a soothing herbal meal.',
    },
    {
      code: 'FRI',
      day: 'Friday',
      name: 'Ginger Lemon Rasam Powder',
      tamilName: '',
      tagline: 'Zesty Citrus & Ginger Refreshment',
      slug: 'ginger-lemon-rasam-powder',
      productId: 'rasam-002',
      ingredients: [
        { name: 'Fresh Lemon Zest', icon: '🍋' },
        { name: 'Mountain Ginger', icon: '🫚' },
        { name: 'Alleppey Turmeric', icon: '🟡' },
        { name: 'Curry Leaves', icon: '🍃' },
      ],
      heat: '🌶️🌶️ Medium Spicy',
      aroma: 'Citrusy & Vibrant',
      pairing: 'Steamed rice, curd rice finish, or crisp vadai',
      description: 'Bright citrus aromas paired with spicy mountain ginger to cleanse the palate on Friday evenings.',
    },
    {
      code: 'SAT',
      day: 'Saturday',
      name: 'Kandathippili Rasam Powder',
      tamilName: '',
      tagline: 'Rare Long Pepper Siddha Herbal Spice',
      slug: 'kandathippili-rasam-powder',
      productId: 'rasam-004',
      ingredients: [
        { name: 'Wild Long Pepper Stem', icon: '🌾' },
        { name: 'Coriander Seeds', icon: '🌿' },
        { name: 'Red Chillies', icon: '🌶️' },
        { name: 'Dry Ginger', icon: '🫚' },
      ],
      heat: '🌶️🌶️ Medium Spicy',
      aroma: 'Rare Herbal & Earthy',
      pairing: 'Hot rice with homemade ghee & roasted kootu',
      description: 'A prized Siddha medicinal blend featuring wild Kandathippili long pepper for weekend rejuvenation.',
    },
    {
      code: 'SUN',
      day: 'Sunday',
      name: 'Kollu Rasam Powder',
      tamilName: '',
      tagline: 'Protein-Rich Nutty Horsegram Comfort',
      slug: 'kollu-rasam-powder',
      productId: 'rasam-006',
      ingredients: [
        { name: 'Roasted Horsegram', icon: '🌾' },
        { name: 'Cumin Seeds', icon: '🌱' },
        { name: 'Pepper Pods', icon: '⚫' },
        { name: 'Garlic Flakes', icon: '🧄' },
      ],
      heat: '🌶️🌶️ Medium Spicy',
      aroma: 'Nutty & Earthy',
      pairing: 'Sunday family lunch spread with boiled vegetable kootu',
      description: 'Nutritious horsegram (Kollu) roasted to nutty perfection for Sunday family feasts.',
    },
  ];

  // Craft Process Steps
  craftSteps: CraftStep[] = [
    {
      number: '01',
      title: 'Hand-Selected Whole Spices',
      desc: 'Sourced directly from heritage spice gardens in Guntur, Salem, and Alleppey to ensure peak oil content.',
      icon: '🌿',
    },
    {
      number: '02',
      title: 'Slow-Flame Kadai Roasting',
      desc: 'Slow roasted on low flame in heavy kadais to gently release volatile aromatic oils.',
      icon: '🔥',
    },
    {
      number: '03',
      title: 'Coarse Hand-Pounding',
      desc: 'Coarsely crushed in traditional mortars—preserving texture without high-heat machine burning.',
      icon: '🪨',
    },
    {
      number: '04',
      title: 'Aroma-Sealed Small Batches',
      desc: 'Packed within 24 hours of pounding in multi-layer foil pouches for maximum kitchen freshness.',
      icon: '📦',
    },
  ];

  constructor(
    private productService: ProductService,
    private comboService: ComboService,
    private categoryService: CategoryService,
    private cartService: CartService,
    private toastService: ToastService,
  ) {}

  ngOnInit(): void {
    this.categoryService.getActive().subscribe(cats => {
      this.categories = cats;
    });

    this.productService.getAll().subscribe(allProducts => {
      this.all_products = allProducts;
      this.rasam_products = allProducts.filter(p => p.categoryId === 'cat-rasam');
      this.kozhambu_products = allProducts.filter(p => p.categoryId === 'cat-kozhambu');
      this.sambar_products = allProducts.filter(p => p.categoryId === 'cat-sambar');
      this.tiffin_products = allProducts.filter(p => p.categoryId === 'cat-tiffin');
      this.loading = false;
    });

    this.comboService.getActive().subscribe(combos => {
      this.combos = combos;
    });
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

  selectDay(index: number): void {
    this.activeDayIndex = index;
  }

  setFilter(filter: 'all' | 'kozhambu' | 'rasam' | 'sambar' | 'tiffin'): void {
    this.selectedFilter = filter;
  }

  get filteredProducts(): Product[] {
    if (this.selectedFilter === 'rasam') return this.rasam_products;
    if (this.selectedFilter === 'kozhambu') return this.kozhambu_products;
    if (this.selectedFilter === 'sambar') return this.sambar_products;
    if (this.selectedFilter === 'tiffin') return this.tiffin_products;
    return this.all_products;
  }

  get activeRitual(): RasamDayRitual {
    return this.rasamDays[this.activeDayIndex];
  }

  get activeRitualProduct(): Product | undefined {
    return this.rasam_products.find(p => p.slug === this.activeRitual.slug || p.id === this.activeRitual.productId);
  }

  addRitualToCart(): void {
    const prod = this.activeRitualProduct;
    if (!prod || this.addingRitual) return;
    this.addingRitual = true;

    this.cartService.addItem({
      itemId: prod.id,
      itemType: 'product',
      name: prod.name,
      slug: prod.slug,
      imageUrl: prod.imageUrl,
      price: prod.price,
      quantity: 1,
      weight: prod.weight,
      categoryId: prod.categoryId,
    });

    this.toastService.success(`${prod.name} added to cart!`);
    setTimeout(() => {
      this.addingRitual = false;
    }, 600);
  }
}
