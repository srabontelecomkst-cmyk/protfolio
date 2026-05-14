import path from "node:path";
import express from "express";
import { createServer } from "./index";
import { fileURLToPath } from "node:url";

const app = createServer();

// Use process.cwd() which works in both dev and Vercel
const cwd = process.cwd();
const spaPath = path.join(cwd, "dist", "spa");

// Log for debugging
console.log(`[Server] Working directory: ${cwd}`);
console.log(`[Server] SPA path: ${spaPath}`);

// Serve static files from SPA build
app.use(express.static(spaPath));

// All other routes - serve React app (API routes already defined)
app.get("*", (req, res) => {
  if (req.path.startsWith("/api/") || req.path.startsWith("/health")) {
    return res.status(404).json({ error: "API endpoint not found" });
  }
  const indexPath = path.join(spaPath, "index.html");
  console.log(`[Server] Serving index.html from: ${indexPath}`);
  res.sendFile(indexPath, (err) => {
    if (err) {
      console.error(`Failed to serve index.html:`, err.message);
      console.error(`Tried path: ${indexPath}`);
      // List directory to debug
      const fs = require('fs');
      try {
        const dirContents = fs.readdirSync(path.dirname(indexPath));
        console.error(`Directory contents of ${path.dirname(indexPath)}:`, dirContents);
      } catch (e) {}
      res.status(500).json({ 
        error: "Frontend not found. Build may have failed or SPA files missing.",
        path: indexPath 
      });
    }
  });
});

export default app;





