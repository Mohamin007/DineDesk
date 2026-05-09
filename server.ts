import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import cors from "cors";
import { handleAIRequest, handleAnalyze, handleExaSearch } from "./lib/handlers";

async function createApp() {
  const app = express();
  const isServerlessRuntime = !!process.env.VERCEL || !!process.env.VERCEL_ENV;

  app.use(cors());
  app.use(express.json());

  // Unified AI Module Endpoint with Unified Context & Groq Power
  app.post("/api/ai/:module", async (req, res) => {
    const { module } = req.params;
    const { context, messages } = req.body;
    await handleAIRequest(module, context, messages, res);
  });

  // Keep legacy endpoint but update it to use Groq for consistency
  app.post("/api/analyze", async (req, res) => {
    const { restaurantData } = req.body;
    await handleAnalyze(restaurantData, res);
  });

  // Exa Generic Search Proxy
  app.post("/api/exa/search", async (req, res) => {
    const { query, category } = req.body;
    await handleExaSearch(query, category, res);
  });


  // Vite middleware for local development only (never initialize inside serverless functions)
  if (!isServerlessRuntime && process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else if (!isServerlessRuntime) {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  return app;
}

let appInstancePromise: Promise<express.Express> | null = null;

const getAppInstance = () => {
  if (!appInstancePromise) {
    appInstancePromise = createApp();
  }
  return appInstancePromise;
};

// Vercel serverless entrypoint
export default async function handler(req: any, res: any) {
  const app = await getAppInstance();
  return (app as any)(req, res);
}

// Local development/runtime entrypoint
if (!process.env.VERCEL) {
  const PORT = Number(process.env.PORT || 3000);
  getAppInstance()
    .then((app) => {
      app.listen(PORT, "0.0.0.0", () => {
        console.log(`DineDesk Server running on http://localhost:${PORT}`);
      });
    })
    .catch((error) => {
      console.error("Failed to start DineDesk server", error);
      process.exit(1);
    });
}
