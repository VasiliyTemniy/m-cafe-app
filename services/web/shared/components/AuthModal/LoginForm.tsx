import { Formik, Form } from 'formik';
import { useTranslation } from '@m-market-app/frontend-logic/shared/hooks';
import { FormikPersist } from '@m-market-app/frontend-logic/shared/components';
import { loginValidationSchema } from './validationSchemas';
import { ButtonGroup, Button, FormikTextField, Scrollable } from '../basic';


export type LoginFormValues = {
  credential: string,
  password: string
};

interface LoginFormProps {
  onSubmit: (values: LoginFormValues) => void,
  changeMode: () => void,
  onCancel: () => void,
  loginNecessary?: boolean
}

export const LoginForm = ({ onSubmit, changeMode, onCancel, loginNecessary }: LoginFormProps) => {

  const { t } = useTranslation();

  const tNode = 'authModal';

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
          <Form className='form'>
            <Scrollable classNameAddon="form-inputs">
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
            <div className="form-buttons">
              <Button
                label={t(`${tNode}.label.toSignup`)}
                variant='primary'
                id='toggle-button'
                onClick={changeMode}
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
                  disabled={loginNecessary}
                />
              </ButtonGroup>
            </div>
          </Form>
        );
      }}
    </Formik>
  );
};