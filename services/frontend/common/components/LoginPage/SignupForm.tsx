import { Formik, Form } from "formik";
import { signupValidationSchema } from "./validationSchemas";
import { useTranslation } from "react-i18next";

import { UserLogin } from "../../types/user";

import { FormikTextField } from "../common/FormFields";
import Button from "../common/Button";
import ButtonGroup from "../common/ButtonGroup";

export type SignupFormValues = UserLogin;

interface SignupFormProps {
  onSubmit: (values: SignupFormValues) => void;
  onCancel: () => void;
}

const SignupForm = ({ onSubmit, onCancel }: SignupFormProps) => {

  const { t } = useTranslation();

  return (
    <Formik
      initialValues={{
        username: '',
        password: '',
        passwordConfirm: '',
        email: '',
        phonenumber: '',
      }}
      onSubmit={onSubmit}
      validationSchema={signupValidationSchema(t)}
    >
      {({ isValid, dirty }) => {
        return (
          <Form className='form-login'>
            <FormikTextField
              placeholder={t('formsLogin.login.placeholder.username')}
              type='text'
              name='username'
            />
            <FormikTextField
              placeholder={t('formsLogin.login.placeholder.password')}
              type='password'
              name='password'
            />
            <FormikTextField
              placeholder={t('formsLogin.signup.placeholder.passwordConfirm')}
              type='password'
              name='passwordConfirm'
            />
            <FormikTextField
              placeholder={t('formsLogin.login.placeholder.email')}
              type='email'
              name="email"
            />
            <FormikTextField
              placeholder={t('formsLogin.login.placeholder.phonenumber')}
              type='text'
              name="phonenumber"
            />
            <ButtonGroup>
              <Button
                label={t('formsLogin.signup.label.submit')}
                type='submit'
                variant='primary'
                className='login-form'
                id='signup-button'
                disabled={!dirty || !isValid}
              />
              <Button
                label={t('formsLogin.signup.label.cancel')}
                variant='secondary'
                className='login-form'
                id='toggle-button'
                onClick={onCancel}
              />
            </ButtonGroup>
          </Form>
        );
      }}
    </Formik>
  );
};

export default SignupForm;