
import { Product, Category } from './types';

export const PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'Inabel Blanket - Binakol Pattern',
    price: 2500,
    description: 'Handwoven by master weavers in Paoay. The Binakol pattern is known for its dizzying, psychedelic optical illusion design, believed to ward off evil spirits.',
    category: Category.WEAVING,
    image: 'https://picsum.photos/id/1025/600/600', // Texture resembling fabric
    rating: 4.9,
    reviews: 124,
    artisan: 'Lola Magdalena Weavers'
  },
  {
    id: '2',
    name: 'Traditional Burnay Jar (Medium)',
    price: 1800,
    description: 'Authentic earthenware jar from Vigan. Traditionally used for fermenting Basi (sugarcane wine), vinegar, and bagoong (fish paste).',
    category: Category.POTTERY,
    image: 'https://picsum.photos/id/112/600/600', // Texture resembling clay/earth
    rating: 4.8,
    reviews: 89,
    artisan: 'Vigan Clay Masters'
  },
  {
    id: '3',
    name: 'Special Bagnet (500g)',
    price: 450,
    description: 'The famous Ilocano deep-fried crispy pork belly. Vacuum-sealed to ensure freshness upon delivery. Best served with KBL (Kamatis, Bagoong, Lasona).',
    category: Category.DELICACY,
    image: 'https://picsum.photos/id/292/600/600', // Food related
    rating: 5.0,
    reviews: 342,
    artisan: 'Manang Fe Delicacies'
  },
  {
    id: '4',
    name: 'Abel Iloco Table Runner',
    price: 850,
    description: 'Add a touch of Ilocano heritage to your dining table. Features intricate geometric patterns in deep blue and cream threads.',
    category: Category.WEAVING,
    image: 'https://picsum.photos/id/204/600/600',
    rating: 4.7,
    reviews: 56,
    artisan: 'Paoay Loom Weavers'
  },
  {
    id: '5',
    name: 'Chichacorn (Garlic Flavor)',
    price: 120,
    description: 'Crunchy corn kernels fried to perfection with aromatic garlic. A popular pasalubong from Paoay.',
    category: Category.DELICACY,
    image: 'https://picsum.photos/id/75/600/600',
    rating: 4.6,
    reviews: 210,
    artisan: 'Norte Snacks'
  },
  {
    id: '6',
    name: 'Mini Burnay Planter Set',
    price: 1200,
    description: 'A set of 3 miniature burnay jars repurposed as succulents planters. Perfect for modern homes looking for a rustic touch.',
    category: Category.POTTERY,
    image: 'https://picsum.photos/id/106/600/600',
    rating: 4.9,
    reviews: 45,
    artisan: 'Vigan Clay Masters'
  }
];

export const NAV_LINKS = [
  { label: 'Home', path: '/' },
  { label: 'Marketplace', path: '/shop' },
  { label: 'About Us', path: '/about' },
];
