import { Product, Category, SiteContent } from './types';

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'Organic Carrots',
    price: 45.00,
    description: 'Fresh, crunchy organic carrots harvested daily from our local farms.',
    image: 'https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?auto=format&fit=crop&q=80&w=800',
    category: 'Vegetables',
    unit: 'kg'
  },
  {
    id: '2',
    name: 'Free-Range Chicken',
    price: 250.00,
    description: 'Premium free-range chicken, raised without antibiotics or hormones.',
    image: 'https://images.unsplash.com/photo-1587593810167-a6492031e5fd?auto=format&fit=crop&q=80&w=800',
    category: 'Poultry',
    unit: 'whole'
  },
  {
    id: '3',
    name: 'Fresh Spinach',
    price: 35.00,
    description: 'Nutrient-rich organic spinach leaves, perfect for salads or cooking.',
    image: 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?auto=format&fit=crop&q=80&w=800',
    category: 'Vegetables',
    unit: 'bunch'
  },
  {
    id: '4',
    name: 'Organic Eggs',
    price: 120.00,
    description: 'Farm-fresh organic eggs from free-range hens.',
    image: 'https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?auto=format&fit=crop&q=80&w=800',
    category: 'Poultry',
    unit: 'carton (30)'
  },
  {
    id: '5',
    name: 'Red Bell Peppers',
    price: 60.00,
    description: 'Sweet and crisp red bell peppers, grown organically.',
    image: 'https://images.unsplash.com/photo-1563565375-f3fdf5d2e35c?auto=format&fit=crop&q=80&w=800',
    category: 'Vegetables',
    unit: 'kg'
  },
  {
    id: '6',
    name: 'Whole Duck',
    price: 450.00,
    description: 'Premium whole duck, perfect for roasting.',
    image: 'https://images.unsplash.com/photo-1627483297929-37f416fec7cd?auto=format&fit=crop&q=80&w=800',
    category: 'Poultry',
    unit: 'whole'
  }
];

export const INITIAL_CATEGORIES: Category[] = [
  { id: '1', name: 'Vegetables' },
  { id: '2', name: 'Poultry' },
  { id: '3', name: 'Fruits' },
  { id: '4', name: 'Dairy' },
  { id: '5', name: 'Pantry' }
];

export const INITIAL_SITE_CONTENT: SiteContent = {
  about: {
    title: 'Our Roots',
    content: 'Tabi3y was born from a simple belief: that nature provides everything we need to live a healthy, vibrant life. We started as a small community initiative connecting local organic farmers with families who cared about what they put on their plates.',
    image: 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&q=80&w=1200',
    sections: [
      { title: 'Our Mission', content: 'To make organic, sustainably sourced food accessible to everyone while supporting local agriculture and preserving our environment.' },
      { title: 'Our Promise', content: 'Every product you receive is hand-picked, 100% organic, and delivered with care. No compromises on quality or ethics.' }
    ]
  },
  contact: {
    title: 'Get in Touch',
    content: 'Have questions or feedback? We\'d love to hear from you. Reach out to us using the form or our contact details.',
    email: 'hello@tabi3y.com',
    phone: '+20 123 456 7890',
    address: '123 Nile View, Cairo, Egypt'
  }
};
