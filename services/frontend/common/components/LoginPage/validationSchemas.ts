import { TFunction } from 'i18next';
import * as yup from 'yup';

export const loginValidationSchema = (t: TFunction<"translation", undefined>) => {
  return yup.object().shape({
    username: yup
      .string()
      .trim()      
      .min(4, t('formsLogin.login.errors.invalid.username'))
      .max(30, t('formsLogin.login.errors.invalid.username'))
      .matches(/^[A-Za-z0-9]+(?:[ _-][A-Za-z0-9]+)*$/, t('formsLogin.login.errors.invalid.username'))
      .required(t('formsLogin.login.errors.required.username')),
    password: yup
      .string()
      .trim()
      .min(6, t('formsLogin.login.errors.invalid.password'))
      .max(30, t('formsLogin.login.errors.invalid.password'))
      .matches(/^(?=.*[0-9!@#$%^&*])[a-zA-Z0-9!@#$%^&*]*$/, t('formsLogin.login.errors.invalid.password'))
      .required(t('formsLogin.login.errors.required.password')),
    email: yup
      .string()
      .trim()
      .email(t('formsLogin.login.errors.invalid.email'))
      .optional(),
    phonenumber: yup
      .string()
      .trim()
      .matches(/^((8|\+374|\+994|\+995|\+375|\+7|\+380|\+38|\+996|\+998|\+993)[- ]?)?\(?\d{3,5}\)?[- ]?\d{1}[- ]?\d{1}[- ]?\d{1}[- ]?\d{1}[- ]?\d{1}(([- ]?\d{1})?[- ]?\d{1})?$/,
        t('formsLogin.login.errors.invalid.phonenumber')) // Soyuz Nezavisimikh Gosudarstv telephone numbers
      .optional()
  });
};

export const signupValidationSchema = (t: TFunction<"translation", undefined>) => {
  return yup.object().shape({
    username: yup
      .string()
      .trim()      
      .min(4, t('formsLogin.signup.errors.short.username'))
      .max(30, t('formsLogin.signup.errors.long.username'))
      .matches(/^[A-Za-z0-9]+(?:[ _-][A-Za-z0-9]+)*$/, t('formsLogin.signup.errors.invalid.username'))
      .required(t('formsLogin.signup.errors.required.username')),
    password: yup
      .string()
      .trim()
      .min(6, t('formsLogin.signup.errors.short.password'))
      .max(30, t('formsLogin.signup.errors.long.password'))
      .matches(/^(?=.*[0-9!@#$%^&*])[a-zA-Z0-9!@#$%^&*]*$/, t('formsLogin.signup.errors.invalid.password'))
      .required(t('formsLogin.signup.errors.required.password')),
    passwordConfirm: yup
      .string()
      .trim()
      .oneOf([yup.ref('password'), null], t('formsLogin.signup.errors.invalid.passwordConfirm'))
      .required(t('formsLogin.signup.errors.required.passwordConfirm')),
    email: yup
      .string()
      .trim()
      .email(t('formsLogin.signup.errors.invalid.email'))
      .required(t('formsLogin.signup.errors.required.email')),
    phonenumber: yup
      .string()
      .trim()
      .matches(/^((8|\+374|\+994|\+995|\+375|\+7|\+380|\+38|\+996|\+998|\+993)[- ]?)?\(?\d{3,5}\)?[- ]?\d{1}[- ]?\d{1}[- ]?\d{1}[- ]?\d{1}[- ]?\d{1}(([- ]?\d{1})?[- ]?\d{1})?$/,
        t('formsLogin.signup.errors.invalid.phonenumber')) // Soyuz Nezavisimikh Gosudarstv telephone numbers
      .optional()
  });
};