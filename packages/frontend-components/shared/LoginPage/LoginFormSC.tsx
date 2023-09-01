import { Formik, Form } from "formik";
import { useTranslation } from '@m-cafe-app/frontend-logic/shared/hooks';
import { loginValidationSchema } from "./validationSchemas";
import { FormikTextFieldSC } from "../FormikFields";
import { ButtonGroupSC, ButtonSC } from "../../scBasic";
import { ContainerLC } from "../../lcWeb";


export type LoginFormValues = {
  credential: string,
  password: string
};

interface LoginFormProps {
  onSubmit: (values: LoginFormValues) => void,
  changePage: () => void,
  onCancel: () => void  
}

export interface LoginFormSCProps extends LoginFormProps {
}


export const LoginFormSC = ({ onSubmit, changePage, onCancel }: LoginFormSCProps) => {

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
          <Form className='form-login'>
            <FormikTextFieldSC
              placeholder={t(`${tNode}.placeholder.credential`)}
              label={t(`${tNode}.label.credential`)}
              type='text'
              name='credential'
            />
            <FormikTextFieldSC
              placeholder={t(`${tNode}.placeholder.password`)}
              label={t(`${tNode}.label.password`)}
              type='password'
              name='password'
            />
            <ContainerLC className="login-form-buttons-wrapper">
              <ButtonSC
                label={t(`${tNode}.label.toSubmit`)}
                type='submit'
                variant='primary'
                classNameAddon='login-form'
                id='toggle-button'
                onClick={changePage}
              />
              <ButtonGroupSC>
                <ButtonSC
                  label={t('main.buttonLabel.submit')}
                  type='submit'
                  variant='primary'
                  classNameAddon='login-form'
                  id='login-button'
                  disabled={!dirty || !isValid}
                />
                <ButtonSC
                  label={t('main.buttonLabel.cancel')}
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