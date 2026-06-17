export class BaseError extends Error {
  statusCode: number;

  constructor(message: string, statusCode = 500, name = 'BaseError') {
    super(message);
    this.statusCode = statusCode;
    this.name = name;
  }
}

export class ValidationError extends BaseError {
  constructor(message: string) {
    super(message, 400, 'ValidationError');
  }
}

export class NotFoundError extends BaseError {
  constructor(message: string) {
    super(message, 404, 'NotFoundError');
  }
}

export class UnauthorizedError extends BaseError {
  constructor(message = 'Unauthorized access') {
    super(message, 401, 'UnauthorizedError');
  }
}
