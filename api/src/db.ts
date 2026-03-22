import { Pool, QueryResult, QueryResultRow } from 'pg';
import { config } from './config';

const pool = new Pool(
  config.db.connectionString
    ? { connectionString: config.db.connectionString }
    : {
        host: config.db.host,
        port: config.db.port,
        user: config.db.user,
        password: config.db.password,
        database: config.db.database
      }
);

export async function checkDbConnection(): Promise<void> {
  await pool.query('SELECT 1');
}

export function query<T extends QueryResultRow>(text: string, params: Array<string | number>): Promise<QueryResult<T>> {
  return pool.query<T>(text, params);
}

export function getPool(): Pool {
  return pool;
}
