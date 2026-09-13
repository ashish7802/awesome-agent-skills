export default function handler(req: any, res: any) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.statusCode = 200;
  res.setHeader("Content-Type", "application/json");
  res.end(
    JSON.stringify({
      status: "ok",
      service: "skill-auditor",
      deployment: "vercel",
      hasGeminiKey: Boolean(process.env.GEMINI_API_KEY),
    })
  );
}
