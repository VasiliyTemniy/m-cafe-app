interface DisableUserBody {
  disable: boolean;
}

export const isDisableUserBody = (body: unknown): body is DisableUserBody =>
  Object.prototype.hasOwnProperty.call(body, "disable");

interface LoginUserBody {
  username?: string;
  phonenumber?: string;
  password: string;
}

export const isLoginBody = (body: unknown): body is LoginUserBody =>
  (
    Object.prototype.hasOwnProperty.call(body, "username")
    &&
    Object.prototype.hasOwnProperty.call(body, "password")
  ) ||
  (
    Object.prototype.hasOwnProperty.call(body, "phonenumber")
    &&
    Object.prototype.hasOwnProperty.call(body, "password")
  );

interface NewUserBody {
  username?: string;
  name?: string;
  password: string;
  phonenumber: string;
  email?: string;
  birthdate?: Date;
}

export const isNewUserBody = (body: unknown): body is NewUserBody =>
  Object.prototype.hasOwnProperty.call(body, "password")
  &&
  Object.prototype.hasOwnProperty.call(body, "phonenumber");

interface EditUserBody extends NewUserBody {
  newPassword?: string;
}

export const isEditUserBody = (body: unknown): body is EditUserBody =>
  Object.prototype.hasOwnProperty.call(body, "password")
  &&
  Object.prototype.hasOwnProperty.call(body, "phonenumber");

// interface EditPasswordBody {
//   password: string;
//   newPassword: string;
// }

// export const isEditPasswordBody = (body: unknown): body is EditPasswordBody =>
//   Object.prototype.hasOwnProperty.call(body, "password")
//   &&
//   Object.prototype.hasOwnProperty.call(body, "newPassword");