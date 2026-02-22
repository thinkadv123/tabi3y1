import express from 'express';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import path from 'path';
import db from './db';
import { createServer as createViteServer } from 'vite';

const app = express();
const PORT = 3000;
const JWT_SECRET = process.env.JWT_SECRET || 'supersecretkey';

app.use(cors());
app.use(express.json());

// Middleware to verify JWT
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

// --- API Routes ---

// Auth
app.post('/api/auth/login', async (req, res) => {
  const { username, password } = req.body;
  const user = db.prepare('SELECT * FROM users WHERE username = ?').get(username) as any;

  if (!user) return res.status(401).json({ error: 'Invalid credentials' });

  const validPassword = await bcrypt.compare(password, user.password);
  if (!validPassword) return res.status(401).json({ error: 'Invalid credentials' });

  const token = jwt.sign({ username: user.username }, JWT_SECRET, { expiresIn: '1h' });
  res.json({ token });
});

// Products
app.get('/api/products', (req, res) => {
  const products = db.prepare('SELECT * FROM products').all();
  res.json(products);
});

app.post('/api/products', authenticateToken, (req, res) => {
  const { id, name, price, category, image, description, unit } = req.body;
  const stmt = db.prepare('INSERT INTO products (id, name, price, category, image, description, unit) VALUES (?, ?, ?, ?, ?, ?, ?)');
  try {
    stmt.run(id, name, price, category, image, description, unit);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Failed to create product' });
  }
});

app.put('/api/products/:id', authenticateToken, (req, res) => {
  const { id } = req.params;
  const { name, price, category, image, description, unit } = req.body;
  const stmt = db.prepare('UPDATE products SET name = ?, price = ?, category = ?, image = ?, description = ?, unit = ? WHERE id = ?');
  try {
    stmt.run(name, price, category, image, description, unit, id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update product' });
  }
});

app.delete('/api/products/:id', authenticateToken, (req, res) => {
  const { id } = req.params;
  const stmt = db.prepare('DELETE FROM products WHERE id = ?');
  try {
    stmt.run(id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete product' });
  }
});

// Categories
app.get('/api/categories', (req, res) => {
  const categories = db.prepare('SELECT * FROM categories').all();
  res.json(categories);
});

app.post('/api/categories', authenticateToken, (req, res) => {
  const { id, name } = req.body;
  const stmt = db.prepare('INSERT INTO categories (id, name) VALUES (?, ?)');
  try {
    stmt.run(id, name);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Failed to create category' });
  }
});

app.delete('/api/categories/:id', authenticateToken, (req, res) => {
  const { id } = req.params;
  const stmt = db.prepare('DELETE FROM categories WHERE id = ?');
  try {
    stmt.run(id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete category' });
  }
});

// Site Content
app.get('/api/site', (req, res) => {
  const row = db.prepare('SELECT value FROM site_content WHERE key = ?').get('main') as any;
  if (row) {
    res.json(JSON.parse(row.value));
  } else {
    res.status(404).json({ error: 'Content not found' });
  }
});

app.put('/api/site', authenticateToken, (req, res) => {
  const content = req.body;
  const stmt = db.prepare('INSERT OR REPLACE INTO site_content (key, value) VALUES (?, ?)');
  try {
    stmt.run('main', JSON.stringify(content));
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update content' });
  }
});

// --- Vite Integration ---

async function startServer() {
  if (process.env.NODE_ENV === 'production') {
    // Serve static files from dist
    app.use(express.static(path.join(__dirname, '../dist')));
    
    // SPA fallback
    app.get('*', (req, res) => {
      res.sendFile(path.join(__dirname, '../dist/index.html'));
    });
  } else {
    // Vite middleware for development
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
