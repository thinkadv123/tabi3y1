import { createClient } from '@libsql/client';
import path from 'path';
import bcrypt from 'bcryptjs';
import { INITIAL_PRODUCTS, INITIAL_CATEGORIES, INITIAL_SITE_CONTENT } from '../src/data';
import dotenv from 'dotenv';

dotenv.config();

const dbPath = process.env.TURSO_DATABASE_URL 
  ? process.env.TURSO_DATABASE_URL 
  : `file:${path.resolve(process.cwd(), 'server/data/app.db')}`;

console.log('Database URL:', dbPath);

const db = createClient({
  url: dbPath,
  authToken: process.env.TURSO_AUTH_TOKEN,
});

// Initialize Tables
const initDb = async () => {
  try {
    await db.execute(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL
      );
    `);

    await db.execute(`
      CREATE TABLE IF NOT EXISTS categories (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL
      );
    `);

    await db.execute(`
      CREATE TABLE IF NOT EXISTS products (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        price REAL NOT NULL,
        category TEXT NOT NULL,
        image TEXT,
        description TEXT,
        unit TEXT
      );
    `);

    await db.execute(`
      CREATE TABLE IF NOT EXISTS site_content (
        key TEXT PRIMARY KEY,
        value TEXT NOT NULL
      );
    `);
    
    console.log('Tables initialized.');
    await seedData();
  } catch (err) {
    console.error('Failed to initialize database:', err);
  }
};

// Seed Initial Data
const seedData = async () => {
  try {
    const userCountResult = await db.execute('SELECT COUNT(*) as count FROM users');
    const userCount = userCountResult.rows[0].count as number;
    
    if (userCount === 0) {
      const hash = bcrypt.hashSync('admin123', 10);
      await db.execute({
        sql: 'INSERT INTO users (username, password) VALUES (?, ?)',
        args: ['admin', hash]
      });
      console.log('Seeded admin user.');
    }

    const categoryCountResult = await db.execute('SELECT COUNT(*) as count FROM categories');
    const categoryCount = categoryCountResult.rows[0].count as number;

    if (categoryCount === 0) {
      for (const cat of INITIAL_CATEGORIES) {
        await db.execute({
          sql: 'INSERT INTO categories (id, name) VALUES (?, ?)',
          args: [cat.id, cat.name]
        });
      }
      console.log('Seeded categories.');
    }

    const productCountResult = await db.execute('SELECT COUNT(*) as count FROM products');
    const productCount = productCountResult.rows[0].count as number;

    if (productCount === 0) {
      for (const prod of INITIAL_PRODUCTS) {
        await db.execute({
          sql: 'INSERT INTO products (id, name, price, category, image, description, unit) VALUES (?, ?, ?, ?, ?, ?, ?)',
          args: [prod.id, prod.name, prod.price, prod.category, prod.image, prod.description, prod.unit]
        });
      }
      console.log('Seeded products.');
    }

    const contentCountResult = await db.execute('SELECT COUNT(*) as count FROM site_content');
    const contentCount = contentCountResult.rows[0].count as number;

    if (contentCount === 0) {
      await db.execute({
        sql: 'INSERT INTO site_content (key, value) VALUES (?, ?)',
        args: ['main', JSON.stringify(INITIAL_SITE_CONTENT)]
      });
      console.log('Seeded site content.');
    }
  } catch (err) {
    console.error('Error seeding data:', err);
  }
};

export { initDb };
export default db;
