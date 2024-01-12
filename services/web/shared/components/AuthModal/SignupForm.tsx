import type { NewUserBody } from '@m-market-app/utils';
import { Formik, Form } from 'formik';
import { useTranslation } from '@m-market-app/frontend-logic/shared/hooks';
import { FormikPersist } from '@m-market-app/frontend-logic/shared/components';
import { signupValidationSchema } from './validationSchemas';
import { ButtonGroup, Button, FormikTextField, FormikDateField, Scrollable } from '../basic';


export type SignupFormValues = NewUserBody & {
  passwordConfirm: string
};

interface SignupFormProps {
  onSubmit: (values: SignupFormValues) => void,
  changeMode: () => void,
  onCancel: () => void,
  loginNecessary?: boolean
}

export const SignupForm = ({ onSubmit, changeMode, onCancel, loginNecessary }: SignupFormProps) => {

  const { t } = useTranslation();

  const tNode = 'authModal';

  const initialValues: SignupFormValues = {
    username: '',
    name: '',
    password: '',
    passwordConfirm: '',
    phonenumber: '',
    email: '',
    birthdate: ''
  };

  return (
    <Formik
      initialValues={initialValues}
      onSubmit={onSubmit}
      validationSchema={signupValidationSchema(t)}
    >
      {({ isValid, dirty }) => {
        return (
          <Form className='form'>
            <Scrollable classNameAddon="form-inputs">
              <FormikTextField
                placeholder={t(`${tNode}.placeholder.username`)}
                label={t(`${tNode}.label.username`)}
                type='text'
                name='username'
              />
              <FormikTextField
                placeholder={t(`${tNode}.placeholder.name`)}
                label={t(`${tNode}.label.name`)}
                type='text'
                name='name'
              />
              <FormikTextField
                placeholder={t(`${tNode}.placeholder.password`)}
                label={t(`${tNode}.label.password`)}
                type='password'
                name='password'
              />
              <FormikTextField
                placeholder={t(`${tNode}.placeholder.passwordConfirm`)}
                label={t(`${tNode}.label.passwordConfirm`)}
                type='password'
                name='passwordConfirm'
              />
              <FormikTextField
                placeholder={t(`${tNode}.placeholder.phonenumber`)}
                label={t(`${tNode}.label.phonenumber`)}
                type='text'
                name='phonenumber'
              />
              <FormikTextField
                placeholder={t(`${tNode}.placeholder.email`)}
                label={t(`${tNode}.label.email`)}
                type='email'
                name='email'
              />
              <FormikDateField
                placeholder={t(`${tNode}.placeholder.birthdate`)}
                label={t(`${tNode}.label.birthdate`)}
                name='birthdate'
              />
              <FormikPersist formName='signup-form'/>
            </Scrollable>
            <div className="form-buttons">
              <Button
                label={t(`${tNode}.label.toLogin`)}
                variant='primary'
                id='toggle-button'
                onClick={changeMode}
              />
              <ButtonGroup>
                <Button
                  label={t('main.buttonLabel.submit')}
                  type='submit'
                  variant='primary'
                  id='signup-button'
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