import express from "express";
import cors from "cors";
import path from "path";

const app = express();

app.use(cors());
app.use(express.json());

// ✅ IMPORTANT: dist folder from project root
const distPath = path.join(process.cwd(), "dist");

// ✅ serve static assets ( /assets/... )
app.use(express.static(distPath));

// ✅ health
app.get("/health", (_req, res) => res.send("OK"));

// ✅ SPA fallback
app.get("*", (_req, res) => {
  res.sendFile(path.join(distPath, "index.html"));
});

// ✅ PORT must be from host
const port = Number(process.env.PORT) || 3000;
app.listen(port, () => console.log("Server running on", port));
