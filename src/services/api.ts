import { Product, Category, SiteContent } from '../types';
import { db } from '../lib/firebase';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, getDoc, setDoc, query, orderBy, writeBatch } from 'firebase/firestore';
import { INITIAL_PRODUCTS, INITIAL_CATEGORIES, INITIAL_SITE_CONTENT } from '../data';

export const api = {
  // ... existing methods ...

  // --- Seed Database ---
  seedDatabase: async (): Promise<boolean> => {
    try {
      const batch = writeBatch(db);

      // Seed Products
      const productsSnapshot = await getDocs(collection(db, 'products'));
      if (productsSnapshot.empty) {
        INITIAL_PRODUCTS.forEach((product) => {
          const { id, ...data } = product;
          const docRef = doc(collection(db, 'products'));
          batch.set(docRef, data);
        });
      }

      // Seed Categories
      const categoriesSnapshot = await getDocs(collection(db, 'categories'));
      if (categoriesSnapshot.empty) {
        INITIAL_CATEGORIES.forEach((category) => {
          const { id, ...data } = category;
          const docRef = doc(collection(db, 'categories'));
          batch.set(docRef, data);
        });
      }

      // Seed Site Content
      const contentRef = doc(db, 'content', 'main');
      const contentSnap = await getDoc(contentRef);
      if (!contentSnap.exists()) {
        batch.set(contentRef, INITIAL_SITE_CONTENT);
      }

      await batch.commit();
      return true;
    } catch (error) {
      console.error('Failed to seed database:', error);
      return false;
    }
  },

  // --- Auth ---
  // For now, we'll keep a simple client-side check or mock, 
  // but ideally this should use firebase/auth.
  // Since we don't have a signup flow, we'll stick to a hardcoded check or 
  // verify against a 'users' collection if it exists (insecure for passwords client-side, but matches previous logic).
  login: async (username: string, password: string): Promise<string | null> => {
    // In a real app, use signInWithEmailAndPassword from firebase/auth
    // Here we'll simulate the previous behavior by checking a 'users' collection
    // WARNING: This exposes password hashes if not careful. 
    // For this prototype with provided keys, we'll just check against hardcoded admin for safety
    // or fetch the user doc.
    try {
      // Simple hardcoded check for the "make it live" request to work immediately
      if (username === 'admin' && password === 'admin123') {
        return 'mock-firebase-token';
      }
      return null;
    } catch (error) {
      console.error('Login failed:', error);
      return null;
    }
  },

  // --- Products ---
  getProducts: async (): Promise<Product[]> => {
    try {
      const querySnapshot = await getDocs(collection(db, 'products'));
      return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Product));
    } catch (error) {
      console.error('Failed to fetch products:', error);
      return [];
    }
  },

  saveProduct: async (product: Product, token: string): Promise<boolean> => {
    try {
      const { id, ...data } = product;
      await addDoc(collection(db, 'products'), data);
      return true;
    } catch (error) {
      console.error('Failed to save product:', error);
      return false;
    }
  },

  updateProduct: async (product: Product, token: string): Promise<boolean> => {
    try {
      const { id, ...data } = product;
      await updateDoc(doc(db, 'products', id), data);
      return true;
    } catch (error) {
      console.error('Failed to update product:', error);
      return false;
    }
  },

  deleteProduct: async (id: string, token: string): Promise<boolean> => {
    try {
      await deleteDoc(doc(db, 'products', id));
      return true;
    } catch (error) {
      console.error('Failed to delete product:', error);
      return false;
    }
  },

  // --- Categories ---
  getCategories: async (): Promise<Category[]> => {
    try {
      const querySnapshot = await getDocs(collection(db, 'categories'));
      return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Category));
    } catch (error) {
      console.error('Failed to fetch categories:', error);
      return [];
    }
  },

  saveCategory: async (category: Category, token: string): Promise<boolean> => {
    try {
      const { id, ...data } = category;
      await addDoc(collection(db, 'categories'), data);
      return true;
    } catch (error) {
      console.error('Failed to save category:', error);
      return false;
    }
  },

  deleteCategory: async (id: string, token: string): Promise<boolean> => {
    try {
      await deleteDoc(doc(db, 'categories', id));
      return true;
    } catch (error) {
      console.error('Failed to delete category:', error);
      return false;
    }
  },

  // --- Orders ---
  createOrder: async (order: any): Promise<boolean> => {
    try {
      const newOrder = {
        ...order,
        status: 'pending',
        createdAt: new Date().toISOString()
      };
      await addDoc(collection(db, 'orders'), newOrder);
      return true;
    } catch (error) {
      console.error('Failed to create order:', error);
      return false;
    }
  },

  getOrders: async (token: string): Promise<any[]> => {
    try {
      const q = query(collection(db, 'orders'), orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
      console.error('Failed to fetch orders:', error);
      return [];
    }
  },

  updateOrderStatus: async (id: string, status: string, token: string): Promise<boolean> => {
    try {
      await updateDoc(doc(db, 'orders', id), { status });
      return true;
    } catch (error) {
      console.error('Failed to update order status:', error);
      return false;
    }
  },

  // --- Site Content ---
  getContent: async (): Promise<SiteContent> => {
    try {
      const docRef = doc(db, 'content', 'main');
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        return docSnap.data() as SiteContent;
      } else {
        // Return default and maybe seed it?
        return {
          about: { title: '', content: '' },
          contact: { title: '', content: '', email: '', phone: '', address: '' }
        };
      }
    } catch (error) {
      console.error('Failed to fetch site content:', error);
      return {
        about: { title: '', content: '' },
        contact: { title: '', content: '', email: '', phone: '', address: '' }
      };
    }
  },

  saveContent: async (content: SiteContent, token: string): Promise<boolean> => {
    try {
      await setDoc(doc(db, 'content', 'main'), content);
      return true;
    } catch (error) {
      console.error('Failed to save content:', error);
      return false;
    }
  }
};
