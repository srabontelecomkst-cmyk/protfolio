import path from "node:path";
import express from "express";
import { createServer } from "./index";

const app = createServer();

// Determine the correct path to SPA build output
const __dirname = import.meta.dirname;
let spaPath = path.join(__dirname, "../spa");

// Vercel stores build output in /vercel/paths
if (process.env.VERCEL) {
  spaPath = path.join(__dirname, "../../spa");
}

// Serve static files from SPA build
app.use(express.static(spaPath));

// All other routes - serve React app (API routes already defined in createServer)
app.get("*", (req, res) => {
  if (req.path.startsWith("/api/") || req.path.startsWith("/health")) {
    return res.status(404).json({ error: "API endpoint not found" });
  }
  res.sendFile(path.join(spaPath, "index.html"));
});

export default app;



