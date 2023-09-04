import { Formik, Form } from "formik";
import { useTranslation } from '@m-cafe-app/frontend-logic/shared/hooks';
import { loginValidationSchema } from "./validationSchemas";
import { Container, ButtonGroup, Button, FormikTextField } from "../basic";


export type LoginFormValues = {
  credential: string,
  password: string
};

interface LoginFormProps {
  onSubmit: (values: LoginFormValues) => void,
  changePage: () => void,
  onCancel: () => void  
}

export const LoginForm = ({ onSubmit, changePage, onCancel }: LoginFormProps) => {

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
      {({ isValid, dirty }) => {
        return (
          <Form className='login-form'>
            <FormikTextField
              placeholder={t(`${tNode}.placeholder.credential`)}
              label={t(`${tNode}.label.credential`)}
              type='text'
              name='credential'
            />
            <FormikTextField
              placeholder={t(`${tNode}.placeholder.password`)}
              label={t(`${tNode}.label.password`)}
              type='password'
              name='password'
            />
            <Container className="login-form-buttons-wrapper">
              <Button
                label={t(`${tNode}.label.toSignup`)}
                type='submit'
                variant='primary'
                // classNameAddon='login-form'
                id='toggle-button'
                onClick={changePage}
              />
              <ButtonGroup>
                <Button
                  label={t('main.buttonLabel.submit')}
                  type='submit'
                  variant='primary'
                  // classNameAddon='login-form'
                  id='login-button'
                  disabled={!dirty || !isValid}
                />
                <Button
                  label={t('main.buttonLabel.cancel')}
                  variant='secondary'
                  // classNameAddon='login-form'
                  id='cancel-button'
                  onClick={onCancel}
                />
              </ButtonGroup>
            </Container>
          </Form>
        );
      }}
    </Formik>
  );
};