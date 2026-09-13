// ============================================================
// ARIDHU — Mock Category Data
// ============================================================

import { Category } from '../models';

const now = new Date().toISOString();

export const CATEGORIES: Category[] = [
  {
    id: 'cat-kozhambu',
    name: 'Kozhambu Powders',
    slug: 'kozhambu',
    description: 'Kuzhambu is the heart of South Indian lunch — rich, spiced tamarind and coconut gravies. Our Kozhambu collection features 7 authentic traditional varieties.',
    shortDescription: 'Rich South Indian gravies — 7 authentic varieties.',
    imageUrl: '/assets/aridhu-kuzhambu-hero.jpg',
    status: 'active',
    displayOrder: 1,
    productCount: 7,
    createdAt: now,
    updatedAt: now,
  },
  {
    id: 'cat-rasam',
    name: 'Rasam Powders',
    slug: 'rasam',
    description: 'Rasam is the soul of South Indian cooking — a light, aromatic broth that comforts, heals, and delights. Our Rasam collection explores seven unique varieties.',
    shortDescription: 'Traditional South Indian spiced broths — 7 unique varieties.',
    imageUrl: '/assets/aridhu-rasam-hero.jpg',
    status: 'active',
    displayOrder: 2,
    productCount: 7,
    createdAt: now,
    updatedAt: now,
  },
  {
    id: 'cat-sambar',
    name: 'Sambar Powders',
    slug: 'sambar',
    description: 'Authentic Chennai & South Indian Sambar spice blends slow-roasted for rich lentil and vegetable stews.',
    shortDescription: 'Authentic South Indian Sambar spice blends.',
    imageUrl: null,
    status: 'active',
    displayOrder: 3,
    productCount: 2,
    createdAt: now,
    updatedAt: now,
  },
  {
    id: 'cat-tiffin',
    name: 'Tiffin Mixes & Podis',
    slug: 'tiffin-mixes',
    description: 'Artisanal tiffin podis, thugayals, and quick tiffin rice mixes for Idli, Dosa, Upma, and rice.',
    shortDescription: 'Tiffin Podis, Thugayals, and Rice Mixes.',
    imageUrl: null,
    status: 'active',
    displayOrder: 4,
    productCount: 7,
    createdAt: now,
    updatedAt: now,
  },
  {
    id: 'cat-combos',
    name: 'Combos',
    slug: 'combos',
    description: 'Curated spice collections that bring the full range of South Indian flavours to your kitchen. Our combo boxes make the perfect gift.',
    shortDescription: 'Curated signature spice collection boxes.',
    imageUrl: null,
    status: 'active',
    displayOrder: 5,
    productCount: 2,
    createdAt: now,
    updatedAt: now,
  },
];

