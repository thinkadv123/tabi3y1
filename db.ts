import Database from 'better-sqlite3';

const db = new Database('tabi3y.db');

// Initialize database tables
db.exec(`
  CREATE TABLE IF NOT EXISTS products (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    price REAL NOT NULL,
    description TEXT,
    image TEXT,
    category TEXT NOT NULL,
    unit TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS categories (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS site_content (
    id TEXT PRIMARY KEY,
    type TEXT NOT NULL UNIQUE,
    data TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL
  );
`);

// Seed initial data if empty
const productCount = db.prepare('SELECT COUNT(*) as count FROM products').get() as { count: number };
if (productCount.count === 0) {
  const insertProduct = db.prepare('INSERT INTO products (id, name, price, description, image, category, unit) VALUES (?, ?, ?, ?, ?, ?, ?)');
  const initialProducts = [
    { id: '1', name: 'Organic Carrots', price: 45.00, description: 'Fresh, crunchy organic carrots harvested daily from our local farms.', image: 'https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?auto=format&fit=crop&q=80&w=800', category: 'Vegetables', unit: 'kg' },
    { id: '2', name: 'Free-Range Chicken', price: 250.00, description: 'Premium free-range chicken, raised without antibiotics or hormones.', image: 'https://images.unsplash.com/photo-1587593810167-a6492031e5fd?auto=format&fit=crop&q=80&w=800', category: 'Poultry', unit: 'whole' },
    { id: '3', name: 'Fresh Spinach', price: 35.00, description: 'Nutrient-rich organic spinach leaves, perfect for salads or cooking.', image: 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?auto=format&fit=crop&q=80&w=800', category: 'Vegetables', unit: 'bunch' },
    { id: '4', name: 'Organic Eggs', price: 120.00, description: 'Farm-fresh organic eggs from free-range hens.', image: 'https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?auto=format&fit=crop&q=80&w=800', category: 'Poultry', unit: 'carton (30)' },
    { id: '5', name: 'Red Bell Peppers', price: 60.00, description: 'Sweet and crisp red bell peppers, grown organically.', image: 'https://images.unsplash.com/photo-1563565375-f3fdf5d2e35c?auto=format&fit=crop&q=80&w=800', category: 'Vegetables', unit: 'kg' },
    { id: '6', name: 'Whole Duck', price: 450.00, description: 'Premium whole duck, perfect for roasting.', image: 'https://images.unsplash.com/photo-1627483297929-37f416fec7cd?auto=format&fit=crop&q=80&w=800', category: 'Poultry', unit: 'whole' }
  ];
  initialProducts.forEach(p => insertProduct.run(p.id, p.name, p.price, p.description, p.image, p.category, p.unit));
}

const categoryCount = db.prepare('SELECT COUNT(*) as count FROM categories').get() as { count: number };
if (categoryCount.count === 0) {
  const insertCategory = db.prepare('INSERT INTO categories (id, name) VALUES (?, ?)');
  const initialCategories = [
    { id: '1', name: 'Vegetables' },
    { id: '2', name: 'Poultry' },
    { id: '3', name: 'Fruits' },
    { id: '4', name: 'Dairy' },
    { id: '5', name: 'Pantry' }
  ];
  initialCategories.forEach(c => insertCategory.run(c.id, c.name));
}

const contentCount = db.prepare('SELECT COUNT(*) as count FROM site_content').get() as { count: number };
if (contentCount.count === 0) {
  const insertContent = db.prepare('INSERT INTO site_content (id, type, data) VALUES (?, ?, ?)');
  const initialContent = {
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
  insertContent.run('1', 'site_content', JSON.stringify(initialContent));
}

// Seed Admin User (Default: admin / admin123)
// In a real app, use bcrypt to hash passwords. For simplicity here, we'll store hashed passwords.
// But since I can't run bcrypt in this script easily without importing it, I'll do it in server.ts on startup or just assume it's done.
// Let's just create the table here. The server will handle seeding the user if not exists.

export default db;
