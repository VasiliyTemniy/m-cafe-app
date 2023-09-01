import { useAppDispatch } from '@m-cafe-app/frontend-logic/shared/defineReduxHooks';
import { sendLogin, sendNewUser } from '@m-cafe-app/frontend-logic/shared/reducers';
import { useTranslation } from '@m-cafe-app/frontend-logic/shared/hooks';
import { useState } from "react";
import { LoginFormSC, LoginFormValues } from "./LoginFormSC";
import { SignupFormSC, SignupFormValues } from "./SignupFormSC";
import { ApplicationError, LoginUserBody, mapEmptyStringsToUndefined, NewUserBody } from '@m-cafe-app/utils';
import { phonenumberRegExp, usernameRegExp } from "@m-cafe-app/shared-constants";
import { ModalSC } from "../../scBasic";


export const LoginPageSC = () => {

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
    >
      <LoginFormSC
        onSubmit={handleLogin}
        changePage={() => setSignupPage(prev => !prev)}
        onCancel={() => setSignupPage(prev => !prev)} // CHANGEME! CLOSE PAGE HERE
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
    >
      <SignupFormSC
        onSubmit={handleSignup}
        changePage={() => setSignupPage(prev => !prev)}
        onCancel={() => setSignupPage(prev => !prev)} // CHANGEME! CLOSE PAGE HERE
      />
    </ModalSC>
  );
};