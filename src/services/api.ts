import { Product, Category, SiteContent } from '../types';
import { db, auth } from '../lib/firebase';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, getDoc, setDoc, query, orderBy, writeBatch } from 'firebase/firestore';
import { signInAnonymously, onAuthStateChanged, User } from 'firebase/auth';
import { INITIAL_PRODUCTS, INITIAL_CATEGORIES, INITIAL_SITE_CONTENT } from '../data';

// Reliable auth waiter
const waitForAuth = (): Promise<User | null> => {
  return new Promise((resolve) => {
    if (auth.currentUser) {
      resolve(auth.currentUser);
      return;
    }
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      unsubscribe();
      resolve(user);
    });
  });
};

// Ensure user is authenticated for Firestore rules
const ensureAuth = async () => {
  let user = await waitForAuth();
  
  if (!user) {
    try {
      console.log('No user found, signing in anonymously...');
      const cred = await signInAnonymously(auth);
      user = cred.user;
      console.log('Signed in anonymously:', user.uid);
    } catch (error: any) {
      if (error.code === 'auth/configuration-not-found') {
        console.error('CRITICAL: Anonymous Authentication is not enabled in your Firebase Console. Please enable it under Authentication > Sign-in method.');
      } else {
        console.error('Anonymous auth failed:', error);
      }
    }
  } else {
    console.log('Already authenticated:', user.uid);
  }
  return user;
};

// Initialize auth immediately
ensureAuth();

export const api = {
  // --- Auth ---
  login: async (username: string, password: string): Promise<string | null> => {
    await ensureAuth();
    try {
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
    await ensureAuth();
    try {
      const querySnapshot = await getDocs(collection(db, 'products'));
      console.log(`Fetched ${querySnapshot.size} products`);
      return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Product));
    } catch (error) {
      console.error('Failed to fetch products:', error);
      return [];
    }
  },

  saveProduct: async (product: Product, token: string): Promise<boolean> => {
    await ensureAuth();
    try {
      const { id, ...data } = product;
      console.log('Saving product:', data);
      const docRef = await addDoc(collection(db, 'products'), data);
      console.log('Product saved with ID:', docRef.id);
      return true;
    } catch (error) {
      console.error('Failed to save product:', error);
      return false;
    }
  },

  updateProduct: async (product: Product, token: string): Promise<boolean> => {
    await ensureAuth();
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
    await ensureAuth();
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
    await ensureAuth();
    try {
      const querySnapshot = await getDocs(collection(db, 'categories'));
      return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Category));
    } catch (error) {
      console.error('Failed to fetch categories:', error);
      return [];
    }
  },

  saveCategory: async (category: Category, token: string): Promise<boolean> => {
    await ensureAuth();
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
    await ensureAuth();
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
    await ensureAuth();
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
    await ensureAuth();
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
    await ensureAuth();
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
    await ensureAuth();
    try {
      const docRef = doc(db, 'content', 'main');
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        return docSnap.data() as SiteContent;
      } else {
        return INITIAL_SITE_CONTENT;
      }
    } catch (error) {
      console.error('Failed to fetch site content:', error);
      return INITIAL_SITE_CONTENT;
    }
  },

  saveContent: async (content: SiteContent, token: string): Promise<boolean> => {
    await ensureAuth();
    try {
      await setDoc(doc(db, 'content', 'main'), content);
      return true;
    } catch (error) {
      console.error('Failed to save content:', error);
      return false;
    }
  },

  // --- Seed Database ---
  seedDatabase: async (): Promise<boolean> => {
    await ensureAuth();
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
  }
};
