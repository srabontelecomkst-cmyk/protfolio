import "dotenv/config";
import express from "express";
import cors from "cors";
import { handleDemo } from "./routes/demo";

export function createServer() {
  const app = express();

  // Middleware
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Example API routes
  app.get("/api/ping", (_req, res) => {
    const ping = process.env.PING_MESSAGE ?? "ping";
    res.json({ message: ping });
  });

  app.get("/api/demo", handleDemo);

  // AI generation route using MCP
  app.post("/api/generate-testimonial", async (req, res) => {
    try {
      // Placeholder for MCP integration
      // In production, use Netlify MCP to call OpenAI or other AI
      const testimonial = {
        name: "AI Generated Name",
        role: "AI Generated Role",
        content: "This is a generated testimonial using AI. Please configure MCP with your API key.",
        image: "https://via.placeholder.com/150"
      };
      res.json(testimonial);
    } catch (error) {
      res.status(500).json({ error: "Failed to generate testimonial" });
    }
  });

  return app;
}
