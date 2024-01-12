import type { TFunction } from '@m-cafe-app/frontend-logic/shared/hooks';
import * as yup from 'yup';
import {
  minUsernameLen,
  maxUsernameLen,
  passwordRegExp,
  phonenumberRegExp,
  usernameRegExp,
  nameRegExp,
  minPasswordLen,
  maxPasswordLen,
  minPhonenumberLen,
  maxPhonenumberLen,
  minNameLen,
  maxNameLen,
  minEmailLen,
  maxEmailLen,
  emailRegExp
} from '@m-cafe-app/shared-constants';

export const loginValidationSchema = (t: TFunction) => {

  const tNode = 'authModal.validationErrors';

  return yup.object().shape({
    credential: yup
      .string()
      .trim()      
      .required(t(`${tNode}.required.credential`))
      .test({
        name: 'isUSernameOrPhonenumber',
        message: t(`${tNode}.invalid.credential`),
        test: (value) => usernameRegExp.test(value) || phonenumberRegExp.test(value),
      }),
    password: yup
      .string()
      .trim()
      .required(t(`${tNode}.required.password`))
      .min(minPasswordLen, t(`${tNode}.invalid.password`))
      .max(maxPasswordLen, t(`${tNode}.invalid.password`))
      .matches(passwordRegExp, t(`${tNode}.invalid.password`))
  });
};

export const signupValidationSchema = (t: TFunction) => {

  const tNode = 'authModal.validationErrors';

  return yup.object().shape({
    username: yup
      .string()
      .trim()
      .optional()
      .min(minUsernameLen, t(`${tNode}.short.username`))
      .max(maxUsernameLen, t(`${tNode}.long.username`))
      .matches(usernameRegExp, t(`${tNode}.invalid.username`)),
    name: yup
      .string()
      .trim()
      .optional()
      .min(minNameLen, t(`${tNode}.short.name`))
      .max(maxNameLen, t(`${tNode}.long.name`))
      .matches(nameRegExp, t(`${tNode}.invalid.name`)),
    password: yup
      .string()
      .trim()
      .required(t(`${tNode}.required.password`))
      .min(minPasswordLen, t(`${tNode}.short.password`))
      .max(maxPasswordLen, t(`${tNode}.long.password`))
      .matches(passwordRegExp, t(`${tNode}.invalid.password`)),
    passwordConfirm: yup
      .string()
      .trim()
      .required(t(`${tNode}.required.passwordConfirm`))
      .oneOf([yup.ref('password'), ''], t(`${tNode}.invalid.passwordConfirm`)),
    phonenumber: yup
      .string()
      .trim()
      .required(t(`${tNode}.required.phonenumber`))
      .min(minPhonenumberLen, t(`${tNode}.invalid.phonenumber`))
      .max(maxPhonenumberLen, t(`${tNode}.invalid.phonenumber`))
      .matches(phonenumberRegExp, t(`${tNode}.invalid.phonenumber`)),
    email: yup
      .string()
      .trim()
      .optional()
      .min(minEmailLen, t(`${tNode}.invalid.email`))
      .max(maxEmailLen, t(`${tNode}.invalid.email`))
      .matches(emailRegExp, t(`${tNode}.invalid.email`)),
    birthdate: yup
      .string()
      .optional(),
  });
};