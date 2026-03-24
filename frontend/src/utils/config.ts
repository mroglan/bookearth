import { z } from "zod";

type EnvDefaults = {
  apiBaseUrl: string;
};

const devDefaults: EnvDefaults = {
  apiBaseUrl: "http://localhost:4000",
};

const prodDefaults: EnvDefaults = {
  apiBaseUrl: "/api",
};

const testDefaults: EnvDefaults = {
  apiBaseUrl: "http://localhost:4000",
};

const createEnvSchema = (defaults: EnvDefaults) =>
  z
    .object({
      NEXT_PUBLIC_API_BASE_URL: z.string().default(defaults.apiBaseUrl),
    })
    .loose()
    .transform((env) => ({
      apiBaseUrl: env.NEXT_PUBLIC_API_BASE_URL,
    }));

const getConfig = () => {
  const envName = process.env.NODE_ENV ?? "development";

  if (envName === "production") {
    console.log("Using PRODUCTION frontend config");
    return createEnvSchema(prodDefaults).parse(process.env);
  }

  if (envName === "test") {
    console.log("Using TEST frontend config");
    return createEnvSchema(testDefaults).parse(process.env);
  }

  console.log("Using DEVELOPMENT frontend config");
  return createEnvSchema(devDefaults).parse(process.env);
};

export const config = getConfig();
