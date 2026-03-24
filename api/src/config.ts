import path from "path";

const isProduction = process.env.NODE_ENV === "production";

export const config = {
  port: Number(process.env.PORT) || 4000,
  dataDir: process.env.DATA_DIR || path.resolve(process.cwd(), "data"),
  cors: {
    origins: (process.env.CORS_ORIGINS || "")
      .split(",")
      .map((value) => value.trim())
      .filter(Boolean),
  },
  db: {
    connectionString: process.env.DATABASE_URL || undefined,
    host: process.env.DB_HOST || process.env.PGHOST || (isProduction ? "db" : "localhost"),
    port: Number(process.env.DB_PORT || process.env.PGPORT || 5432),
    user: process.env.DB_USER || process.env.PGUSER || "bookearth",
    password: process.env.DB_PASSWORD || process.env.PGPASSWORD || "bookearth",
    database: process.env.DB_NAME || process.env.PGDATABASE || "bookearth",
  },
};
