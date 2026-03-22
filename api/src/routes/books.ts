import { Router } from 'express';
import { handleBookEvents, handleBookMapComposition } from '../controllers';

export const booksRouter = Router();

booksRouter.get('/books/:id/events', handleBookEvents);
booksRouter.get('/books/:id/map-composition', handleBookMapComposition);
