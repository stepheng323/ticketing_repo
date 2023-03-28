import { Request, Response, NextFunction } from 'express';

// eslint-disable-next-line import/prefer-default-export, max-len
export const catchAsync = (func: any) => (req: Request, res: Response, next: NextFunction) => func(req, res, next).catch(next);
