import { checkDbConnection } from "../db";

export async function checkDatabaseConnection(): Promise<void> {
  await checkDbConnection();
}
