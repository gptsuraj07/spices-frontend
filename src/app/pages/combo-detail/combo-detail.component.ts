import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ComboService, ComboWithProducts } from '../../core/services/combo.service';
import { CartService } from '../../core/services/cart.service';
import { ToastService } from '../../core/services/toast.service';

export interface RasamDayRitual {
  code: string;
  day: string;
  name: string;
  tagline: string;
  heat: string;
  aroma: string;
  pairing: string;
  description: string;
}

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

  activeDayIndex = 0;
  rasamDays: RasamDayRitual[] = [
    {
      code: 'MON',
      day: 'Monday',
      name: 'Kalyana Rasam Powder',
      tagline: 'Grand Wedding Feast Aroma',
      heat: '🌶️🌶️ Medium Spicy',
      aroma: 'Festive & Aromatic',
      pairing: 'Steaming Ponni rice, A2 ghee & potato roasted fry',
      description: 'The soul of South Indian wedding feasts. Hand-roasted spices ground to a velvety coarse texture.',
    },
    {
      code: 'TUE',
      day: 'Tuesday',
      name: 'Poricha Rasam Powder',
      tagline: 'Wholesome Lentil & Pepper Comfort',
      heat: '🌶️🌶️ Medium Spicy',
      aroma: 'Nutty & Comforting',
      pairing: 'Warm white rice & fried appalam',
      description: 'A comforting lentil-infused Rasam that warms the stomach and eases weeknight digestion.',
    },
    {
      code: 'WED',
      day: 'Wednesday',
      name: 'Cinnamon Rasam Powder',
      tagline: 'Digestive Cinnamon & Cumin Infusion',
      heat: '🌶️🌶️ Medium Spicy',
      aroma: 'Sweet Cinnamon & Earthy Spice',
      pairing: 'Sip hot as an herbal broth or served over hot rice',
      description: 'Infused with sweet Ceylon cinnamon bark and digestives for mid-week immune revitalization.',
    },
    {
      code: 'THU',
      day: 'Thursday',
      name: 'Mor Rasam Powder',
      tagline: 'Cooling Cumin & Curd Comfort',
      heat: '🌶️🌶️ Medium Spicy',
      aroma: 'Cooling & Aromatic',
      pairing: 'Tamarind rice, ghee, or enjoyed straight in a brass tumbler',
      description: 'Crafted with fine cumin and coriander to turn fresh buttermilk into a soothing herbal meal.',
    },
    {
      code: 'FRI',
      day: 'Friday',
      name: 'Ginger Lemon Rasam Powder',
      tagline: 'Zesty Citrus & Ginger Refreshment',
      heat: '🌶️🌶️ Medium Spicy',
      aroma: 'Citrusy & Vibrant',
      pairing: 'Steamed rice, curd rice finish, or crisp vadai',
      description: 'Bright citrus aromas paired with spicy mountain ginger to cleanse the palate on Friday evenings.',
    },
    {
      code: 'SAT',
      day: 'Saturday',
      name: 'Kandathippili Rasam Powder',
      tagline: 'Rare Long Pepper Siddha Herbal Spice',
      heat: '🌶️🌶️ Medium Spicy',
      aroma: 'Rare Herbal & Earthy',
      pairing: 'Hot rice with homemade ghee & roasted kootu',
      description: 'A prized Siddha medicinal blend featuring wild Kandathippili long pepper for weekend rejuvenation.',
    },
    {
      code: 'SUN',
      day: 'Sunday',
      name: 'Kollu Rasam Powder',
      tagline: 'Protein-Rich Nutty Horsegram Comfort',
      heat: '🌶️🌶️ Medium Spicy',
      aroma: 'Nutty & Earthy',
      pairing: 'Sunday family lunch spread with boiled vegetable kootu',
      description: 'Nutritious horsegram (Kollu) roasted to nutty perfection for Sunday family feasts.',
    },
  ];

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

  selectDay(index: number): void {
    this.activeDayIndex = index;
  }

  get activeRitual(): RasamDayRitual {
    return this.rasamDays[this.activeDayIndex];
  }

  get isRasamCombo(): boolean {
    if (!this.combo) return false;
    return this.combo.slug.includes('rasam') || this.combo.name.toLowerCase().includes('rasam');
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
