import { Formik, Form } from "formik";
import { useTranslation } from '@m-cafe-app/frontend-logic/shared/hooks';
import { signupValidationSchema } from "./validationSchemas";
import { NewUserBody } from "@m-cafe-app/utils";
import { FormikTextFieldSC, FormikDateFieldSC } from "../FormikFields";
import { ButtonGroupSC, ButtonSC } from "../../scBasic";
import { ContainerLC } from "../../lcWeb";


export type SignupFormValues = NewUserBody & {
  passwordConfirm: string
};

interface SignupFormProps {
  onSubmit: (values: SignupFormValues) => void,
  changePage: () => void,
  onCancel: () => void  
}

export interface SignupFormSCProps extends SignupFormProps {
}


export const SignupFormSC = ({ onSubmit, changePage, onCancel }: SignupFormSCProps) => {

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
          <Form className='form-signup'>
            <FormikTextFieldSC
              placeholder={t(`${tNode}.placeholder.username`)}
              label={t(`${tNode}.label.username`)}
              type='text'
              name='username'
            />
            <FormikTextFieldSC
              placeholder={t(`${tNode}.placeholder.name`)}
              label={t(`${tNode}.label.name`)}
              type='text'
              name='name'
            />
            <FormikTextFieldSC
              placeholder={t(`${tNode}.placeholder.password`)}
              label={t(`${tNode}.label.password`)}
              type='password'
              name='password'
            />
            <FormikTextFieldSC
              placeholder={t(`${tNode}.placeholder.passwordConfirm`)}
              label={t(`${tNode}.label.passwordConfirm`)}
              type='password'
              name='passwordConfirm'
            />
            <FormikTextFieldSC
              placeholder={t(`${tNode}.placeholder.phonenumber`)}
              label={t(`${tNode}.label.phonenumber`)}
              type='text'
              name='phonenumber'
            />
            <FormikTextFieldSC
              placeholder={t(`${tNode}.placeholder.email`)}
              label={t(`${tNode}.label.email`)}
              type='email'
              name='email'
            />
            <FormikDateFieldSC
              placeholder={t(`${tNode}.placeholder.birthdate`)}
              label={t(`${tNode}.label.birthdate`)}
              name='birthdate'
            />
            <ContainerLC className="login-form-buttons-wrapper">
              <ButtonSC
                label={t(`${tNode}.label.toLogin`)}
                variant='primary'
                classNameAddon='login-form'
                id='toggle-button'
                onClick={changePage}
              />
              <ButtonGroupSC>
                <ButtonSC
                  label={t('formsLogin.signup.label.submit')}
                  type='submit'
                  variant='primary'
                  classNameAddon='login-form'
                  id='signup-button'
                  disabled={!dirty || !isValid}
                />
                <ButtonSC
                  label={t('formsLogin.signup.label.cancel')}
                  variant='secondary'
                  classNameAddon='login-form'
                  id='cancel-button'
                  onClick={onCancel}
                />
              </ButtonGroupSC>
            </ContainerLC>
          </Form>
        );
      }}
    </Formik>
  );
};