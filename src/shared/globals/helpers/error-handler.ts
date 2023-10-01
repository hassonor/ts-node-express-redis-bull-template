import HTTP_STATUS from 'http-status-codes';

export interface IErrorResponse {
  message: string;
  statusCode: number;
  status: string;
  serializeErrors(): IError;
}

export interface IError {
  message: string;
  statusCode: number;
  status: string;
}

export abstract class CustomError extends Error {
  abstract statusCode: number;
  abstract status: string;

  constructor(message: string) {
    super(message);
  }

  serializeErrors(): IError {
    return {
      message: this.message,
      status: this.status,
      statusCode: this.statusCode,
    };
  }
}

export class JoiRequestValidationError extends CustomError {
  statusCode = HTTP_STATUS.BAD_REQUEST;
  status = 'error';

  constructor(message: string) {
    super(message);
  }
}

export class BadRequestError extends CustomError {
  statusCode = HTTP_STATUS.BAD_REQUEST;
  status = 'error';

  constructor(message: string) {
    super(message);
  }
}

export class NotFoundError extends CustomError {
  statusCode = HTTP_STATUS.NOT_FOUND;
  status = 'error';

  constructor(message: string) {
    super(message);
  }
}

export class NotAuthorizedError extends CustomError {
  statusCode = HTTP_STATUS.UNAUTHORIZED;
  status = 'error';

  constructor(message: string) {
    super(message);
  }
}

export class FileTooLargeError extends CustomError {
  statusCode = HTTP_STATUS.REQUEST_TOO_LONG;
  status = 'error';

  constructor(message: string) {
    super(message);
  }
}

export class ServerError extends CustomError {
  statusCode = HTTP_STATUS.SERVICE_UNAVAILABLE;
  status = 'error';

  constructor(message: string) {
    super(message);
  }
}

export class BadGatewayError extends CustomError {
  statusCode = HTTP_STATUS.BAD_GATEWAY;
  status = 'error';

  constructor(message: string) {
    super(message);
  }
}

export class ConflictError extends CustomError {
  statusCode = HTTP_STATUS.CONFLICT;
  status = 'error';

  constructor(message: string) {
    super(message);
  }
}

export class ForbiddenError extends CustomError {
  statusCode = HTTP_STATUS.FORBIDDEN;
  status = 'error';

  constructor(message: string) {
    super(message);
  }
}

export class MethodNotAllowedError extends CustomError {
  statusCode = HTTP_STATUS.METHOD_NOT_ALLOWED;
  status = 'error';

  constructor(message: string) {
    super(message);
  }
}

export class TooManyRequestsError extends CustomError {
  statusCode = HTTP_STATUS.TOO_MANY_REQUESTS;
  status = 'error';

  constructor(message: string) {
    super(message);
  }
}
