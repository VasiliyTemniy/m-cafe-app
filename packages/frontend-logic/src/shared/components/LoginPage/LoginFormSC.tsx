import { Formik, Form } from "formik";
import { useTranslation } from '../../index';
import { loginValidationSchema } from "./validationSchemas";
import { FormikTextFieldSC } from "../FormikFields";
import type { TextFieldLCProps } from "../../../types";

export type LoginFormValues = {
  credential: string,
  password: string
};

export interface LoginFormButtonsLCProps {
  onSubmit: (e?: React.FormEvent<HTMLFormElement> | undefined) => void,
  onCancel: () => void,
  submitDisabled: boolean
}

export interface LoginFormLCProps {
  onSubmit: (values: LoginFormValues) => void,
  onCancel: () => void
}

export interface LoginFormSCProps extends LoginFormLCProps {
  TextFieldLC: React.FC<TextFieldLCProps>,
  LoginFormButtonsLC: React.FC<LoginFormButtonsLCProps>
}


const LoginFormSC = ({ onSubmit, onCancel, TextFieldLC, LoginFormButtonsLC }: LoginFormSCProps) => {

  const { t } = useTranslation();

  const tNode = 'loginPage';

  const initialValues: LoginFormValues = {
    credential: '',
    password: ''
  };

  return (
    <Formik
      initialValues={initialValues}
      onSubmit={onSubmit}
      validationSchema={loginValidationSchema(t)}
    >
      {({ isValid, dirty, handleSubmit }) => {
        return (
          <Form>
            <FormikTextFieldSC
              placeholder={t(`${tNode}.placeholder.credential`)}
              label={t(`${tNode}.label.credential`)}
              type='text'
              name='credential'
              TextFieldLC={TextFieldLC}
            />
            <FormikTextFieldSC
              placeholder={t(`${tNode}.placeholder.password`)}
              label={t(`${tNode}.label.password`)}
              type='password'
              name='password'
              TextFieldLC={TextFieldLC}
            />
            <LoginFormButtonsLC
              onSubmit={handleSubmit}
              onCancel={onCancel}
              submitDisabled={!dirty || !isValid}
            />
            {/*
            Legacy code, will be transfered to LC
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
            </ButtonGroup> */}
          </Form>
        );
      }}
    </Formik>
  );
};

export default LoginFormSC;