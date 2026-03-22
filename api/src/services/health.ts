import { checkDbConnection } from '../db';

export async function getHealthStatus(): Promise<{ status: 'ok'; db: 'ok' }> {
  await checkDbConnection();
  return { status: 'ok', db: 'ok' };
}
