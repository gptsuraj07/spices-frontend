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
  tamilTitle: string;
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
  all_products: Product[] = [];
  combos: Combo[] = [];
  categories: Category[] = [];
  loading = true;
  addingRitual = false;
  addingComboId: string | null = null;

  // Active Category Filter: 'all' | 'rasam' | 'kozhambu'
  selectedFilter: 'all' | 'rasam' | 'kozhambu' = 'all';

  // Interactive 7-Day Rasam Ritual
  activeDayIndex = 0;
  rasamDays: RasamDayRitual[] = [
    {
      code: 'MON',
      day: 'Monday',
      name: 'Kalyana Rasam Powder',
      tamilName: 'கல்யாண ரசம்',
      tagline: 'Grand Wedding Feast Aroma',
      slug: 'kalyana-rasam-powder',
      productId: 'rasam-001',
      ingredients: [
        { name: 'Salem Coriander', icon: '🌿' },
        { name: 'Guntur Red Chilli', icon: '🌶️' },
        { name: 'Tellicherry Pepper', icon: '⚫' },
        { name: 'Pure Asafoetida', icon: '✨' },
      ],
      heat: '🌶️🌶️ Medium Heat',
      aroma: 'Festive & Aromatic',
      pairing: 'Steaming Ponni rice, A2 ghee & potato roasted fry',
      description: 'The soul of Tanjore wedding feasts. Hand-roasted spices ground to a velvety coarse texture.',
    },
    {
      code: 'TUE',
      day: 'Tuesday',
      name: 'Poricha Rasam Powder',
      tamilName: 'பொரிச்ச ரசம்',
      tagline: 'Wholesome Lentil & Pepper Comfort',
      slug: 'poricha-rasam-powder',
      productId: 'rasam-006',
      ingredients: [
        { name: 'Toor Dal', icon: '🌾' },
        { name: 'Cumin Seeds', icon: '🌱' },
        { name: 'Crushed Pepper', icon: '⚫' },
        { name: 'Dry Coconut', icon: '🥥' },
      ],
      heat: '🌶️ Mild Heat',
      aroma: 'Nutty & Comforting',
      pairing: 'Warm white rice & fried appalam',
      description: 'A comforting lentil-infused Rasam that warms the stomach and eases weeknight digestion.',
    },
    {
      code: 'WED',
      day: 'Wednesday',
      name: 'Cinnamon Rasam Powder',
      tamilName: 'இலவங்கப்பட்டை ரசம்',
      tagline: 'Digestive Cinnamon & Cumin Infusion',
      slug: 'cinnamon-rasam-powder',
      productId: 'rasam-005',
      ingredients: [
        { name: 'Ceylon Cinnamon', icon: '🪵' },
        { name: 'Salem Cumin', icon: '🌱' },
        { name: 'Tellicherry Pepper', icon: '⚫' },
        { name: 'Dry Ginger', icon: '🫚' },
      ],
      heat: '🌶️ Mild Heat',
      aroma: 'Sweet Cinnamon & Earthy Spice',
      pairing: 'Sip hot as an herbal broth or served over hot rice',
      description: 'Infused with sweet Ceylon cinnamon bark and digestives for mid-week immune revitalization.',
    },
    {
      code: 'THU',
      day: 'Thursday',
      name: 'Milagu Rasam Powder',
      tamilName: 'தாளித்த மிளகு ரசம்',
      tagline: 'Immunity-Boosting Black Pepper Heat',
      slug: 'milagu-rasam-powder',
      productId: 'rasam-002',
      ingredients: [
        { name: 'Malabar Black Pepper', icon: '⚫' },
        { name: 'Country Garlic', icon: '🧄' },
        { name: 'Tamarind Pulp', icon: '🍯' },
        { name: 'Mustard Seeds', icon: '🟡' },
      ],
      heat: '🌶️🌶️🌶️ Fiery Heat',
      aroma: 'Pungent & Deeply Warming',
      pairing: 'Tamarind rice, ghee, or enjoyed straight in a brass tumbler',
      description: 'Crafted from coarse Malabar black peppercorns—traditional South Indian cold & cough defense.',
    },
    {
      code: 'FRI',
      day: 'Friday',
      name: 'Ginger Lemon Rasam Powder',
      tamilName: 'இஞ்சி எலுமிச்சை ரசம்',
      tagline: 'Zesty Citrus & Ginger Refreshment',
      slug: 'ginger-lemon-rasam-powder',
      productId: 'rasam-007',
      ingredients: [
        { name: 'Fresh Lemon Zest', icon: '🍋' },
        { name: 'Mountain Ginger', icon: '🫚' },
        { name: 'Alleppey Turmeric', icon: '🟡' },
        { name: 'Curry Leaves', icon: '🍃' },
      ],
      heat: '🌶️🌶️ Medium Heat',
      aroma: 'Citrusy & Vibrant',
      pairing: 'Steamed rice, curd rice finish, or crisp vadai',
      description: 'Bright citrus aromas paired with spicy mountain ginger to cleanse the palate on Friday evenings.',
    },
    {
      code: 'SAT',
      day: 'Saturday',
      name: 'Kandathippili Rasam Powder',
      tamilName: 'கண்டதிப்பிலி ரசம்',
      tagline: 'Rare Long Pepper Siddha Herbal Spice',
      slug: 'kandathippili-rasam-powder',
      productId: 'rasam-003',
      ingredients: [
        { name: 'Wild Long Pepper', icon: '🌾' },
        { name: 'Coriander Seeds', icon: '🌿' },
        { name: 'Red Chillies', icon: '🌶️' },
        { name: 'Dry Ginger', icon: '🫚' },
      ],
      heat: '🌶️🌶️ Medium Heat',
      aroma: 'Rare Herbal & Earthy',
      pairing: 'Hot rice with homemade ghee & roasted kootu',
      description: 'A prized Siddha medicinal blend featuring wild Kandathippili long pepper for weekend rejuvenation.',
    },
    {
      code: 'SUN',
      day: 'Sunday',
      name: 'Kollu Rasam Powder',
      tamilName: 'கொள்ளு ரசம்',
      tagline: 'Protein-Rich Nutty Horsegram Comfort',
      slug: 'kollu-rasam-powder',
      productId: 'rasam-004',
      ingredients: [
        { name: 'Roasted Horsegram', icon: '🌾' },
        { name: 'Cumin Seeds', icon: '🌱' },
        { name: 'Pepper Pods', icon: '⚫' },
        { name: 'Garlic Flakes', icon: '🧄' },
      ],
      heat: '🌶️ Mild Heat',
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
      tamilTitle: 'உயர்தர நறுமண பொருட்கள்',
      desc: 'Sourced directly from heritage spice gardens in Guntur, Salem, and Alleppey to ensure peak oil content.',
      icon: '🌿',
    },
    {
      number: '02',
      title: 'Iron-Kadai Slow Roasting',
      tamilTitle: 'இரும்பு கடாய் வறுவல்',
      desc: 'Slow roasted on low flame in heavy cast-iron kadais to gently release volatile aromatic oils.',
      icon: '🔥',
    },
    {
      number: '03',
      title: 'Coarse Stone Pounding',
      tamilTitle: 'பாரம்பரிய கல் இடித்தல்',
      desc: 'Coarsely crushed in traditional stone mortars—preserving texture without high-heat machine burning.',
      icon: '🪨',
    },
    {
      number: '04',
      title: 'Aroma-Sealed Small Batches',
      tamilTitle: 'நறுமணம் மாறாத பேக்கிங்',
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

    this.productService.getByCategory('cat-rasam').subscribe(rasamProducts => {
      this.rasam_products = rasamProducts;
      this.productService.getByCategory('cat-kozhambu').subscribe(kozhambuProducts => {
        this.kozhambu_products = kozhambuProducts;
        this.all_products = [...this.rasam_products, ...this.kozhambu_products];
        this.loading = false;
      });
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

  setFilter(filter: 'all' | 'rasam' | 'kozhambu'): void {
    this.selectedFilter = filter;
  }

  get filteredProducts(): Product[] {
    if (this.selectedFilter === 'rasam') return this.rasam_products;
    if (this.selectedFilter === 'kozhambu') return this.kozhambu_products;
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
