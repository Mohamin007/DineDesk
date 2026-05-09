import express from "express";
import cors from "cors";
import { handleAIRequest, handleAnalyze, handleExaSearch } from "../lib/handlers";

export default async function handler(req: any, res: any) {
  const path = req.query.path || [];
  const pathStr = Array.isArray(path) ? path.join("/") : path;

  // Set CORS headers
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  // Explicit routing
  if (pathStr === "health" && req.method === "GET") {
    return res.status(200).json({ ok: true, runtime: "vercel-function" });
  }

  if (pathStr === "analyze" && req.method === "POST") {
    const { restaurantData } = req.body;
    return await handleAnalyze(restaurantData, res);
  }

  if (pathStr.startsWith("ai/") && req.method === "POST") {
    const module = pathStr.replace("ai/", "");
    const { context, messages } = req.body;
    return await handleAIRequest(module, context, messages, res);
  }

  if (pathStr === "exa/search" && req.method === "POST") {
    const { query, category } = req.body;
    return await handleExaSearch(query, category, res);
  }

  res.status(404).json({ error: "Not Found" });
}
