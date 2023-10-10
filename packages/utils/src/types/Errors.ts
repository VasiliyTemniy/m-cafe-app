import { hasOwnProperty } from './helpers.js';
import { isString } from './typeValidators.js';

export class SessionError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'SessionError';
  }
}

export class RequestBodyError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'RequestBodyError';
  }
}

export class UploadFileError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'UploadFileError';
  }
}

export class RequestQueryError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'RequestQueryError';
  }
}

export class CredentialsError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'CredentialsError';
  }
}

export class BannedError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'BannedError';
  }
}

export class HackError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'HackError';
  }
}

export class PasswordLengthError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'PasswordLengthError';
  }
}

export class UnknownError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'UnknownError';
  }
}

export class DatabaseError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'DatabaseError';
  }
}

export class ProhibitedError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ProhibitedError';
  }
}

export class AuthorizationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'AuthorizationError';
  }
}

export class ParseError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ParseError';
  }
}

export class RedisError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'RedisError';
  }
}

export class GrpcClientError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'GrpcClientError';
  }
}

export class AuthServiceError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'AuthServiceError';
  }
}

export type SafeyAny = object | string | number | Array<object> | Array<string> | Array<number> | null | undefined;

interface ApplicationErrorMeta {
  all?: SafeyAny[];
  current?: SafeyAny;
}

export class ApplicationError extends Error {

  private _meta?: ApplicationErrorMeta;

  constructor(message: string, meta?: ApplicationErrorMeta) {
    super(message);
    this.name = 'ApplicationError';
    this._meta = meta;
  }

  get meta() {
    return this._meta;
  }

}


interface NamedError {
  name: string;
}

const hasNamedErrorFields = (error: unknown): error is { name: unknown; } =>
  hasOwnProperty(error, 'name');

export const isNamedError = (error: unknown): error is NamedError => {
  if (hasNamedErrorFields(error)) {
    if (isString(error.name)) return true;
  }
  return false;
};


interface CustomError {
  name: string;
  message: string;
}

const hasCustomErrorFields = (error: unknown): error is { name: unknown, message: unknown; } =>
  hasOwnProperty(error, 'name') && hasOwnProperty(error, 'message');

export const isCustomError = (error: unknown): error is CustomError => {
  if (hasCustomErrorFields(error)) {
    if (isString(error.name) && isString(error.message)) return true;
  }
  return false;
};

// interface SequelizeOriginalDatabaseError {
//   parent: Error;
//   original: Error;
//   sql: string;
//   parameters?: object;
//   message?: string;
// }

// export const isSequelizeOriginalDatabaseError = (error: unknown): error is SequelizeOriginalDatabaseError =>
//   hasOwnProperty(error, "parent")
//   &&
//   hasOwnProperty(error, "original")
//   &&
//   hasOwnProperty(error, "sql");