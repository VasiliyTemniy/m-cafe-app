export class AuthRequest {
  constructor (
    readonly id: number,
    readonly lookupHash: string,
    readonly password?: string,
    readonly newPassword?: string,
    readonly oldPassword?: string,
  ) {}
}

export class CredentialsRequest {
  constructor (
    readonly lookupHash: string,
    readonly password: string
  ) {}
}

export class AuthResponse {
  constructor (
    readonly id: number,
    readonly token: string,
    readonly error: string
  ) {}
}

export class VerifyResponse {
  constructor (
    readonly success: boolean,
    readonly error: string
  ) {}
}