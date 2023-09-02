import { Formik, Form } from "formik";
import { useTranslation } from '@m-cafe-app/frontend-logic/shared/hooks';
import { signupValidationSchema } from "./validationSchemas";
import { NewUserBody } from "@m-cafe-app/utils";
import { Container, ButtonGroup, Button, FormikTextField, FormikDateField } from "../basic";


export type SignupFormValues = NewUserBody & {
  passwordConfirm: string
};

interface SignupFormProps {
  onSubmit: (values: SignupFormValues) => void,
  changePage: () => void,
  onCancel: () => void  
}

export const SignupForm = ({ onSubmit, changePage, onCancel }: SignupFormProps) => {

  const { t } = useTranslation();

  const tNode = 'loginPage';

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
          <Form className='signup-form'>
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
            <Container className="login-form-buttons-wrapper">
              <Button
                label={t(`${tNode}.label.toLogin`)}
                variant='primary'
                // classNameAddon='login-form'
                id='toggle-button'
                onClick={changePage}
              />
              <ButtonGroup>
                <Button
                  label={t('formsLogin.signup.label.submit')}
                  type='submit'
                  variant='primary'
                  // classNameAddon='login-form'
                  id='signup-button'
                  disabled={!dirty || !isValid}
                />
                <Button
                  label={t('formsLogin.signup.label.cancel')}
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