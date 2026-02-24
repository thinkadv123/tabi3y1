import bcrypt from 'bcryptjs';
import admin from 'firebase-admin';
import { INITIAL_PRODUCTS, INITIAL_CATEGORIES, INITIAL_SITE_CONTENT } from '../src/data';

// --- Database Configuration ---
let dbInstance: FirebaseFirestore.Firestore | null = null;

const initFirebase = () => {
  try {
    if (process.env.FIREBASE_PROJECT_ID && process.env.FIREBASE_CLIENT_EMAIL && process.env.FIREBASE_PRIVATE_KEY) {
      let privateKey = process.env.FIREBASE_PRIVATE_KEY;
      
      // Robust private key parsing
      if (privateKey.startsWith('"') && privateKey.endsWith('"')) {
        privateKey = privateKey.substring(1, privateKey.length - 1);
      } else if (privateKey.startsWith("'") && privateKey.endsWith("'")) {
        privateKey = privateKey.substring(1, privateKey.length - 1);
      }
      
      privateKey = privateKey.replace(/\\n/g, '\n');

      admin.initializeApp({
        credential: admin.credential.cert({
          projectId: process.env.FIREBASE_PROJECT_ID,
          clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
          privateKey: privateKey,
        }),
      });
      dbInstance = admin.firestore();
      console.log('Connected to Firebase Firestore');
    } else {
      console.warn('Firebase credentials not found. Using in-memory database.');
    }
  } catch (error) {
    console.error('Failed to initialize Firebase:', error);
  }
};

initFirebase();

// --- In-Memory Fallback Data ---
let users: any[] = [];
let products = [...INITIAL_PRODUCTS];
let categories = [...INITIAL_CATEGORIES];
let siteContent = { ...INITIAL_SITE_CONTENT };
let orders: any[] = [];

// Initialize Admin User (In-Memory)
const initAuth = () => {
  const hash = bcrypt.hashSync('admin123', 10);
  users.push({ id: '1', username: 'admin', password: hash });
};
initAuth();

// --- Database Interface ---
export const db = {
  users: {
    findByUsername: async (username: string) => {
      if (dbInstance) {
        const snapshot = await dbInstance.collection('users').where('username', '==', username).limit(1).get();
        if (snapshot.empty) return null;
        const doc = snapshot.docs[0];
        return { id: doc.id, ...doc.data() } as any;
      }
      return users.find(u => u.username === username);
    }
  },
  products: {
    findAll: async () => {
      if (dbInstance) {
        const snapshot = await dbInstance.collection('products').get();
        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      }
      return products;
    },
    create: async (product: any) => {
      if (dbInstance) {
        const { id, ...data } = product;
        const docRef = await dbInstance.collection('products').add(data);
        return { id: docRef.id, ...data };
      }
      const newProduct = { ...product, id: Date.now().toString() };
      products.push(newProduct);
      return newProduct;
    },
    update: async (id: string, data: any) => {
      if (dbInstance) {
        await dbInstance.collection('products').doc(id).update(data);
        return true;
      }
      const idx = products.findIndex(p => p.id === id);
      if (idx !== -1) products[idx] = { ...products[idx], ...data };
      return true;
    },
    delete: async (id: string) => {
      if (dbInstance) {
        await dbInstance.collection('products').doc(id).delete();
        return true;
      }
      products = products.filter(p => p.id !== id);
      return true;
    }
  },
  categories: {
    findAll: async () => {
      if (dbInstance) {
        const snapshot = await dbInstance.collection('categories').get();
        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      }
      return categories;
    },
    create: async (category: any) => {
      if (dbInstance) {
        const { id, ...data } = category;
        const docRef = await dbInstance.collection('categories').add(data);
        return { id: docRef.id, ...data };
      }
      const newCat = { ...category, id: Date.now().toString() };
      categories.push(newCat);
      return newCat;
    },
    delete: async (id: string) => {
      if (dbInstance) {
        await dbInstance.collection('categories').doc(id).delete();
        return true;
      }
      categories = categories.filter(c => c.id !== id);
      return true;
    }
  },
  orders: {
    findAll: async () => {
      if (dbInstance) {
        const snapshot = await dbInstance.collection('orders').orderBy('createdAt', 'desc').get();
        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      }
      return orders;
    },
    create: async (order: any) => {
      const newOrder = { ...order, status: 'pending', createdAt: new Date().toISOString() };
      if (dbInstance) {
        const docRef = await dbInstance.collection('orders').add(newOrder);
        return { id: docRef.id, ...newOrder };
      }
      const inMemOrder = { ...newOrder, id: Date.now().toString() };
      orders.push(inMemOrder);
      return inMemOrder;
    },
    updateStatus: async (id: string, status: string) => {
      if (dbInstance) {
        await dbInstance.collection('orders').doc(id).update({ status });
        return true;
      }
      const idx = orders.findIndex(o => o.id === id);
      if (idx !== -1) orders[idx].status = status;
      return true;
    }
  },
  content: {
    get: async () => {
      if (dbInstance) {
        const doc = await dbInstance.collection('content').doc('main').get();
        return doc.exists ? doc.data() : INITIAL_SITE_CONTENT;
      }
      return siteContent;
    },
    update: async (content: any) => {
      if (dbInstance) {
        await dbInstance.collection('content').doc('main').set(content, { merge: true });
        return true;
      }
      siteContent = content;
      return true;
    }
  }
};

export const initDb = async () => {
  if (dbInstance) {
    try {
      const userSnapshot = await dbInstance.collection('users').where('username', '==', 'admin').get();
      if (userSnapshot.empty) {
        const hash = bcrypt.hashSync('admin123', 10);
        await dbInstance.collection('users').add({ username: 'admin', password: hash });
      }
      
      const prodSnapshot = await dbInstance.collection('products').limit(1).get();
      if (prodSnapshot.empty) {
        const batch = dbInstance.batch();
        INITIAL_PRODUCTS.forEach(p => {
          const { id, ...data } = p;
          batch.set(dbInstance!.collection('products').doc(), data);
        });
        await batch.commit();
      }

      const catSnapshot = await dbInstance.collection('categories').limit(1).get();
      if (catSnapshot.empty) {
        const batch = dbInstance.batch();
        INITIAL_CATEGORIES.forEach(c => {
          const { id, ...data } = c;
          batch.set(dbInstance!.collection('categories').doc(), data);
        });
        await batch.commit();
      }
    } catch (error) {
      console.error('Error seeding Firebase:', error);
    }
  }
};

export default db;
