// ============================================================
// ARIDHU — Mock Combo Data
// ============================================================

import { Combo } from '../models';

const now = new Date().toISOString();

export const COMBOS: Combo[] = [
  {
    id: 'combo-001',
    name: '7 Rasam Collection',
    slug: '7-rasam-collection',
    description: 'Seven unique Rasam blends, each crafted from a distinct traditional recipe, brought together in one thoughtfully curated collection (50g packet each). This is the complete Aridhu Rasam experience — from the bold warmth of Milagu to the rare character of Kandathippili, from the comfort of Kalyana to the brightness of Ginger Lemon.\n\nPerfect for the South Indian cooking enthusiast, as a gift for a food-loving family, or simply to bring the full spectrum of Rasam into your own kitchen.',
    shortDescription: 'The complete Aridhu Rasam experience — all 7 varieties (50g each) in one collection.',
    price: 350,
    compareAtPrice: null,
    imageUrl: '/assets/aridhu-rasam-hero.jpg',
    gallery: ['/assets/aridhu-rasam-hero.jpg'],
    comboProducts: [
      { productId: 'rasam-001', quantity: 1, displayOrder: 1 },
      { productId: 'rasam-002', quantity: 1, displayOrder: 2 },
      { productId: 'rasam-003', quantity: 1, displayOrder: 3 },
      { productId: 'rasam-004', quantity: 1, displayOrder: 4 },
      { productId: 'rasam-005', quantity: 1, displayOrder: 5 },
      { productId: 'rasam-006', quantity: 1, displayOrder: 6 },
      { productId: 'rasam-007', quantity: 1, displayOrder: 7 },
    ],
    status: 'active',
    featured: true,
    badge: 'best_seller',
    tags: ['rasam', 'collection', 'gift', 'combo', 'complete set'],
    rating: 5.0,
    reviewCount: 28,
    createdAt: now,
    updatedAt: now,
  },
  {
    id: 'combo-002',
    name: '7 Kozhambu Collection',
    slug: '7-kozhambu-collection',
    description: 'Seven distinct Kozhambu blends exploring the rich landscape of South Indian gravy traditions (50g packet each). From Vatha Kuzhambu and Ennai Kathirikai to cooling Mor Kuzhambu, Talaga Kuzhambu, Vendaya Vendaikai, Kootu Kuzhambu, and unique Narthangai — this collection brings the full depth of Kozhambu cooking to your kitchen.',
    shortDescription: 'Seven traditional Kozhambu blends (50g each) — the complete South Indian gravy collection.',
    price: 350,
    compareAtPrice: null,
    imageUrl: '/assets/aridhu-kuzhambu-hero.jpg',
    gallery: ['/assets/aridhu-kuzhambu-hero.jpg'],
    comboProducts: [
      { productId: 'koz-001', quantity: 1, displayOrder: 1 },
      { productId: 'koz-002', quantity: 1, displayOrder: 2 },
      { productId: 'koz-003', quantity: 1, displayOrder: 3 },
      { productId: 'koz-004', quantity: 1, displayOrder: 4 },
      { productId: 'koz-005', quantity: 1, displayOrder: 5 },
      { productId: 'koz-006', quantity: 1, displayOrder: 6 },
      { productId: 'koz-007', quantity: 1, displayOrder: 7 },
    ],
    status: 'active',
    featured: true,
    badge: 'popular',
    tags: ['kozhambu', 'collection', 'gift', 'combo', 'complete set'],
    rating: 4.9,
    reviewCount: 22,
    createdAt: now,
    updatedAt: now,
  },
];
