import { Request, Response } from "express";
import { getHealthStatus } from "../services/health";

export async function handleHealth(_req: Request, res: Response): Promise<void> {
  const status = await getHealthStatus();
  res.status(200).json(status);
}
