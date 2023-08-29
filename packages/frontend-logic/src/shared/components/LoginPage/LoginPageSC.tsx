import {
  useAppDispatch,
  useTranslation,
  sendLogin,
  sendNewUser
} from "../../index";
import { useState } from "react";
import { LoginFormLCProps, LoginFormValues } from "./LoginFormSC";
import { SignupFormLCProps, SignupFormValues } from "./SignupFormSC";
import { ApplicationError, LoginUserBody, mapEmptyStringsToUndefined, NewUserBody } from '@m-cafe-app/utils';
import { phonenumberRegExp, usernameRegExp } from "@m-cafe-app/shared-constants";

export interface LoginPageSCProps {
  LoginFormLC: React.FC<LoginFormLCProps>,
  SignupFormLC: React.FC<SignupFormLCProps>
}

const LoginPageSC = ({ LoginFormLC, SignupFormLC }: LoginPageSCProps) => {

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
    // Legacy code, will be transfered to LC
    // <Modal
    //   className='login'
    //   active={true}
    //   title={t('formsLogin.login.title')}
    //   subtitle={t('formsLogin.login.welcome')}
    //   wrapper={false}
    // >
    //   <LoginForm onSubmit={handleLogin} onCancel={() => setSignupPage(prev => !prev)}/>
    // </Modal>
    <LoginFormLC onSubmit={handleLogin} onCancel={() => setSignupPage(prev => !prev)}/>
  );
  else return (
    // Legacy code, will be transfered to LC
    // <Modal
    //   className='login'
    //   active={true}
    //   title={t('formsLogin.signup.title')}
    //   subtitle={t('formsLogin.signup.welcome')}
    //   wrapper={false}
    // >
    //   <SignupForm onSubmit={handleSignup} onCancel={() => setSignupPage(prev => !prev)}/>
    // </Modal>
    <SignupFormLC onSubmit={handleSignup} onCancel={() => setSignupPage(prev => !prev)}/>
  );

};

export default LoginPageSC;