import { Formik, Form } from "formik";
import { useTranslation } from '@m-cafe-app/frontend-logic/shared/hooks';
import { FormikPersist } from '@m-cafe-app/frontend-logic/shared/components';
import { loginValidationSchema } from "./validationSchemas";
import { ButtonGroup, Button, FormikTextField, Scrollable } from "../basic";


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
            <Scrollable classNameAddon="login-form-inputs-wrapper">
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
              <FormikPersist formName='login-form'/>
            </Scrollable>
            <div className="login-form-buttons-wrapper">
              <Button
                label={t(`${tNode}.label.toSignup`)}
                variant='primary'
                id='toggle-button'
                onClick={changePage}
              />
              <ButtonGroup>
                <Button
                  label={t('main.buttonLabel.submit')}
                  type='submit'
                  variant='primary'
                  id='login-button'
                  disabled={!dirty || !isValid}
                />
                <Button
                  label={t('main.buttonLabel.cancel')}
                  variant='secondary'
                  id='cancel-button'
                  onClick={onCancel}
                />
              </ButtonGroup>
            </div>
          </Form>
        );
      }}
    </Formik>
  );
};