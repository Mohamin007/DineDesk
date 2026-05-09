export default function handler(req: any, res: any) {
  res.setHeader("Content-Type", "application/json");
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }
  
  res.status(200).json({ ok: true, runtime: "vercel-function" });
}
