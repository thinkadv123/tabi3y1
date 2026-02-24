import bcrypt from 'bcryptjs';
import { INITIAL_PRODUCTS, INITIAL_CATEGORIES, INITIAL_SITE_CONTENT } from '../src/data';

// --- In-Memory Data Store ---
// This replaces the SQLite database to ensure 100% reliability in serverless environments (Netlify)
// where file-system write access is restricted or ephemeral.

let users: any[] = [];
let products = [...INITIAL_PRODUCTS];
let categories = [...INITIAL_CATEGORIES];
let siteContent = { ...INITIAL_SITE_CONTENT };
let orders: any[] = [];

// Initialize Admin User
const initAuth = () => {
  // Only add if not exists
  if (users.length === 0) {
    const hash = bcrypt.hashSync('admin123', 10);
    users.push({ id: 1, username: 'admin', password: hash });
    console.log('In-memory DB: Admin user initialized.');
  }
};

initAuth();

export const db = {
  users: {
    findByUsername: async (username: string) => users.find(u => u.username === username),
  },
  products: {
    findAll: async () => products,
    create: async (product: any) => { 
      products.push(product); 
      return true; 
    },
    update: async (id: string, data: any) => {
      const idx = products.findIndex(p => p.id === id);
      if (idx === -1) return false;
      products[idx] = { ...products[idx], ...data };
      return true;
    },
    delete: async (id: string) => {
      products = products.filter(p => p.id !== id);
      return true;
    }
  },
  categories: {
    findAll: async () => categories,
    create: async (category: any) => { 
      categories.push(category); 
      return true; 
    },
    delete: async (id: string) => {
      categories = categories.filter(c => c.id !== id);
      return true;
    }
  },
  orders: {
    findAll: async () => orders,
    create: async (order: any) => {
      const newOrder = { ...order, id: Date.now().toString(), status: 'pending', createdAt: new Date().toISOString() };
      orders.push(newOrder);
      return newOrder;
    },
    updateStatus: async (id: string, status: string) => {
      const idx = orders.findIndex(o => o.id === id);
      if (idx === -1) return false;
      orders[idx] = { ...orders[idx], status };
      return true;
    }
  },
  content: {
    get: async () => siteContent,
    update: async (content: any) => { 
      siteContent = content; 
      return true; 
    }
  }
};

// No-op for compatibility, as data is pre-loaded in memory
export const initDb = async () => {
  console.log('In-memory database ready.');
};

export default db;
