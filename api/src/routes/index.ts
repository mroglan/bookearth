import { Router } from "express";
import { healthRouter } from "./health";
import { booksRouter } from "./books";

export const routes = Router();

routes.use(healthRouter);
routes.use(booksRouter);
