import path from "node:path";
import express from "express";
import { createServer } from "./index";

// Vercel serverless function export
const app = createServer();

// In production (Vercel), serve static SPA files
const __dirname = import.meta.dirname;
const distPath = path.join(__dirname, "../spa");

// Serve static files from the SPA build
app.use(express.static(distPath));

// Handle React Router - serve index.html for all non-API routes
app.get("*", (req, res) => {
  if (req.path.startsWith("/api/") || req.path.startsWith("/health")) {
    return res.status(404).json({ error: "API endpoint not found" });
  }
  res.sendFile(path.join(distPath, "index.html"));
});

// Vercel serverless function export
export default app;

