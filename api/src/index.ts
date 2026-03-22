import express from 'express';
import { config } from './config';
import { storage } from './storage';
import { checkDbConnection } from './db';
import { routes } from './routes';
import { errorHandler } from './middleware/error-handler';

const app = express();
app.use(express.json());
app.use(routes);
app.use(errorHandler);

async function waitForDb(attempts = 10, delayMs = 1000): Promise<void> {
  for (let attempt = 1; attempt <= attempts; attempt += 1) {
    try {
      await checkDbConnection();
      return;
    } catch (error) {
      if (attempt === attempts) {
        throw error;
      }
      await new Promise((resolve) => setTimeout(resolve, delayMs));
    }
  }
}

async function start(): Promise<void> {
  await storage.ensureReady();
  await waitForDb();

  app.listen(config.port, () => {
    console.log(`Book Earth API listening on http://localhost:${config.port}`);
  });
}

start().catch((error) => {
  console.error('Failed to start Book Earth API', error);
  process.exit(1);
});
