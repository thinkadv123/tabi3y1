import express from 'express';
import { createServer as createViteServer } from 'vite';
import cors from 'cors';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import db from './db';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function startServer() {
  const app = express();
  const PORT = 3000;
  const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

  app.use(cors());
  app.use(express.json());

  // --- Auth Middleware ---
  const authenticateToken = (req: any, res: any, next: any) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) return res.sendStatus(401);

    jwt.verify(token, JWT_SECRET, (err: any, user: any) => {
      if (err) return res.sendStatus(403);
      req.user = user;
      next();
    });
  };

  // --- Seed Admin User ---
  const userCount = db.prepare('SELECT COUNT(*) as count FROM users').get() as { count: number };
  if (userCount.count === 0) {
    const hashedPassword = await bcrypt.hash('admin123', 10);
    db.prepare('INSERT INTO users (username, password) VALUES (?, ?)').run('admin', hashedPassword);
    console.log('Admin user created: admin / admin123');
  }

  // --- API Routes ---

  // Login
  app.post('/api/login', async (req, res) => {
    const { username, password } = req.body;
    const user = db.prepare('SELECT * FROM users WHERE username = ?').get(username) as any;

    if (!user) {
      return res.status(400).json({ message: 'User not found' });
    }

    if (await bcrypt.compare(password, user.password)) {
      const token = jwt.sign({ username: user.username }, JWT_SECRET);
      res.json({ token });
    } else {
      res.status(403).json({ message: 'Invalid password' });
    }
  });

  // Products
  app.get('/api/products', (req, res) => {
    const products = db.prepare('SELECT * FROM products').all();
    res.json(products);
  });

  app.post('/api/products', authenticateToken, (req, res) => {
    const { id, name, price, description, image, category, unit } = req.body;
    try {
      db.prepare('INSERT INTO products (id, name, price, description, image, category, unit) VALUES (?, ?, ?, ?, ?, ?, ?)').run(id, name, price, description, image, category, unit);
      res.status(201).json({ message: 'Product created' });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.put('/api/products/:id', authenticateToken, (req, res) => {
    const { name, price, description, image, category, unit } = req.body;
    const { id } = req.params;
    try {
      db.prepare('UPDATE products SET name = ?, price = ?, description = ?, image = ?, category = ?, unit = ? WHERE id = ?').run(name, price, description, image, category, unit, id);
      res.json({ message: 'Product updated' });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.delete('/api/products/:id', authenticateToken, (req, res) => {
    const { id } = req.params;
    try {
      db.prepare('DELETE FROM products WHERE id = ?').run(id);
      res.json({ message: 'Product deleted' });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // Categories
  app.get('/api/categories', (req, res) => {
    const categories = db.prepare('SELECT * FROM categories').all();
    res.json(categories);
  });

  app.post('/api/categories', authenticateToken, (req, res) => {
    const { id, name } = req.body;
    try {
      db.prepare('INSERT INTO categories (id, name) VALUES (?, ?)').run(id, name);
      res.status(201).json({ message: 'Category created' });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.delete('/api/categories/:id', authenticateToken, (req, res) => {
    const { id } = req.params;
    try {
      db.prepare('DELETE FROM categories WHERE id = ?').run(id);
      res.json({ message: 'Category deleted' });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // Site Content
  app.get('/api/content', (req, res) => {
    const content = db.prepare('SELECT data FROM site_content WHERE type = ?').get('site_content') as { data: string };
    if (content) {
      res.json(JSON.parse(content.data));
    } else {
      res.status(404).json({ message: 'Content not found' });
    }
  });

  app.put('/api/content', authenticateToken, (req, res) => {
    const content = req.body;
    try {
      db.prepare('INSERT OR REPLACE INTO site_content (id, type, data) VALUES (?, ?, ?)').run('1', 'site_content', JSON.stringify(content));
      res.json({ message: 'Content updated' });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // --- Vite Middleware ---
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    // Serve static files in production
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
