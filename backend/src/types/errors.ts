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