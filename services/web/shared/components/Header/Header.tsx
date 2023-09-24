import type { MouseEvent } from 'react';
import { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector, useInitLC, useTranslation } from '@m-cafe-app/frontend-logic/shared/hooks';
// import { sendLogout, setTheme } from "@m-cafe-app/frontend-logic/shared/reducers";
import { setTheme } from '@m-cafe-app/frontend-logic/shared/reducers';
import { Button, ButtonGroup, Switch, TextComp, Image } from '../basic';
import { apiBaseUrl, fixedLocFilter } from '@m-cafe-app/shared-constants';
import { LanguageBox } from './LanguageBox';
import { Cart } from '../Cart';
import { AuthModal } from '../AuthModal';

export interface HeaderProps {
  loginNecessary?: boolean
}

export const Header = ({
  loginNecessary
}: HeaderProps) => {

  const { t } = useTranslation();
  const dispatch = useAppDispatch();

  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalInitialMode, setAuthModalInitialMode] = useState<'login' | 'signup'>('login');

  useEffect(() => {
    if (loginNecessary) {
      setAuthModalOpen(loginNecessary);
    }
  }, [loginNecessary]);

  const selectedTheme = useAppSelector(state => state.settings.theme);
  const user = useAppSelector(state => state.user);

  const { className, style } = useInitLC({
    componentType: 'layout',
    componentName: 'header'
  });

  const languagesTNode = 'main.fullLanguageNames';
  const languages = [ 'main' ];
  if (t(`${languagesTNode}.sec`) !== fixedLocFilter) languages.push('sec');
  if (t(`${languagesTNode}.alt`) !== fixedLocFilter) languages.push('alt');

  const handleThemeSwitchClick = (e: MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (selectedTheme === 'light') dispatch(setTheme('dark'));
    else dispatch(setTheme('light'));
  };

  const handleProfileClick = () => {
    console.log('Redirect to profile page');
  };

  // const handleLogoutClick = () => {
  //   void dispatch(sendLogout(t));
  // };

  const handleAuthModalCancel = () => {
    if (loginNecessary) {
      // SHOW NOTIFICATION HERE!
      return null;
    } else {
      setAuthModalOpen(false);
    }
  };

  const handleOpenLoginModal = () => {
    if (authModalInitialMode !== 'login') {
      setAuthModalInitialMode('login');
    }
    setAuthModalOpen(true);
  };

  const handleOpenSignupModal = () => {
    if (authModalInitialMode !== 'signup') {
      setAuthModalInitialMode('signup');
    }
    setAuthModalOpen(true);
  };

  const loggedInText = 
    user.username ? user.username :
    user.name ? user.name :
    user.phonenumber;

  return (
    <header className={className} style={style} id='app-header'>
      <div className='header-left'>
        {/* App logo, some info here */}
      </div>
      <div className='header-right'>
        {languages.length > 1 && 
          <LanguageBox languages={languages} languagesTNode={languagesTNode}/>
        }
        <Switch
          checked={selectedTheme === 'light'}
          id='theme-selector'
          onClick={handleThemeSwitchClick}
          textLeft={t('main.theme.light')}
          textRight={t('main.theme.dark')}
        />
        {user.phonenumber
          ?
          <div className='header-auth-wrapper'>
            <div className='logged-in' onClick={handleProfileClick}>
              <Image src={`${apiBaseUrl}/public/pictures/svg/profile.svg`} classNameAddon='svg'/>
              <TextComp text={loggedInText}/>
            </div>
            {/* <Button label={t('main.buttonLabel.logout')} classNameAddon='small' onClick={handleLogoutClick}/>  MOVE LOGOUT TO PROFILE VIEW*/}
          </div>
          :
          <div className='header-auth-wrapper'>
            <ButtonGroup>
              <Button
                label={t('main.buttonLabel.login')}
                classNameAddon='small'
                onClick={handleOpenLoginModal}
                disabled={authModalOpen}
              />
              <Button
                label={t('main.buttonLabel.signup')}
                classNameAddon='small'
                onClick={handleOpenSignupModal}
                variant='secondary'
                disabled={authModalOpen}
              />
            </ButtonGroup>
            <AuthModal
              modalActive={authModalOpen}
              authModalInitialMode={authModalInitialMode}
              onCancel={handleAuthModalCancel}
              loginNecessary={loginNecessary}
            />
          </div>
        }
        <Cart/>
      </div>
    </header>
  );
};