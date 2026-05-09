import cors from "cors";
import { handleExaSearch } from "../../lib/handlers";

export default async function handler(req: any, res: any) {
  cors()(req, res, () => {});

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { query, category } = req.body;
  await handleExaSearch(query, category, res);
}
