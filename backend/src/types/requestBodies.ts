interface DisableUserBody {
  disable: boolean;
}

export const isDisableUserBody = (body: unknown): body is DisableUserBody =>
  Object.prototype.hasOwnProperty.call(body, "disable");

interface UserInfoBody {
  username: string;
  password: string;
}

export const isLoginBody = (body: unknown): body is UserInfoBody =>
  Object.prototype.hasOwnProperty.call(body, "username")
  &&
  Object.prototype.hasOwnProperty.call(body, "password");

interface NewUserBody extends UserInfoBody {
  name: string;
  phonenumber: string;
}

export const isNewUserBody = (body: unknown): body is NewUserBody =>
  Object.prototype.hasOwnProperty.call(body, "username")
  &&
  Object.prototype.hasOwnProperty.call(body, "name")
  &&
  Object.prototype.hasOwnProperty.call(body, "password")
  &&
  Object.prototype.hasOwnProperty.call(body, "phonenumber");

type EditUserBody = Omit<NewUserBody, 'password'>;

export const isEditUserBody = (body: unknown): body is EditUserBody =>
  Object.prototype.hasOwnProperty.call(body, "username")
  &&
  Object.prototype.hasOwnProperty.call(body, "name")
  &&
  Object.prototype.hasOwnProperty.call(body, "phonenumber");

interface EditPasswordBody {
  password: string;
  newPassword: string;
}

export const isEditPasswordBody = (body: unknown): body is EditPasswordBody =>
  Object.prototype.hasOwnProperty.call(body, "password")
  &&
  Object.prototype.hasOwnProperty.call(body, "newPassword");