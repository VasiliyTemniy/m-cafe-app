// If reg expressions are declared via ENV, they will be imported instead of these defaults. Just make sure to use double escape characters
// everywhere where you have one

export const usernameRegExp = process.env.USERNAME_REGEXP
  ? new RegExp(process.env.USERNAME_REGEXP)
  : /^[A-Za-z0-9]+(?:[ _-][A-Za-z0-9]+)*$/;
export const minUsernameLen = process.env.USERNAME_MINLEN
  ? Number(process.env.USERNAME_MINLEN)
  : 3;
export const maxUsernameLen = process.env.USERNAME_MAXLEN
  ? Number(process.env.USERNAME_MAXLEN)
  : 25;


export const nameRegExp = process.env.NAME_REGEXP
  ? new RegExp(process.env.NAME_REGEXP)
  : /^[A-Za-zА-Яа-я]+(?:[ ][A-Za-zА-Яа-я]+)*$/;
export const minNameLen = process.env.NAME_MINLEN
  ? Number(process.env.NAME_MINLEN)
  : 3;
export const maxNameLen = process.env.NAME_MAXLEN
  ? Number(process.env.NAME_MAXLEN)
  : 50;


export const phonenumberRegExp = process.env.PHONENUMBER_REGEXP
  ? new RegExp(process.env.PHONENUMBER_REGEXP)
  : /^((8|\+374|\+994|\+995|\+375|\+7|\+380|\+38|\+996|\+998|\+993)[- ]?)?\(?\d{3,5}\)?[- ]?\d{1}[- ]?\d{1}[- ]?\d{1}[- ]?\d{1}[- ]?\d{1}(([- ]?\d{1})?[- ]?\d{1})?$/;
export const minPhonenumberLen = process.env.PHONENUMBER_MINLEN
  ? Number(process.env.PHONENUMBER_MINLEN)
  : 8;
export const maxPhonenumberLen = process.env.PHONENUMBER_MAXLEN
  ? Number(process.env.PHONENUMBER_MAXLEN)
  : 26;


export const emailRegExp = process.env.EMAIL_REGEXP
  ? new RegExp(process.env.EMAIL_REGEXP)
  : /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Zа-яА-Я\-0-9]+\.)+[a-zA-Zа-яА-Я]{2,}))$/;
export const minEmailLen = process.env.EMAIL_MINLEN
  ? Number(process.env.EMAIL_MINLEN)
  : 6;
export const maxEmailLen = process.env.EMAIL_MAXLEN
  ? Number(process.env.EMAIL_MAXLEN)
  : 50;


// Used only for tests
export const dateRegExp = process.env.DATE_REGEXP
  ? new RegExp(process.env.DATE_REGEXP)
  : /^\d{4}(-\d\d(-\d\d(T\d\d:\d\d(:\d\d)?(\.\d+)?(([+-]\d\d:\d\d)|Z)?)?)?)?$/;
// ??
//^\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d\.\d+([+-][0-2]\d:[0-5]\d|Z)$