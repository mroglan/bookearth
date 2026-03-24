import path from "path";
import { z } from "zod";

type EnvDefaults = {
  port: number;
  dataDir: string;
  corsOrigins: string;
  db: {
    connectionString?: string;
    host: string;
    port: number;
    user: string;
    password: string;
    database: string;
  };
};

const devDefaults: EnvDefaults = {
  port: 4000,
  dataDir: path.resolve(process.cwd(), "data"),
  corsOrigins: "http://localhost:3000,http://127.0.0.1:3000,http://localhost,http://127.0.0.1",
  db: {
    connectionString: undefined,
    host: "localhost",
    port: 5432,
    user: "bookearth",
    password: "bookearth",
    database: "bookearth",
  },
};

const prodDefaults: EnvDefaults = {
  port: 4000,
  dataDir: "/data",
  corsOrigins: "",
  db: {
    connectionString: undefined,
    host: "db",
    port: 5432,
    user: "bookearth",
    password: "bookearth",
    database: "bookearth",
  },
};

const testDefaults: EnvDefaults = {
  port: 4000,
  dataDir: path.resolve(process.cwd(), "data"),
  corsOrigins: "",
  db: {
    connectionString: undefined,
    host: "localhost",
    port: 5432,
    user: "bookearth",
    password: "bookearth",
    database: "bookearth",
  },
};

const createEnvSchema = (defaults: EnvDefaults) =>
  z
    .object({
      PORT: z.coerce.number().int().positive().default(defaults.port),
      DATA_DIR: z.string().min(1).default(defaults.dataDir),
      CORS_ORIGINS: z.string().default(defaults.corsOrigins),
      DATABASE_URL: z.string().optional(),
      DB_HOST: z.string().optional(),
      DB_PORT: z.coerce.number().int().positive().optional(),
      DB_USER: z.string().optional(),
      DB_PASSWORD: z.string().optional(),
      DB_NAME: z.string().optional(),
      PGHOST: z.string().optional(),
      PGPORT: z.coerce.number().int().positive().optional(),
      PGUSER: z.string().optional(),
      PGPASSWORD: z.string().optional(),
      PGDATABASE: z.string().optional(),
    })
    .loose()
    .transform((env) => ({
      port: env.PORT,
      dataDir: env.DATA_DIR,
      cors: {
        origins: env.CORS_ORIGINS.split(",")
          .map((value) => value.trim())
          .filter(Boolean),
      },
      db: {
        connectionString: env.DATABASE_URL ?? defaults.db.connectionString,
        host: env.DB_HOST ?? env.PGHOST ?? defaults.db.host,
        port: env.DB_PORT ?? env.PGPORT ?? defaults.db.port,
        user: env.DB_USER ?? env.PGUSER ?? defaults.db.user,
        password: env.DB_PASSWORD ?? env.PGPASSWORD ?? defaults.db.password,
        database: env.DB_NAME ?? env.PGDATABASE ?? defaults.db.database,
      },
    }));

const getConfig = () => {
  const envName = process.env.NODE_ENV ?? "development";

  if (envName == "production") {
    console.log("Using PRODUCTION config");
    return createEnvSchema(prodDefaults).parse(process.env);
  }

  if (envName == "test") {
    console.log("Using TEST config");
    return createEnvSchema(testDefaults).parse(process.env);
  }

  console.log("Using DEVELOPMENT config");
  return createEnvSchema(devDefaults).parse(process.env);
};

export const config = getConfig();
