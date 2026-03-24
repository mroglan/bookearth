import { config } from "../config";

export function corsMiddleware(
  req: { headers: { origin?: string }; method?: string },
  res: {
    setHeader: (key: string, value: string) => void;
    end: () => void;
    statusCode: number;
  },
  next: () => void,
) {
  const origin = req.headers.origin;

  if (!origin) {
    return next();
  }

  if (!config.cors.origins.includes(origin)) {
    res.statusCode = 403;
    return res.end();
  }

  res.setHeader("Access-Control-Allow-Origin", origin);
  res.setHeader("Vary", "Origin");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,PUT,PATCH,DELETE,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  if (req.method === "OPTIONS") {
    res.statusCode = 204;
    return res.end();
  }

  next();
}
