import bcrypt from 'bcryptjs';
import admin from 'firebase-admin';
import { INITIAL_PRODUCTS, INITIAL_CATEGORIES, INITIAL_SITE_CONTENT } from '../src/data';

// --- Database Configuration ---
// Tries to connect to Firebase Firestore if credentials are provided.
// Falls back to in-memory storage for development/preview without credentials.

let dbInstance: FirebaseFirestore.Firestore | null = null;

const initFirebase = () => {
  try {
    if (process.env.FIREBASE_PROJECT_ID && process.env.FIREBASE_CLIENT_EMAIL && process.env.FIREBASE_PRIVATE_KEY) {
      // Robust private key parsing
      let privateKey = process.env.FIREBASE_PRIVATE_KEY;
      
      // Remove surrounding quotes if present
      if (privateKey.startsWith('"') && privateKey.endsWith('"')) {
        privateKey = privateKey.substring(1, privateKey.length - 1);
      } else if (privateKey.startsWith("'") && privateKey.endsWith("'")) {
        privateKey = privateKey.substring(1, privateKey.length - 1);
      }
      
      // Replace literal \n with actual newlines
      privateKey = privateKey.replace(/\\n/g, '\n');
      
      // Ensure it starts with the header
      if (!privateKey.includes('-----BEGIN PRIVATE KEY-----')) {
        console.error('FIREBASE_PRIVATE_KEY is missing the BEGIN header');
      }

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
      console.warn('Firebase credentials not found. Using in-memory database (data will be lost on restart).');
    }
  } catch (error) {
    console.error('Failed to initialize Firebase:', error);
    console.warn('Falling back to in-memory database.');
  }
};

initFirebase();

// --- In-Memory Fallback Data ---
let users: any[] = [];
let products = [...INITIAL_PRODUCTS];
let categories = [...INITIAL_CATEGORIES];
let siteContent = { ...INITIAL_SITE_CONTENT };
let orders: any[] = [];

// Initialize Admin User (In-Memory Only)
const initAuth = () => {
  if (users.length === 0) {
    const hash = bcrypt.hashSync('admin123', 10);
    users.push({ id: '1', username: 'admin', password: hash });
    console.log('In-memory DB: Admin user initialized.');
  }
};

if (!dbInstance) {
  initAuth();
}

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
    },
    create: async (user: any) => {
      if (dbInstance) {
        const docRef = await dbInstance.collection('users').add(user);
        return { id: docRef.id, ...user };
      }
      users.push(user);
      return user;
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
        // Remove id if present to let Firestore generate it, or use it as doc ID
        const { id, ...data } = product;
        const docRef = await dbInstance.collection('products').add(data);
        return { id: docRef.id, ...data };
      }
      products.push(product);
      return true;
    },
    update: async (id: string, data: any) => {
      if (dbInstance) {
        await dbInstance.collection('products').doc(id).update(data);
        return true;
      }
      const idx = products.findIndex(p => p.id === id);
      if (idx === -1) return false;
      products[idx] = { ...products[idx], ...data };
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
      categories.push(category);
      return true;
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
      const newOrder = { 
        ...order, 
        status: 'pending', 
        createdAt: new Date().toISOString() 
      };
      
      if (dbInstance) {
        const docRef = await dbInstance.collection('orders').add(newOrder);
        return { id: docRef.id, ...newOrder };
      }
      
      const inMemoryOrder = { ...newOrder, id: Date.now().toString() };
      orders.push(inMemoryOrder);
      return inMemoryOrder;
    },
    updateStatus: async (id: string, status: string) => {
      if (dbInstance) {
        await dbInstance.collection('orders').doc(id).update({ status });
        return true;
      }
      const idx = orders.findIndex(o => o.id === id);
      if (idx === -1) return false;
      orders[idx] = { ...orders[idx], status };
      return true;
    }
  },
  content: {
    get: async () => {
      if (dbInstance) {
        const doc = await dbInstance.collection('content').doc('main').get();
        if (doc.exists) return doc.data();
        // Initialize if not exists
        await dbInstance.collection('content').doc('main').set(INITIAL_SITE_CONTENT);
        return INITIAL_SITE_CONTENT;
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

// Seed initial data if Firestore is empty
export const initDb = async () => {
  if (dbInstance) {
    try {
      // Check if admin user exists
      const userSnapshot = await dbInstance.collection('users').where('username', '==', 'admin').get();
      if (userSnapshot.empty) {
        const hash = bcrypt.hashSync('admin123', 10);
        await dbInstance.collection('users').add({ username: 'admin', password: hash });
        console.log('Firebase: Admin user seeded.');
      }

      // Check if products exist
      const prodSnapshot = await dbInstance.collection('products').limit(1).get();
      if (prodSnapshot.empty) {
        const batch = dbInstance.batch();
        INITIAL_PRODUCTS.forEach(p => {
          const { id, ...data } = p; // Let Firestore generate IDs
          const ref = dbInstance!.collection('products').doc();
          batch.set(ref, data);
        });
        await batch.commit();
        console.log('Firebase: Products seeded.');
      }

      // Check if categories exist
      const catSnapshot = await dbInstance.collection('categories').limit(1).get();
      if (catSnapshot.empty) {
        const batch = dbInstance.batch();
        INITIAL_CATEGORIES.forEach(c => {
          const { id, ...data } = c;
          const ref = dbInstance!.collection('categories').doc();
          batch.set(ref, data);
        });
        await batch.commit();
        console.log('Firebase: Categories seeded.');
      }
    } catch (error) {
      console.error('Error seeding Firebase:', error);
    }
  } else {
    console.log('In-memory database ready.');
  }
};

export default db;
