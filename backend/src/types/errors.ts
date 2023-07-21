import { isString } from "./typeParsers.js";

export class SessionError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "SessionError";
  }
}

export class RequestBodyError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "RequestBodyError";
  }
}

export class CredentialsError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "CredentialsError";
  }
}

export class BannedError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "BannedError";
  }
}

export class HackError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "Please, do not do this";
  }
}

export class PasswordLengthError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "PasswordLengthError";
  }
}

export class UnknownError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "UnknownError";
  }
}

export class DatabaseError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "DatabaseError";
  }
}

export class ProhibitedError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ProhibitedError";
  }
}

export class AuthorizationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "AuthorizationError";
  }
}

export class ParseError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ParseError";
  }
}


interface NamedError {
  name: string;
}

const hasNamedErrorFields = (error: unknown): error is { name: unknown } =>
  Object.prototype.hasOwnProperty.call(error, "name");

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

const hasCustomErrorFields = (error: unknown): error is { name: unknown, message: unknown } =>
  Object.prototype.hasOwnProperty.call(error, "name")
  &&
  Object.prototype.hasOwnProperty.call(error, "message");

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
//   Object.prototype.hasOwnProperty.call(error, "parent")
//   &&
//   Object.prototype.hasOwnProperty.call(error, "original")
//   &&
//   Object.prototype.hasOwnProperty.call(error, "sql");