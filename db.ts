import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'tabi3y',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Initialize database tables
async function initDb() {
  try {
    const connection = await pool.getConnection();
    
    await connection.query(`
      CREATE TABLE IF NOT EXISTS products (
        id VARCHAR(255) PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        price DECIMAL(10, 2) NOT NULL,
        description TEXT,
        image TEXT,
        category VARCHAR(255) NOT NULL,
        unit VARCHAR(50) NOT NULL
      );
    `);

    await connection.query(`
      CREATE TABLE IF NOT EXISTS categories (
        id VARCHAR(255) PRIMARY KEY,
        name VARCHAR(255) NOT NULL
      );
    `);

    await connection.query(`
      CREATE TABLE IF NOT EXISTS site_content (
        id VARCHAR(255) PRIMARY KEY,
        type VARCHAR(255) NOT NULL UNIQUE,
        data TEXT NOT NULL
      );
    `);

    await connection.query(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL
      );
    `);

    // Seed initial data
    const [productRows] = await connection.query('SELECT COUNT(*) as count FROM products');
    const productCount = (productRows as any)[0].count;
    
    if (productCount === 0) {
      const initialProducts = [
        { id: '1', name: 'Organic Carrots', price: 45.00, description: 'Fresh, crunchy organic carrots harvested daily from our local farms.', image: 'https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?auto=format&fit=crop&q=80&w=800', category: 'Vegetables', unit: 'kg' },
        { id: '2', name: 'Free-Range Chicken', price: 250.00, description: 'Premium free-range chicken, raised without antibiotics or hormones.', image: 'https://images.unsplash.com/photo-1587593810167-a6492031e5fd?auto=format&fit=crop&q=80&w=800', category: 'Poultry', unit: 'whole' },
        { id: '3', name: 'Fresh Spinach', price: 35.00, description: 'Nutrient-rich organic spinach leaves, perfect for salads or cooking.', image: 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?auto=format&fit=crop&q=80&w=800', category: 'Vegetables', unit: 'bunch' },
        { id: '4', name: 'Organic Eggs', price: 120.00, description: 'Farm-fresh organic eggs from free-range hens.', image: 'https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?auto=format&fit=crop&q=80&w=800', category: 'Poultry', unit: 'carton (30)' },
        { id: '5', name: 'Red Bell Peppers', price: 60.00, description: 'Sweet and crisp red bell peppers, grown organically.', image: 'https://images.unsplash.com/photo-1563565375-f3fdf5d2e35c?auto=format&fit=crop&q=80&w=800', category: 'Vegetables', unit: 'kg' },
        { id: '6', name: 'Whole Duck', price: 450.00, description: 'Premium whole duck, perfect for roasting.', image: 'https://images.unsplash.com/photo-1627483297929-37f416fec7cd?auto=format&fit=crop&q=80&w=800', category: 'Poultry', unit: 'whole' }
      ];
      for (const p of initialProducts) {
        await connection.query('INSERT INTO products (id, name, price, description, image, category, unit) VALUES (?, ?, ?, ?, ?, ?, ?)', [p.id, p.name, p.price, p.description, p.image, p.category, p.unit]);
      }
    }

    const [categoryRows] = await connection.query('SELECT COUNT(*) as count FROM categories');
    const categoryCount = (categoryRows as any)[0].count;
    
    if (categoryCount === 0) {
      const initialCategories = [
        { id: '1', name: 'Vegetables' },
        { id: '2', name: 'Poultry' },
        { id: '3', name: 'Fruits' },
        { id: '4', name: 'Dairy' },
        { id: '5', name: 'Pantry' }
      ];
      for (const c of initialCategories) {
        await connection.query('INSERT INTO categories (id, name) VALUES (?, ?)', [c.id, c.name]);
      }
    }

    const [contentRows] = await connection.query('SELECT COUNT(*) as count FROM site_content');
    const contentCount = (contentRows as any)[0].count;
    
    if (contentCount === 0) {
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
      await connection.query('INSERT INTO site_content (id, type, data) VALUES (?, ?, ?)', ['1', 'site_content', JSON.stringify(initialContent)]);
    }

    connection.release();
    console.log('Database initialized');
  } catch (err) {
    console.error('Database initialization failed:', err);
  }
}

initDb();

export default pool;
