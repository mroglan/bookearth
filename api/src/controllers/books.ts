import { Request, Response } from "express";
import { getEventsByBook } from "../services/events";
import { getMapCompositionByBook } from "../services/books";
import { ApiError } from "../errors";

function parseBookId(value: unknown): string | null {
  if (typeof value !== "string") {
    return null;
  }
  return value.trim() ? value : null;
}

export async function handleBookEvents(req: Request, res: Response): Promise<void> {
  const bookId = parseBookId(req.params.id);
  if (!bookId) {
    throw new ApiError("book id is required", 400);
  }

  const events = await getEventsByBook(bookId);
  res.status(200).json({ events });
}

export async function handleBookMapComposition(req: Request, res: Response): Promise<void> {
  const bookId = parseBookId(req.params.id);
  if (!bookId) {
    throw new ApiError("book id is required", 400);
  }

  const composition = await getMapCompositionByBook(bookId);
  if (!composition) {
    throw new ApiError("book not found", 404);
  }

  res.status(200).json(composition);
}
