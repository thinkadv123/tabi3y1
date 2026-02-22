import Database from 'better-sqlite3';
import path from 'path';
import bcrypt from 'bcryptjs';
import { INITIAL_PRODUCTS, INITIAL_CATEGORIES, INITIAL_SITE_CONTENT } from '../src/data';

const dbPath = path.resolve(process.cwd(), 'server/data/app.db');
console.log('Database path:', dbPath);

let db;
try {
  db = new Database(dbPath);
} catch (err) {
  console.error('Failed to open database:', err);
  process.exit(1);
}

// Initialize Tables
try {
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS categories (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS products (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      price REAL NOT NULL,
      category TEXT NOT NULL,
      image TEXT,
      description TEXT,
      unit TEXT
    );

    CREATE TABLE IF NOT EXISTS site_content (
      key TEXT PRIMARY KEY,
      value TEXT NOT NULL
    );
  `);
} catch (err) {
  console.error('Failed to create tables:', err);
}

// Seed Initial Data
const seedData = () => {
  try {
    const userCount = db.prepare('SELECT COUNT(*) as count FROM users').get() as { count: number };
    if (userCount.count === 0) {
      const hash = bcrypt.hashSync('admin123', 10);
      db.prepare('INSERT INTO users (username, password) VALUES (?, ?)').run('admin', hash);
      console.log('Seeded admin user.');
    }

    const categoryCount = db.prepare('SELECT COUNT(*) as count FROM categories').get() as { count: number };
    if (categoryCount.count === 0) {
      const insert = db.prepare('INSERT INTO categories (id, name) VALUES (?, ?)');
      INITIAL_CATEGORIES.forEach((cat: any) => insert.run(cat.id, cat.name));
      console.log('Seeded categories.');
    }

    const productCount = db.prepare('SELECT COUNT(*) as count FROM products').get() as { count: number };
    if (productCount.count === 0) {
      const insert = db.prepare('INSERT INTO products (id, name, price, category, image, description, unit) VALUES (?, ?, ?, ?, ?, ?, ?)');
      INITIAL_PRODUCTS.forEach((prod: any) => insert.run(prod.id, prod.name, prod.price, prod.category, prod.image, prod.description, prod.unit));
      console.log('Seeded products.');
    }

    const contentCount = db.prepare('SELECT COUNT(*) as count FROM site_content').get() as { count: number };
    if (contentCount.count === 0) {
      const insert = db.prepare('INSERT INTO site_content (key, value) VALUES (?, ?)');
      insert.run('main', JSON.stringify(INITIAL_SITE_CONTENT));
      console.log('Seeded site content.');
    }
  } catch (err) {
    console.error('Error seeding data:', err);
  }
};

seedData();

export default db;
