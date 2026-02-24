import express from 'express';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import path from 'path';
import db, { initDb } from './db';
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
  console.log('Login attempt for:', username);
  try {
    const user = await db.users.findByUsername(username);

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
    const products = await db.products.findAll();
    res.json(products);
  } catch (err) {
    console.error('Failed to fetch products:', err);
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

app.post('/api/products', authenticateToken, async (req, res) => {
  const product = req.body;
  try {
    await db.products.create(product);
    res.json({ success: true });
  } catch (err) {
    console.error('Failed to create product:', err);
    res.status(500).json({ error: 'Failed to create product' });
  }
});

app.put('/api/products/:id', authenticateToken, async (req, res) => {
  const { id } = req.params;
  const product = req.body;
  try {
    await db.products.update(id, product);
    res.json({ success: true });
  } catch (err) {
    console.error('Failed to update product:', err);
    res.status(500).json({ error: 'Failed to update product' });
  }
});

app.delete('/api/products/:id', authenticateToken, async (req, res) => {
  const { id } = req.params;
  try {
    await db.products.delete(id);
    res.json({ success: true });
  } catch (err) {
    console.error('Failed to delete product:', err);
    res.status(500).json({ error: 'Failed to delete product' });
  }
});

// Categories
app.get('/api/categories', async (req, res) => {
  try {
    const categories = await db.categories.findAll();
    res.json(categories);
  } catch (err) {
    console.error('Failed to fetch categories:', err);
    res.status(500).json({ error: 'Failed to fetch categories' });
  }
});

app.post('/api/categories', authenticateToken, async (req, res) => {
  const category = req.body;
  try {
    await db.categories.create(category);
    res.json({ success: true });
  } catch (err) {
    console.error('Failed to create category:', err);
    res.status(500).json({ error: 'Failed to create category' });
  }
});

app.delete('/api/categories/:id', authenticateToken, async (req, res) => {
  const { id } = req.params;
  try {
    await db.categories.delete(id);
    res.json({ success: true });
  } catch (err) {
    console.error('Failed to delete category:', err);
    res.status(500).json({ error: 'Failed to delete category' });
  }
});

// Orders
app.get('/api/orders', authenticateToken, async (req, res) => {
  try {
    const orders = await db.orders.findAll();
    res.json(orders);
  } catch (err) {
    console.error('Failed to fetch orders:', err);
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
});

app.post('/api/orders', async (req, res) => {
  const order = req.body;
  try {
    if (!order.items || order.items.length === 0) {
      return res.status(400).json({ error: 'Order must have items' });
    }
    
    const newOrder = await db.orders.create(order);
    res.json(newOrder);
  } catch (err) {
    console.error('Failed to create order:', err);
    res.status(500).json({ error: 'Failed to create order' });
  }
});

app.put('/api/orders/:id/status', authenticateToken, async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  try {
    await db.orders.updateStatus(id, status);
    res.json({ success: true });
  } catch (err) {
    console.error('Failed to update order status:', err);
    res.status(500).json({ error: 'Failed to update order status' });
  }
});

// Site Content
app.get('/api/site', async (req, res) => {
  try {
    const content = await db.content.get();
    res.json(content);
  } catch (err) {
    console.error('Failed to fetch site content:', err);
    res.status(500).json({ error: 'Failed to fetch site content' });
  }
});

app.put('/api/site', authenticateToken, async (req, res) => {
  const content = req.body;
  try {
    await db.content.update(content);
    res.json({ success: true });
  } catch (err) {
    console.error('Failed to update content:', err);
    res.status(500).json({ error: 'Failed to update content' });
  }
});

// --- Vite Integration ---

async function startServer() {
  await initDb();
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
