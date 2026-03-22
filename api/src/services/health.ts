import { checkDatabaseConnection } from '../repositories/health';

export async function getHealthStatus(): Promise<{ status: 'ok'; db: 'ok' }> {
  await checkDatabaseConnection();
  return { status: 'ok', db: 'ok' };
}
