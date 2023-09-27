import type { LoginFormValues } from './LoginForm';
import type { SignupFormValues } from './SignupForm';
import type { LoginUserBody, NewUserBody } from '@m-cafe-app/utils';
import { useAppDispatch } from '@m-cafe-app/frontend-logic/shared/hooks';
import { sendLogin, sendNewUser } from '@m-cafe-app/frontend-logic/shared/reducers';
import { useTranslation } from '@m-cafe-app/frontend-logic/shared/hooks';
import { useState, useEffect, useRef } from 'react';
import { LoginForm } from './LoginForm';
import { SignupForm } from './SignupForm';
import { ApplicationError, mapEmptyStringsToUndefined } from '@m-cafe-app/utils';
import { phonenumberRegExp, usernameRegExp } from '@m-cafe-app/shared-constants';
import { Modal } from '../basic';


interface AuthModalProps {
  modalActive: boolean;
  modalWithBlur?: boolean;
  authModalInitialMode: 'login' | 'signup';
  onCancel: () => void;
  loginNecessary?: boolean;
}

export const AuthModal = ({
  modalActive,
  modalWithBlur = true,
  authModalInitialMode,
  onCancel,
  loginNecessary
}: AuthModalProps) => {

  const dispatch = useAppDispatch();

  const observer = useRef<ResizeObserver | null>(null);
  const [modalWrapperExcludeTop, setModalWrapperExcludeTop] = useState(0);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'signup'>('login');
  const { t } = useTranslation();

  useEffect(() => {
    if (authModalInitialMode) {
      setAuthModalMode(authModalInitialMode);
    }
  }, [authModalInitialMode]);

  const tNode = 'authModal';

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
    setAuthModalMode('login');
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

  if (authModalMode === 'login') return (
    <Modal
      classNameAddon='auth'
      active={modalActive}
      title={t(`${tNode}.loginForm.title`)}
      subtitle={t(`${tNode}.loginForm.welcome`)}
      withBlur={modalWithBlur}
      wrapperExcludeTop={modalWrapperExcludeTop}
    >
      <LoginForm
        onSubmit={handleLogin}
        changeMode={() => setAuthModalMode('signup')}
        onCancel={onCancel}
        loginNecessary={loginNecessary}
      />
    </Modal>
  );
  else return (
    <Modal
      classNameAddon='auth'
      active={modalActive}
      title={t(`${tNode}.signupForm.title`)}
      subtitle={t(`${tNode}.signupForm.welcome`)}
      withBlur={modalWithBlur}
      wrapperExcludeTop={modalWrapperExcludeTop}
    >
      <SignupForm
        onSubmit={handleSignup}
        changeMode={() => setAuthModalMode('login')}
        onCancel={onCancel}
        loginNecessary={loginNecessary}
      />
    </Modal>
  );
};