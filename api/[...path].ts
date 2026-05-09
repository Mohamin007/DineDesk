import express from "express";
import cors from "cors";
import { handleAIRequest, handleAnalyze, handleExaSearch } from "../lib/handlers";

let app: express.Express | null = null;

function createApp() {
  const app = express();
  app.use(cors());
  app.use(express.json());

  // Unified AI Module Endpoint
  app.post("/api/ai/:module", async (req, res) => {
    const { module } = req.params;
    const { context, messages } = req.body;
    await handleAIRequest(module, context, messages, res);
  });

  // Analyze endpoint
  app.post("/api/analyze", async (req, res) => {
    const { restaurantData } = req.body;
    await handleAnalyze(restaurantData, res);
  });

  // Exa search endpoint
  app.post("/api/exa/search", async (req, res) => {
    const { query, category } = req.body;
    await handleExaSearch(query, category, res);
  });

  // Health check
  app.get("/api/health", (req, res) => {
    res.status(200).json({ ok: true, runtime: 'vercel-function' });
  });

  // Fallback for unmatched routes
  app.all("*", (req, res) => {
    res.status(404).json({ error: "Not Found" });
  });

  return app;
}

export default async function handler(req: any, res: any) {
  if (!app) {
    app = createApp();
  }
  return (app as any)(req, res);
}
