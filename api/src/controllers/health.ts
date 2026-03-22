import { Request, Response } from 'express';
import { getHealthStatus } from '../services/health';

export async function handleHealth(_req: Request, res: Response): Promise<void> {
  try {
    const status = await getHealthStatus();
    res.status(200).json(status);
  } catch (error) {
    res.status(500).json({ status: 'error', db: 'unavailable' });
  }
}
