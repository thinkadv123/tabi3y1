import express from 'express';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import db, { initDb } from './db';
import { createServer as createViteServer } from 'vite';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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
app.post('/api/auth/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await db.users.findByUsername(username);
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    const token = jwt.sign({ username: user.username }, JWT_SECRET, { expiresIn: '1h' });
    res.json({ token });
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/api/products', async (req, res) => {
  res.json(await db.products.findAll());
});

app.post('/api/products', authenticateToken, async (req, res) => {
  res.json(await db.products.create(req.body));
});

app.put('/api/products/:id', authenticateToken, async (req, res) => {
  res.json(await db.products.update(req.params.id, req.body));
});

app.delete('/api/products/:id', authenticateToken, async (req, res) => {
  res.json(await db.products.delete(req.params.id));
});

app.get('/api/categories', async (req, res) => {
  res.json(await db.categories.findAll());
});

app.post('/api/categories', authenticateToken, async (req, res) => {
  res.json(await db.categories.create(req.body));
});

app.delete('/api/categories/:id', authenticateToken, async (req, res) => {
  res.json(await db.categories.delete(req.params.id));
});

app.get('/api/orders', authenticateToken, async (req, res) => {
  res.json(await db.orders.findAll());
});

app.post('/api/orders', async (req, res) => {
  res.json(await db.orders.create(req.body));
});

app.put('/api/orders/:id/status', authenticateToken, async (req, res) => {
  res.json(await db.orders.updateStatus(req.params.id, req.body.status));
});

app.get('/api/site', async (req, res) => {
  res.json(await db.content.get());
});

app.put('/api/site', authenticateToken, async (req, res) => {
  res.json(await db.content.update(req.body));
});

// --- Vite Integration ---
async function startServer() {
  await initDb();
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, '../dist')));
    app.get('*', (req, res) => res.sendFile(path.join(__dirname, '../dist/index.html')));
  } else {
    const vite = await createViteServer({ 
      server: { middlewareMode: true }, 
      appType: 'custom' 
    });
    app.use(vite.middlewares);
    
    app.get('*', async (req, res, next) => {
      const url = req.originalUrl;
      try {
        let template = await fs.promises.readFile(path.resolve(__dirname, '../index.html'), 'utf-8');
        template = await vite.transformIndexHtml(url, template);
        res.status(200).set({ 'Content-Type': 'text/html' }).end(template);
      } catch (e) {
        vite.ssrFixStacktrace(e as Error);
        next(e);
      }
    });
  }
  app.listen(PORT, '0.0.0.0', () => console.log(`Server running on http://localhost:${PORT}`));
}

startServer();
