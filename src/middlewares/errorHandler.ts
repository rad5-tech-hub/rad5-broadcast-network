import { Request, Response, NextFunction } from 'express';
import { BaseError } from '../utils/customError';

const logError = (err: Error, req: Request, context: Record<string, unknown> = {}) => {
  console.error(
    `[ERROR] ${err.name}: ${err.message}`,
    { url: req.originalUrl, method: req.method, ...context },
  );
};

const globalErrorHandler = (err: Error, req: Request, res: Response, _next: NextFunction) => {
  const statusCode = err instanceof BaseError ? err.statusCode : 500;
  const message = err.message || 'Internal server error';

  logError(err, req, { source: 'express-error-handler' });
  if (process.env.NODE_ENV === 'production') {
    res.status(statusCode).json({
      status: `${statusCode}`.startsWith('4') ? 'fail' : 'error',
      message,
    });
  } else {
    res.status(statusCode).json({
      status: `${statusCode}`.startsWith('4') ? 'fail' : 'error',
      message,
      stack: err.stack
    });
  }
};

export default globalErrorHandler;
