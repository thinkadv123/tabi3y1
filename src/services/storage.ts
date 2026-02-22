import { Product, Category, SiteContent, CartItem } from '../types';
import { INITIAL_SITE_CONTENT, INITIAL_PRODUCTS, INITIAL_CATEGORIES } from '../data';

const STORAGE_KEYS = {
  PRODUCTS: 'tabi3y_products',
  CATEGORIES: 'tabi3y_categories',
  CONTENT: 'tabi3y_content',
  CART: 'tabi3y_cart',
  ADMIN_TOKEN: 'tabi3y_admin_token',
  USERS: 'tabi3y_users'
};

// Helper to initialize storage
const initStorage = () => {
  if (!localStorage.getItem(STORAGE_KEYS.PRODUCTS)) {
    localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(INITIAL_PRODUCTS));
  }
  if (!localStorage.getItem(STORAGE_KEYS.CATEGORIES)) {
    localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(INITIAL_CATEGORIES));
  }
  if (!localStorage.getItem(STORAGE_KEYS.CONTENT)) {
    localStorage.setItem(STORAGE_KEYS.CONTENT, JSON.stringify(INITIAL_SITE_CONTENT));
  }
  // Simple admin user for demo purposes
  if (!localStorage.getItem(STORAGE_KEYS.USERS)) {
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify([{ username: 'admin', password: 'password123' }]));
  }
};

export const storage = {
  init: initStorage,
  
  getProducts: (): Product[] => {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.PRODUCTS) || '[]');
  },
  
  saveProduct: (product: Product) => {
    const products = storage.getProducts();
    const index = products.findIndex(p => p.id === product.id);
    if (index >= 0) {
      products[index] = product;
    } else {
      products.push(product);
    }
    localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products));
    return true;
  },
  
  deleteProduct: (id: string) => {
    const products = storage.getProducts().filter(p => p.id !== id);
    localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products));
    return true;
  },

  getCategories: (): Category[] => {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.CATEGORIES) || '[]');
  },

  saveCategory: (category: Category) => {
    const categories = storage.getCategories();
    if (!categories.find(c => c.id === category.id)) {
      categories.push(category);
      localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(categories));
    }
    return true;
  },

  deleteCategory: (id: string) => {
    const categories = storage.getCategories().filter(c => c.id !== id);
    localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(categories));
    return true;
  },

  getContent: (): SiteContent => {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.CONTENT) || JSON.stringify(INITIAL_SITE_CONTENT));
  },

  saveContent: (content: SiteContent) => {
    localStorage.setItem(STORAGE_KEYS.CONTENT, JSON.stringify(content));
    return true;
  },

  login: (username: string, password: string): string | null => {
    // Simple check against hardcoded admin for simplicity, or stored users
    // In a real local-only app, we might just hardcode it.
    if (username === 'admin' && password === 'admin123') {
      const token = 'mock-jwt-token-' + Date.now();
      localStorage.setItem(STORAGE_KEYS.ADMIN_TOKEN, token);
      return token;
    }
    return null;
  },

  logout: () => {
    localStorage.removeItem(STORAGE_KEYS.ADMIN_TOKEN);
  },

  getToken: () => localStorage.getItem(STORAGE_KEYS.ADMIN_TOKEN)
};
