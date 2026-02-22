import express from "express";
import cors from "cors";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import pool from "./db.js";
import path from "path";

const app = express();

app.use(cors());
app.use(express.json());

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

// --- Auth Middleware ---
const authenticateToken = (req: any, res: any, next: any) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (!token) return res.sendStatus(401);

  jwt.verify(token, JWT_SECRET, (err: any, user: any) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

// --- Seed Admin User ---
(async () => {
  try {
    const [userRows] = await pool.query("SELECT COUNT(*) as count FROM users");
    const userCount = (userRows as any)[0].count;
    if (userCount === 0) {
      const hashedPassword = await bcrypt.hash("admin123", 10);
      await pool.query(
        "INSERT INTO users (username, password) VALUES (?, ?)",
        ["admin", hashedPassword]
      );
      console.log("Admin user created: admin / admin123");
    }
  } catch (err) {
    console.error("Failed to seed admin user:", err);
  }
})();

// --- API Routes ---

app.get("/health", (_req, res) => res.send("OK"));

// Login
app.post("/api/login", async (req, res) => {
  const { username, password } = req.body;
  try {
    const [rows] = await pool.query("SELECT * FROM users WHERE username = ?", [
      username,
    ]);
    const user = (rows as any)[0];

    if (!user) return res.status(400).json({ message: "User not found" });

    if (await bcrypt.compare(password, user.password)) {
      const token = jwt.sign({ username: user.username }, JWT_SECRET);
      res.json({ token });
    } else {
      res.status(403).json({ message: "Invalid password" });
    }
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Products
app.get("/api/products", async (_req, res) => {
  try {
    const [products] = await pool.query("SELECT * FROM products");
    res.json(products);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/api/products", authenticateToken, async (req, res) => {
  const { id, name, price, description, image, category, unit } = req.body;
  try {
    await pool.query(
      "INSERT INTO products (id, name, price, description, image, category, unit) VALUES (?, ?, ?, ?, ?, ?, ?)",
      [id, name, price, description, image, category, unit]
    );
    res.status(201).json({ message: "Product created" });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.put("/api/products/:id", authenticateToken, async (req, res) => {
  const { name, price, description, image, category, unit } = req.body;
  const { id } = req.params;
  try {
    await pool.query(
      "UPDATE products SET name = ?, price = ?, description = ?, image = ?, category = ?, unit = ? WHERE id = ?",
      [name, price, description, image, category, unit, id]
    );
    res.json({ message: "Product updated" });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.delete("/api/products/:id", authenticateToken, async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query("DELETE FROM products WHERE id = ?", [id]);
    res.json({ message: "Product deleted" });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Categories
app.get("/api/categories", async (_req, res) => {
  try {
    const [categories] = await pool.query("SELECT * FROM categories");
    res.json(categories);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/api/categories", authenticateToken, async (req, res) => {
  const { id, name } = req.body;
  try {
    await pool.query("INSERT INTO categories (id, name) VALUES (?, ?)", [
      id,
      name,
    ]);
    res.status(201).json({ message: "Category created" });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.delete("/api/categories/:id", authenticateToken, async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query("DELETE FROM categories WHERE id = ?", [id]);
    res.json({ message: "Category deleted" });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Site Content
app.get("/api/content", async (_req, res) => {
  try {
    const [rows] = await pool.query(
      "SELECT data FROM site_content WHERE type = ?",
      ["site_content"]
    );
    const content = (rows as any)[0];
    if (content) res.json(JSON.parse(content.data));
    else res.status(404).json({ message: "Content not found" });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.put("/api/content", authenticateToken, async (req, res) => {
  const content = req.body;
  try {
    await pool.query(
      "REPLACE INTO site_content (id, type, data) VALUES (?, ?, ?)",
      ["1", "site_content", JSON.stringify(content)]
    );
    res.json({ message: "Content updated" });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ Serve Vite build in production
const distPath = path.join(process.cwd(), "dist");
app.use(express.static(distPath));
app.get("*", (_req, res) => res.sendFile(path.join(distPath, "index.html")));

// ✅ PORT from Hostinger
const PORT = Number(process.env.PORT) || 3000;
app.listen(PORT, "0.0.0.0", () => console.log("Server running on port", PORT));
