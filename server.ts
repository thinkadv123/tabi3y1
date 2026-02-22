import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(cors());
app.use(express.json());

// ✅ serve Vite build
app.use(express.static(path.join(__dirname, "dist")));

// ✅ health check
app.get("/health", (_req, res) => {
  res.send("OK");
});

// ✅ SPA fallback (VERY IMPORTANT)
app.get("*", (_req, res) => {
  res.sendFile(path.join(__dirname, "dist", "index.html"));
});

const port = Number(process.env.PORT) || 3000;
app.listen(port, () => {
  console.log("Server running on port", port);
});
