import { useAppDispatch } from "../../defineReduxHooks";
import { sendLogin, sendNewUser } from "../../reducers";
import { useTranslation } from "../../hooks";
import { useState } from "react";
import { LoginFormSC, LoginFormValues } from "./LoginFormSC";
import { SignupFormSC, SignupFormValues } from "./SignupFormSC";
import { ApplicationError, LoginUserBody, mapEmptyStringsToUndefined, NewUserBody } from '@m-cafe-app/utils';
import { phonenumberRegExp, usernameRegExp } from "@m-cafe-app/shared-constants";
import { ButtonLCProps, ContainerLCProps, ModalSC } from "../basic";
import { DateFieldLCProps, TextFieldLCProps } from "../FormikFields";

export interface LoginPageSCProps {
  ContainerLC: React.FC<ContainerLCProps>,
  TextFieldLC: React.FC<TextFieldLCProps>,
  DateFieldLC: React.FC<DateFieldLCProps>,
  ButtonLC: React.FC<ButtonLCProps>
}

// const LoginPageSC = ({ LoginFormLC, SignupFormLC }: LoginPageSCProps) => {
export const LoginPageSC = ({ 
  ContainerLC,
  TextFieldLC,
  DateFieldLC,
  ButtonLC
}: LoginPageSCProps) => {

  const dispatch = useAppDispatch();

  // const user = useAppSelector(state => state.user);

  const [ signupPage, setSignupPage ] = useState(false);
  const { t } = useTranslation();

  const handleLogin = ({ credential, password }: LoginFormValues) => {
    const username = usernameRegExp.test(credential) ? credential : undefined;
    const phonenumber = phonenumberRegExp.test(credential) ? credential : undefined;
    if (!username && !phonenumber) throw new ApplicationError('Validation somehow passed, but credential was not assigned!', { current: { credential } });
    const credentials: LoginUserBody = { username, phonenumber, password };
    void dispatch(sendLogin(credentials, t));
  };

  const handleSignup = (values: SignupFormValues) => {
    const birthdate = values.birthdate ? new Date(values.birthdate).toISOString() : undefined;
    const newUser: NewUserBody = mapEmptyStringsToUndefined({ ...values, birthdate });
    void dispatch(sendNewUser(newUser, t));
    setSignupPage(prev => !prev);
  };

  if (!signupPage) return (
    <ModalSC
      classNameAddon='login'
      active={true}
      title={t('formsLogin.login.title')}
      subtitle={t('formsLogin.login.welcome')}
      wrapper={false}
      ContainerLC={ContainerLC}
    >
      <LoginFormSC
        onSubmit={handleLogin}
        onCancel={() => setSignupPage(prev => !prev)}
        ContainerLC={ContainerLC}
        ButtonLC={ButtonLC}
        TextFieldLC={TextFieldLC}
      />
    </ModalSC>
  );
  else return (
    <ModalSC
      classNameAddon='login'
      active={true}
      title={t('formsLogin.signup.title')}
      subtitle={t('formsLogin.signup.welcome')}
      wrapper={false}
      ContainerLC={ContainerLC}
    >
      <SignupFormSC
        onSubmit={handleSignup}
        onCancel={() => setSignupPage(prev => !prev)}
        ContainerLC={ContainerLC}
        ButtonLC={ButtonLC}
        TextFieldLC={TextFieldLC}
        DateFieldLC={DateFieldLC}
        dateSvgUrl=''
      />
    </ModalSC>
  );
};