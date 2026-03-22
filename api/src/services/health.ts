import { checkDatabaseConnection } from '../repositories';

export async function getHealthStatus(): Promise<{ status: 'ok'; db: 'ok' }> {
  await checkDatabaseConnection();
  return { status: 'ok', db: 'ok' };
}
