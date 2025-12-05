import { ClassConstructor } from "class-transformer";
import { NextFunction, Request, Response } from "express";

import { validateDto } from "../../utils";

export const validateBodyPayload = <D extends ClassConstructor<any>>(req: Request, res: Response, next: NextFunction, dto: D): void => {
  const { isValid, errors } = validateDto(req.body, dto);

  if (!isValid) {
    res.status(400).json({ message: "Invalid payload", errors });
    return;
  }

  next();
};
