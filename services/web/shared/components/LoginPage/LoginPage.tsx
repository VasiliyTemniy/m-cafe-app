import { useAppDispatch } from '@m-cafe-app/frontend-logic/shared/defineReduxHooks';
import { sendLogin, sendNewUser } from '@m-cafe-app/frontend-logic/shared/reducers';
import { useTranslation } from '@m-cafe-app/frontend-logic/shared/hooks';
import { useState } from "react";
import { LoginForm, LoginFormValues } from "./LoginForm";
import { SignupForm, SignupFormValues } from "./SignupForm";
import { ApplicationError, LoginUserBody, mapEmptyStringsToUndefined, NewUserBody } from '@m-cafe-app/utils';
import { phonenumberRegExp, usernameRegExp } from "@m-cafe-app/shared-constants";
import { Modal } from "../basic";


export const LoginPage = () => {

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
    <Modal
      classNameAddon='login'
      active={true}
      title={t('formsLogin.login.title')}
      subtitle={t('formsLogin.login.welcome')}
      wrapper={false}
    >
      <LoginForm
        onSubmit={handleLogin}
        changePage={() => setSignupPage(prev => !prev)}
        onCancel={() => setSignupPage(prev => !prev)} // CHANGEME! CLOSE PAGE HERE
      />
    </Modal>
  );
  else return (
    <Modal
      classNameAddon='login'
      active={true}
      title={t('formsLogin.signup.title')}
      subtitle={t('formsLogin.signup.welcome')}
      wrapper={false}
    >
      <SignupForm
        onSubmit={handleSignup}
        changePage={() => setSignupPage(prev => !prev)}
        onCancel={() => setSignupPage(prev => !prev)} // CHANGEME! CLOSE PAGE HERE
      />
    </Modal>
  );
};