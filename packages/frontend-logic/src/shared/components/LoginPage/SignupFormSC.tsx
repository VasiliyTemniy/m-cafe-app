import { Formik, Form } from "formik";
import { useTranslation } from "../../index";
import { signupValidationSchema } from "./validationSchemas";
import { NewUserBody } from "@m-cafe-app/utils";
import { FormikTextFieldSC, FormikDateFieldSC } from "../FormikFields";
import type {
  TextFieldLCProps,
  DateFieldLCProps,
  CommonLCProps,
} from "../../../types";


export type SignupFormValues = NewUserBody & {
  passwordConfirm: string
};

export interface SignupFormButtonsLCProps extends CommonLCProps {
  onSubmit: (e?: React.FormEvent<HTMLFormElement> | undefined) => void,
  onCancel: () => void,
  submitDisabled: boolean
}

export interface SignupFormLCProps extends CommonLCProps {
  onSubmit: (values: SignupFormValues) => void,
  onCancel: () => void
}

export interface SignupFormSCProps extends SignupFormLCProps {
  TextFieldLC: React.FC<TextFieldLCProps>,
  DateFieldLC: React.FC<DateFieldLCProps>,
  dateSvgUrl: string,
  SignupFormButtonsLC: React.FC<SignupFormButtonsLCProps>
}


const SignupFormSC = ({ onSubmit, onCancel, TextFieldLC, DateFieldLC, dateSvgUrl, SignupFormButtonsLC }: SignupFormSCProps) => {

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
      {({ isValid, dirty, handleSubmit }) => {
        return (
          <Form className='form-login'>
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
            <SignupFormButtonsLC
              onSubmit={handleSubmit}
              onCancel={onCancel}
              submitDisabled={!dirty || !isValid}
            />
            {/*
            Legacy code, will be transfered to LC
            <ButtonGroup>
              <Button
                label={t('formsLogin.signup.label.submit')}
                type='submit'
                variant='primary'
                className='login-form'
                id='signup-button'
                disabled={!dirty || !isValid}
              />
              <Button
                label={t('formsLogin.signup.label.cancel')}
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

export default SignupFormSC;