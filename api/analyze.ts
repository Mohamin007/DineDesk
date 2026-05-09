import cors from "cors";
import { handleAnalyze } from "../lib/handlers";

export default async function handler(req: any, res: any) {
  // Enable CORS
  cors()(req, res, () => {});

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { restaurantData } = req.body;
  await handleAnalyze(restaurantData, res);
}
