import { Formik, Form } from "formik";
import { useTranslation } from "react-i18next";
import { loginValidationSchema } from "./validationSchemas";

import { UserLogin } from "../../types/user";

import { FormikTextField } from "../common/FormFields";
import Button from "../common/Button";
import ButtonGroup from "../common/ButtonGroup";

export type LoginFormValues = UserLogin;

interface LoginFormProps {
  onSubmit: (values: LoginFormValues) => void;
  onCancel: () => void;
}

const LoginForm = ({ onSubmit, onCancel }: LoginFormProps) => {

  const { t } = useTranslation();

  return (
    <Formik
      initialValues={{
        username: '',
        password: '',
        email: '',
        phonenumber: '',
      }}
      onSubmit={onSubmit}
      validationSchema={loginValidationSchema(t)}
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
                label={t('formsLogin.login.label.submit')}
                type='submit'
                variant='primary'
                className='login-form'
                id='login-button'
                disabled={!dirty || !isValid}
              />
              <Button
                label={t('formsLogin.login.label.cancel')}
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

export default LoginForm;