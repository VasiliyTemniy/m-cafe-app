export class User {
  constructor (
    readonly id: number,
    readonly phonenumber: string,
    readonly username?: string,
    readonly name?: string,
    readonly email?: string,
    readonly rights?: string,
    readonly birthdate?: Date,
    readonly createdAt?: Date,
    readonly updatedAt?: Date,
    readonly deletedAt?: Date,
  ) {}
}

export type UserUniqueProperties = {
  phonenumber?: string,
  username?: string,
  email?: string,
};