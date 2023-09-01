import { Formik, Form } from "formik";
import { useTranslation } from "../../hooks";
import { signupValidationSchema } from "./validationSchemas";
import { NewUserBody } from "@m-cafe-app/utils";
import {
  FormikTextFieldSC,
  FormikDateFieldSC,
  TextFieldLCProps,
  DateFieldLCProps
} from "../FormikFields";
import type { CommonLCProps } from "../../../types";
import { ButtonGroupSC, ButtonLCProps, ButtonSC, ContainerLCProps, ContainerSC } from "../basic";


export type SignupFormValues = NewUserBody & {
  passwordConfirm: string
};

export interface SignupFormButtonsLCProps extends CommonLCProps {
  onSubmit: (e?: React.FormEvent<HTMLFormElement> | undefined) => void,
  onCancel: () => void,
  submitDisabled: boolean
}

interface SignupFormProps {
  onSubmit: (values: SignupFormValues) => void,
  onCancel: () => void  
}

export interface SignupFormLCProps extends SignupFormProps {
}

export interface SignupFormSCProps extends SignupFormProps {
  TextFieldLC: React.FC<TextFieldLCProps>,
  DateFieldLC: React.FC<DateFieldLCProps>,
  ContainerLC: React.FC<ContainerLCProps>,
  ButtonLC: React.FC<ButtonLCProps>,
  dateSvgUrl: string
}


export const SignupFormSC = ({ onSubmit, onCancel, TextFieldLC, DateFieldLC, ContainerLC, ButtonLC, dateSvgUrl }: SignupFormSCProps) => {

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
              TextFieldLC={TextFieldLC}
            />
            <FormikTextFieldSC
              placeholder={t(`${tNode}.placeholder.name`)}
              label={t(`${tNode}.label.name`)}
              type='text'
              name='name'
              TextFieldLC={TextFieldLC}
            />
            <FormikTextFieldSC
              placeholder={t(`${tNode}.placeholder.password`)}
              label={t(`${tNode}.label.password`)}
              type='password'
              name='password'
              TextFieldLC={TextFieldLC}
            />
            <FormikTextFieldSC
              placeholder={t(`${tNode}.placeholder.passwordConfirm`)}
              label={t(`${tNode}.label.passwordConfirm`)}
              type='password'
              name='passwordConfirm'
              TextFieldLC={TextFieldLC}
            />
            <FormikTextFieldSC
              placeholder={t(`${tNode}.placeholder.phonenumber`)}
              label={t(`${tNode}.label.phonenumber`)}
              type='text'
              name='phonenumber'
              TextFieldLC={TextFieldLC}
            />
            <FormikTextFieldSC
              placeholder={t(`${tNode}.placeholder.email`)}
              label={t(`${tNode}.label.email`)}
              type='email'
              name='email'
              TextFieldLC={TextFieldLC}
            />
            <FormikDateFieldSC
              placeholder={t(`${tNode}.placeholder.birthdate`)}
              label={t(`${tNode}.label.birthdate`)}
              name='birthdate'
              svgUrl={dateSvgUrl}
              DateFieldLC={DateFieldLC}
            />
            <ContainerSC ContainerLC={ContainerLC}>
              <ButtonSC
                label={t(`${tNode}.label.toLogin`)}
                type='submit'
                variant='primary'
                classNameAddon='login-form'
                id='login-button'
                // onClick -> send to SignupForm
                ButtonLC={ButtonLC}
              />
              <ButtonGroupSC ContainerLC={ContainerLC}>
                <ButtonSC
                  label={t('formsLogin.signup.label.submit')}
                  type='submit'
                  variant='primary'
                  classNameAddon='login-form'
                  id='signup-button'
                  disabled={!dirty || !isValid}
                  ButtonLC={ButtonLC}
                />
                <ButtonSC
                  label={t('formsLogin.signup.label.cancel')}
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