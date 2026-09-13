// ============================================================
// ARIDHU — Core Data Models
// All TypeScript interfaces for the application
// ============================================================

// ── Category ─────────────────────────────────────────────────
export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  shortDescription: string;
  imageUrl: string | null;
  status: 'active' | 'inactive';
  displayOrder: number;
  productCount?: number;
  createdAt: string;
  updatedAt: string;
}

// ── Product ──────────────────────────────────────────────────
export type ProductStatus = 'active' | 'inactive' | 'out_of_stock';
export type ProductBadge = 'popular' | 'new' | 'best_seller' | 'limited' | null;

export interface ProductRecipe {
  title?: string;
  prepTime?: string;
  cookTime?: string;
  servings?: string;
  ingredients?: string[];
  instructions?: string[];
  tips?: string;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  subtitle?: string;
  categoryId: string;
  categorySlug?: string;
  category?: Category;
  description: string;
  shortDescription: string;
  price: number;
  originalPrice?: number;
  compareAtPrice: number | null;
  weight: number;            // in grams
  weightUnit: 'g' | 'kg';
  sku: string;
  stock: number;
  inStock?: boolean;
  imageUrl: string | null;
  imagePosition?: string | null;
  imageFit?: 'contain' | 'cover' | 'fill' | null;
  imageScale?: number | null;
  gallery: string[];
  status: ProductStatus;
  featured: boolean;
  badge: ProductBadge;
  ingredients: string | null;
  usage: string | null;
  storage: string | null;
  recipe?: ProductRecipe | null;
  tags: string[];
  rating: number | null;
  reviewCount: number;
  createdAt: string;
  updatedAt: string;
}

// ── Combo ────────────────────────────────────────────────────
export interface ComboProduct {
  productId: string;
  product?: Product;
  quantity: number;
  displayOrder: number;
}

export interface Combo {
  id: string;
  name: string;
  slug: string;
  description: string;
  shortDescription: string;
  price: number;
  compareAtPrice: number | null;
  savings?: number;
  imageUrl: string | null;
  gallery: string[];
  comboProducts: ComboProduct[];
  status: 'active' | 'inactive';
  featured: boolean;
  badge: ProductBadge;
  tags: string[];
  rating: number | null;
  reviewCount: number;
  createdAt: string;
  updatedAt: string;
}

// ── Cart ─────────────────────────────────────────────────────
export type CartItemType = 'product' | 'combo';

export interface CartItem {
  id: string;              // cart item id (uuid)
  itemId: string;          // product or combo id
  itemType: CartItemType;
  name: string;
  slug: string;
  imageUrl: string | null;
  price: number;
  quantity: number;
  weight: number | null;   // null for combos
  categoryId: string | null;
  addedAt: string;
}

export interface Cart {
  items: CartItem[];
  couponCode: string | null;
  discountAmount: number;
  createdAt: string;
  updatedAt: string;
}

export interface CartSummary {
  subtotal: number;
  discount: number;
  shipping: number;
  total: number;
  itemCount: number;
  isFreeShipping: boolean;
  minOrderValue: number;
  minOrderMet: boolean;
}

// ── Address ──────────────────────────────────────────────────
export interface Address {
  id?: string;
  name: string;
  phone: string;
  line1: string;
  line2: string;
  city: string;
  state: string;
  pincode: string;
  country: string;
  isDefault?: boolean;
}

// ── Customer ─────────────────────────────────────────────────
export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  addresses: Address[];
  createdAt: string;
}

// ── Order ────────────────────────────────────────────────────

/** Full order status enum — drives both customer timeline and admin workflow */
export type OrderStatus =
  | 'ORDER_PLACED'
  | 'PAYMENT_VERIFICATION'
  | 'PAYMENT_CONFIRMED'
  | 'PROCESSING'
  | 'SHIPPED'
  | 'OUT_FOR_DELIVERY'
  | 'DELIVERED'
  | 'PAYMENT_FAILED'
  | 'CANCELLED';

/** Payment status — separate from order status */
export type PaymentStatus =
  | 'PENDING_VERIFICATION'
  | 'PAID'
  | 'FAILED'
  | 'REFUNDED';

/** One entry in the status timeline — append-only, never mutated */
export interface StatusHistoryEntry {
  status: OrderStatus;
  timestamp: string;       // ISO-8601
  note?: string;           // customer-facing note
  adminNote?: string;      // admin-only note
}

/** Shipping/fulfillment details set when order is SHIPPED */
export interface FulfillmentDetails {
  provider?: string;         // e.g. "DTDC", "BlueDart", "Speed Post"
  trackingNumber?: string;
  shippedAt?: string;        // ISO-8601
  deliveredAt?: string;      // ISO-8601
}

/** UPI payment details */
export interface PaymentDetails {
  method: string;                    // "UPI"
  status: PaymentStatus;
  utrNumber?: string;                // Customer-submitted UTR / Transaction ID
  verifiedAt?: string;               // ISO-8601, set by admin
  verifiedBy?: string;               // Admin name/id
}

export interface OrderItem {
  itemId: string;
  itemType: CartItemType;
  name: string;
  imageUrl: string | null;
  price: number;
  quantity: number;
  subtotal: number;
}

export interface Order {
  id: string;
  orderNumber: string;        // ARU-YYYYMMDD-XXXX
  customerId: string | null;
  customer: {
    name: string;
    email: string;
    phone: string;
  };
  shippingAddress: Address;
  items: OrderItem[];
  subtotal: number;
  discount: number;
  shipping: number;
  total: number;
  couponCode: string | null;
  status: OrderStatus;
  payment: PaymentDetails;
  fulfillment: FulfillmentDetails;
  statusHistory: StatusHistoryEntry[];
  adminNotes?: string;
  notes: string | null;
  createdAt: string;
  updatedAt: string;

  // ── Legacy compat (old orders stored with flat fields) ──
  paymentStatus?: string;
  paymentMethod?: string;
}

// ── Search ───────────────────────────────────────────────────
export type SearchResultType = 'product' | 'combo' | 'category';

export interface SearchResult {
  id: string;
  type: SearchResultType;
  name: string;
  slug: string;
  imageUrl: string | null;
  price?: number;
  categoryName?: string;
}

// ── Admin ────────────────────────────────────────────────────
export interface AdminStats {
  totalProducts: number;
  activeProducts: number;
  totalCategories: number;
  totalCombos: number;
  totalOrders: number;
  pendingOrders: number;
  lowStockProducts: number;
}

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: 'super_admin' | 'admin' | 'editor';
  createdAt: string;
}

// ── Pagination ───────────────────────────────────────────────
export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  perPage: number;
  totalPages: number;
}

// ── Filter / Sort ────────────────────────────────────────────
export interface ProductFilter {
  categoryId?: string;
  minPrice?: number;
  maxPrice?: number;
  weight?: number;
  status?: ProductStatus;
  featured?: boolean;
  search?: string;
}

export type SortOption =
  | 'featured'
  | 'price_asc'
  | 'price_desc'
  | 'newest'
  | 'name_asc';

// ── Toast ────────────────────────────────────────────────────
export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface Toast {
  id: string;
  type: ToastType;
  message: string;
  duration?: number;
}

// ── Media / R2 ───────────────────────────────────────────────
export interface MediaUploadRequest {
  file: File;
  folder: string; // e.g. 'products', 'categories', 'combos'
  filename?: string;
}

export interface MediaUploadResponse {
  url: string;
  key: string;
  contentType: string;
  size: number;
}

// ── Order Helpers ─────────────────────────────────────────────

/** Human-readable label for each order status */
export const ORDER_STATUS_LABEL: Record<OrderStatus, string> = {
  ORDER_PLACED:          'Order Placed',
  PAYMENT_VERIFICATION:  'Payment Verification',
  PAYMENT_CONFIRMED:     'Payment Confirmed',
  PROCESSING:            'Processing',
  SHIPPED:               'Shipped',
  OUT_FOR_DELIVERY:      'Out for Delivery',
  DELIVERED:             'Delivered',
  PAYMENT_FAILED:        'Payment Failed',
  CANCELLED:             'Cancelled',
};

/** Customer-friendly message for the current status */
export const ORDER_STATUS_MESSAGE: Record<OrderStatus, string> = {
  ORDER_PLACED:         'Your order has been received! We\'re waiting for your payment to be verified.',
  PAYMENT_VERIFICATION: 'Your payment is being verified by our team. This usually takes 1–2 hours.',
  PAYMENT_CONFIRMED:    'Payment confirmed! Your order is now queued for processing.',
  PROCESSING:           'Your spices are being carefully packed and prepared for dispatch.',
  SHIPPED:              'Your order is on its way! Track using the details below.',
  OUT_FOR_DELIVERY:     'Your order is out for delivery today. Please keep your phone handy.',
  DELIVERED:            'Your order has been delivered. Enjoy your spices!',
  PAYMENT_FAILED:       'Your payment could not be verified. Please contact us to resolve.',
  CANCELLED:            'This order has been cancelled. Please contact us for any queries.',
};

/** Ordered list of "main" statuses shown in the customer timeline */
export const ORDER_TIMELINE_STEPS: OrderStatus[] = [
  'ORDER_PLACED',
  'PAYMENT_CONFIRMED',
  'PROCESSING',
  'SHIPPED',
  'DELIVERED',
];
