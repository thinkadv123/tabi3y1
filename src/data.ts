import { Product, Category, SiteContent } from './types';

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'Organic Tomatoes',
    price: 3.50,
    description: 'Fresh, vine-ripened organic tomatoes grown without pesticides.',
    image: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&q=80&w=800',
    category: 'Vegetables',
    unit: 'kg'
  },
  {
    id: '2',
    name: 'Free-Range Eggs',
    price: 5.00,
    description: 'Farm-fresh eggs from our happy, pasture-raised chickens.',
    image: 'https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?auto=format&fit=crop&q=80&w=800',
    category: 'Poultry',
    unit: 'dozen'
  },
  {
    id: '3',
    name: 'Organic Spinach',
    price: 2.50,
    description: 'Crispy, nutrient-rich spinach leaves harvested daily.',
    image: 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?auto=format&fit=crop&q=80&w=800',
    category: 'Vegetables',
    unit: 'bunch'
  },
  {
    id: '4',
    name: 'Whole Organic Chicken',
    price: 15.00,
    description: 'Premium free-range chicken, raised with natural feed.',
    image: 'https://images.unsplash.com/photo-1587593810167-a84920ea0781?auto=format&fit=crop&q=80&w=800',
    category: 'Poultry',
    unit: 'piece'
  }
];

export const INITIAL_CATEGORIES: Category[] = [
  { id: '1', name: 'Vegetables' },
  { id: '2', name: 'Poultry' },
  { id: '3', name: 'Fruits' },
  { id: '4', name: 'Dairy' }
];

export const INITIAL_SITE_CONTENT: SiteContent = {
  about: {
    title: 'Our Story',
    content: 'At Tabi3y, we believe in the power of nature. Our farm is dedicated to providing the community with the freshest, chemical-free vegetables and free-range poultry, raised with care and respect for the environment.',
    image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&q=80&w=1200',
    sections: [
      { title: '100% Organic', content: 'No pesticides, no chemicals, just pure nature.', icon: 'Leaf' },
      { title: 'Free Range', content: 'Our animals roam freely in open pastures.', icon: 'Bird' },
      { title: 'Local Farm', content: 'Supporting our local community and economy.', icon: 'Home' }
    ]
  },
  contact: {
    title: 'Get in Touch',
    content: 'Have questions about our products or want to visit the farm? We would love to hear from you!',
    email: 'hello@tabi3y.com',
    phone: '+20 123 456 7890',
    address: 'Green Valley Farm, Organic Road, Cairo, Egypt'
  }
};
