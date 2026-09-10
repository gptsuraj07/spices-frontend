// ============================================================
// ARIDHU — Mock Category Data
// ============================================================

import { Category } from '../models';

const now = new Date().toISOString();

export const CATEGORIES: Category[] = [
  {
    id: 'cat-rasam',
    name: 'Rasam',
    slug: 'rasam',
    description: 'Rasam is the soul of South Indian cooking — a light, aromatic broth that comforts, heals, and delights. Our Rasam collection explores seven unique varieties, each rooted in traditional recipes and crafted from the finest spice blends.',
    shortDescription: 'Traditional South Indian spiced broths — seven unique varieties.',
    imageUrl: null,
    status: 'active',
    displayOrder: 1,
    productCount: 7,
    createdAt: now,
    updatedAt: now,
  },
  {
    id: 'cat-kozhambu',
    name: 'Kozhambu',
    slug: 'kozhambu',
    description: 'Kozhambu is the soul of the South Indian lunch plate — a rich, spiced, tamarind-based gravy that is deeply comforting and endlessly versatile. Our Kozhambu collection brings together seven distinct varieties, each drawing on a different tradition.',
    shortDescription: 'Rich South Indian gravies — bold, tangy, and deeply satisfying.',
    imageUrl: null,
    status: 'active',
    displayOrder: 2,
    productCount: 7,
    createdAt: now,
    updatedAt: now,
  },
  {
    id: 'cat-combos',
    name: 'Combos',
    slug: 'combos',
    description: 'Curated spice collections that bring the full range of South Indian flavours to your kitchen. Our combo boxes make the perfect gift and a great way to explore the depth of traditional spice blending.',
    shortDescription: 'Curated spice collections — perfect for gifting and exploring.',
    imageUrl: null,
    status: 'active',
    displayOrder: 3,
    productCount: 2,
    createdAt: now,
    updatedAt: now,
  },
];
