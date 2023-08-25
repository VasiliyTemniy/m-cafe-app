import { useAppDispatch, useAppSelector } from "../../hooks/reduxHooks";
import { useState } from "react";
import { useTranslation } from "react-i18next";

import { sendLogin, sendNewUser } from "../../reducers/userReducer";

import LoginForm from "./LoginForm";
import SignupForm, { SignupFormValues } from "./SignupForm";

import { LoginFormValues } from './LoginForm';
import Modal from "../common/Modal";

const LoginPage = () => {

  const dispatch = useAppDispatch();

  const user = useAppSelector(state => state.user);

  const [ submitPage, setSubmitPage ] = useState(false);
  const { t } = useTranslation();

  // TODO here is login only by password and username. Add others later
  const handleLogin = ({ username, password }: LoginFormValues) => {
    void dispatch(sendLogin({ username, password }, user.geoLocHash, t));
  };

  const handleSignup = (values: SignupFormValues) => {
    void dispatch(sendNewUser({ ...values }, t));
    setSubmitPage(prev => !prev);
  };

  if (!submitPage) return (
    <Modal
      className='login'
      active={true}
      title={t('formsLogin.login.title')}
      subtitle={t('formsLogin.login.welcome')}
      wrapper={false}
    >
      <LoginForm onSubmit={handleLogin} onCancel={() => setSubmitPage(prev => !prev)}/>
    </Modal>
  );
  else return (
    <Modal
      className='login'
      active={true}
      title={t('formsLogin.signup.title')}
      subtitle={t('formsLogin.signup.welcome')}
      wrapper={false}
    >
      <SignupForm onSubmit={handleSignup} onCancel={() => setSubmitPage(prev => !prev)}/>
    </Modal>
  );

};

export default LoginPage;