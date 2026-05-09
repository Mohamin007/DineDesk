import cors from "cors";
import { handleAIRequest } from "../../lib/handlers";

export default async function handler(req: any, res: any) {
  cors()(req, res, () => {});

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { context, messages } = req.body;
  await handleAIRequest("profit-audit", context, messages, res);
}
