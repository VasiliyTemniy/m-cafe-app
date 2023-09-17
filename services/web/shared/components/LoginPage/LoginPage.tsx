import { useAppDispatch } from '@m-cafe-app/frontend-logic/shared/hooks';
import { sendLogin, sendNewUser } from '@m-cafe-app/frontend-logic/shared/reducers';
import { useTranslation } from '@m-cafe-app/frontend-logic/shared/hooks';
import { useState, useEffect, useRef } from "react";
import { LoginForm, LoginFormValues } from "./LoginForm";
import { SignupForm, SignupFormValues } from "./SignupForm";
import { ApplicationError, LoginUserBody, mapEmptyStringsToUndefined, NewUserBody } from '@m-cafe-app/utils';
import { phonenumberRegExp, usernameRegExp } from "@m-cafe-app/shared-constants";
import { Modal } from "../basic";


interface LoginPageProps {
  modalActive: boolean;
  modalWithBlur?: boolean;
  onCancel: () => void;
}

export const LoginPage = ({
  modalActive,
  modalWithBlur = true,
  onCancel
}: LoginPageProps) => {

  const dispatch = useAppDispatch();

  const observer = useRef<ResizeObserver | null>(null);
  const [signupPage, setSignupPage] = useState(false);
  const [modalWrapperExcludeTop, setModalWrapperExcludeTop] = useState(0);
  const { t } = useTranslation();

  const tNode = 'loginPage';

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

  const handleResize = (header: HTMLElement) => {
    setModalWrapperExcludeTop(header.clientHeight);
  };

  useEffect(() => {
    const header = document.getElementById('app-header');
    if (!header) return;
    observer.current = new ResizeObserver(() => {
      handleResize(header);
    });
    observer.current.observe(header);
    return () => {
      observer.current?.unobserve(header);
    };
  }, []);

  if (!signupPage) return (
    <Modal
      classNameAddon='login'
      active={modalActive}
      title={t(`${tNode}.loginForm.title`)}
      subtitle={t(`${tNode}.loginForm.welcome`)}
      withBlur={modalWithBlur}
      wrapperExcludeTop={modalWrapperExcludeTop}
    >
      <LoginForm
        onSubmit={handleLogin}
        changePage={() => setSignupPage(prev => !prev)}
        onCancel={onCancel}
      />
    </Modal>
  );
  else return (
    <Modal
      classNameAddon='login'
      active={modalActive}
      title={t(`${tNode}.signupForm.title`)}
      subtitle={t(`${tNode}.signupForm.welcome`)}
      withBlur={modalWithBlur}
      wrapperExcludeTop={modalWrapperExcludeTop}
    >
      <SignupForm
        onSubmit={handleSignup}
        changePage={() => setSignupPage(prev => !prev)}
        onCancel={onCancel}
      />
    </Modal>
  );
};