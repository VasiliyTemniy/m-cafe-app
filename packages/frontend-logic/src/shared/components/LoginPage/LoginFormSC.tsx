import { Formik, Form } from "formik";
import { useTranslation } from '../../hooks';
import { loginValidationSchema } from "./validationSchemas";
import { FormikTextFieldSC, TextFieldLCProps } from "../FormikFields";
import type { CommonLCProps } from "../../../types";
import { ButtonGroupSC, ButtonLCProps, ButtonSC, ContainerLCProps, ContainerSC } from "../basic";

export type LoginFormValues = {
  credential: string,
  password: string
};

export interface LoginFormButtonsLCProps extends CommonLCProps {
  onSubmit: (e?: React.FormEvent<HTMLFormElement> | undefined) => void,
  onCancel: () => void,
  submitDisabled: boolean
}

interface LoginFormProps {
  onSubmit: (values: LoginFormValues) => void,
  onCancel: () => void  
}

export interface LoginFormLCProps extends LoginFormProps {
}

export interface LoginFormSCProps extends LoginFormProps {
  TextFieldLC: React.FC<TextFieldLCProps>,
  ContainerLC: React.FC<ContainerLCProps>,
  ButtonLC: React.FC<ButtonLCProps>
}


export const LoginFormSC = ({ onSubmit, onCancel, TextFieldLC, ContainerLC, ButtonLC }: LoginFormSCProps) => {

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
              TextFieldLC={TextFieldLC}
            />
            <FormikTextFieldSC
              placeholder={t(`${tNode}.placeholder.password`)}
              label={t(`${tNode}.label.password`)}
              type='password'
              name='password'
              TextFieldLC={TextFieldLC}
            />
            <ContainerSC ContainerLC={ContainerLC}>
              <ButtonSC
                label={t(`${tNode}.label.toSubmit`)}
                type='submit'
                variant='primary'
                classNameAddon='login-form'
                id='login-button'
                // onClick -> send to SignupForm
                ButtonLC={ButtonLC}
              />
              <ButtonGroupSC ContainerLC={ContainerLC}>
                <ButtonSC
                  label={t('main.buttonLabel.submit')}
                  type='submit'
                  variant='primary'
                  classNameAddon='login-form'
                  id='login-button'
                  disabled={!dirty || !isValid}
                  ButtonLC={ButtonLC}
                />
                <ButtonSC
                  label={t('main.buttonLabel.cancel')}
                  variant='secondary'
                  classNameAddon='login-form'
                  id='toggle-button'
                  onClick={onCancel}
                  ButtonLC={ButtonLC}
                />
              </ButtonGroupSC>
            </ContainerSC>
          </Form>
        );
      }}
    </Formik>
  );
};