import { NextFunction, Request, Response } from 'express';

import { ApiError } from '../errors';

export function errorHandler(
  err: ApiError | Error,
  _req: Request,
  res: Response,
  _next: NextFunction
): void {
  const status = err instanceof ApiError ? err.status : 500;
  const message = err?.message ?? 'internal server error';

  console.error('API error', {
    status,
    message,
    err
  });

  res.status(status).json({ error: message });
}
