import { useAppDispatch } from '@m-cafe-app/frontend-logic/shared/hooks';
import { sendLogin, sendNewUser } from '@m-cafe-app/frontend-logic/shared/reducers';
import { useTranslation } from '@m-cafe-app/frontend-logic/shared/hooks';
import { useState } from "react";
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

  const [ signupPage, setSignupPage ] = useState(false);
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

  if (!signupPage) return (
    <Modal
      classNameAddon='login'
      active={modalActive}
      title={t(`${tNode}.loginForm.title`)}
      subtitle={t(`${tNode}.loginForm.welcome`)}
      withBlur={modalWithBlur}
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
    >
      <SignupForm
        onSubmit={handleSignup}
        changePage={() => setSignupPage(prev => !prev)}
        onCancel={onCancel}
      />
    </Modal>
  );
};