import express from "express";
import path from "path";

const app = express();

// ✅ dist folder path (always correct on Hostinger)
const distPath = path.join(process.cwd(), "dist");

// ✅ health check
app.get("/health", (_req, res) => res.status(200).send("OK"));

// ✅ serve built frontend files
app.use(express.static(distPath));

// ✅ SPA fallback -> dist/index.html (NOT root index.html)
app.get("*", (_req, res) => {
  res.sendFile(path.join(distPath, "index.html"));
});

const port = Number(process.env.PORT) || 3000;
app.listen(port, () => console.log("Server running on", port));
