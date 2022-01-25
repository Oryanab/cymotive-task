import { Request, Response, NextFunction } from 'express';
/*
    error 500
*/
export function middlewareServerError(_req: Request, res: Response, next: NextFunction) {
  if (res.statusCode !== 500) {
    next();
  } else {
    res.status(500).json({
      message: 'Our servers had an internal problem please comeback later',
      status: 500,
    });
  }
}

/*
      error 404
  */
export function middlewarePageNotFound(_req: Request, res: Response, next: NextFunction) {
  if (res.statusCode !== 404) {
    next();
  } else {
    res.status(404).json({
      message: 'page not found',
      status: 404,
    });
  }
}
