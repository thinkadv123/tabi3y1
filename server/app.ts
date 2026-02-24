import express from 'express';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import db from './db';

const app = express();
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
  console.log('Login attempt for:', username);
  try {
    const result = await db.execute({ sql: 'SELECT * FROM users WHERE username = ?', args: [username] });
    const user = result.rows[0] as any;

    if (!user) {
      console.log('User not found:', username);
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      console.log('Invalid password for:', username);
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign({ username: user.username }, JWT_SECRET, { expiresIn: '1h' });
    res.json({ token });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Products
app.get('/api/products', async (req, res) => {
  try {
    const result = await db.execute('SELECT * FROM products');
    res.json(result.rows);
  } catch (err) {
    console.error('Failed to fetch products:', err);
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

app.post('/api/products', authenticateToken, async (req, res) => {
  const { id, name, price, category, image, description, unit } = req.body;
  try {
    await db.execute({
      sql: 'INSERT INTO products (id, name, price, category, image, description, unit) VALUES (?, ?, ?, ?, ?, ?, ?)',
      args: [id, name, price, category, image, description, unit]
    });
    res.json({ success: true });
  } catch (err) {
    console.error('Failed to create product:', err);
    res.status(500).json({ error: 'Failed to create product' });
  }
});

app.put('/api/products/:id', authenticateToken, async (req, res) => {
  const { id } = req.params;
  const { name, price, category, image, description, unit } = req.body;
  try {
    await db.execute({
      sql: 'UPDATE products SET name = ?, price = ?, category = ?, image = ?, description = ?, unit = ? WHERE id = ?',
      args: [name, price, category, image, description, unit, id]
    });
    res.json({ success: true });
  } catch (err) {
    console.error('Failed to update product:', err);
    res.status(500).json({ error: 'Failed to update product' });
  }
});

app.delete('/api/products/:id', authenticateToken, async (req, res) => {
  const { id } = req.params;
  try {
    await db.execute({ sql: 'DELETE FROM products WHERE id = ?', args: [id] });
    res.json({ success: true });
  } catch (err) {
    console.error('Failed to delete product:', err);
    res.status(500).json({ error: 'Failed to delete product' });
  }
});

// Categories
app.get('/api/categories', async (req, res) => {
  try {
    const result = await db.execute('SELECT * FROM categories');
    res.json(result.rows);
  } catch (err) {
    console.error('Failed to fetch categories:', err);
    res.status(500).json({ error: 'Failed to fetch categories' });
  }
});

app.post('/api/categories', authenticateToken, async (req, res) => {
  const { id, name } = req.body;
  try {
    await db.execute({ sql: 'INSERT INTO categories (id, name) VALUES (?, ?)', args: [id, name] });
    res.json({ success: true });
  } catch (err) {
    console.error('Failed to create category:', err);
    res.status(500).json({ error: 'Failed to create category' });
  }
});

app.delete('/api/categories/:id', authenticateToken, async (req, res) => {
  const { id } = req.params;
  try {
    await db.execute({ sql: 'DELETE FROM categories WHERE id = ?', args: [id] });
    res.json({ success: true });
  } catch (err) {
    console.error('Failed to delete category:', err);
    res.status(500).json({ error: 'Failed to delete category' });
  }
});

// Site Content
app.get('/api/site', async (req, res) => {
  try {
    const result = await db.execute({ sql: 'SELECT value FROM site_content WHERE key = ?', args: ['main'] });
    const row = result.rows[0] as any;
    if (row) {
      res.json(JSON.parse(row.value));
    } else {
      res.status(404).json({ error: 'Content not found' });
    }
  } catch (err) {
    console.error('Failed to fetch site content:', err);
    res.status(500).json({ error: 'Failed to fetch site content' });
  }
});

app.put('/api/site', authenticateToken, async (req, res) => {
  const content = req.body;
  try {
    await db.execute({ sql: 'INSERT OR REPLACE INTO site_content (key, value) VALUES (?, ?)', args: ['main', JSON.stringify(content)] });
    res.json({ success: true });
  } catch (err) {
    console.error('Failed to update content:', err);
    res.status(500).json({ error: 'Failed to update content' });
  }
});

export default app;
