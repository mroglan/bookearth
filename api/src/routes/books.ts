import { Router } from 'express';
import { handleBookEvents, handleBookMapComposition } from '../controllers';

export const booksRouter = Router();

booksRouter.get('/api/books/:id/events', handleBookEvents);
booksRouter.get('/api/books/:id/map-composition', handleBookMapComposition);
