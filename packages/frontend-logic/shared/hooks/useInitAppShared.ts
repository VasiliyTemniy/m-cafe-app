import { isAllowedTheme } from '@m-market-app/shared-constants';
import { useEffect } from 'react';
import { useTranslation } from './useTranslation';
import { setTheme, sendRefreshToken, setLanguage } from '../reducers';
import { useAppDispatch, useAppSelector } from './reduxHooks';
import { isString } from '@m-market-app/utils';
import { getFirstBrowserLanguage } from '../../utils';

export const useInitAppShared = () => {

  const { t } = useTranslation();

  const dispatch = useAppDispatch();

  const theme = useAppSelector(state => state.settings.theme);
  const language = useAppSelector(state => state.settings.language);
  const locsHash = useAppSelector(state => state.fixedLocs.parsedFixedLocsHash);
  const user = useAppSelector(state => state.user);

  useEffect(() => {
    const storedTheme = window.localStorage.getItem('marketAppTheme');
    if (!storedTheme) window.localStorage.setItem('marketAppTheme', JSON.stringify(theme));
    else { 
      const parsedTheme = JSON.parse(storedTheme) as unknown;
      if (isString(parsedTheme) && parsedTheme !== theme && (isAllowedTheme(parsedTheme))) {
        void dispatch(setTheme(parsedTheme));
      }
    }
    const userRegistered = window.localStorage.getItem('marketAppUserRegistered');
    if (!user.phonenumber && userRegistered && JSON.parse(userRegistered) === 'true') {
      void dispatch(sendRefreshToken(t));
    }
  }, []);

  useEffect(() => {
    const preferredLanguage = window.localStorage.getItem('marketAppLanguage');
    if (!preferredLanguage) {
      // No preferred language found - check browser navigator for lang info
      const detectedLanguage = getFirstBrowserLanguage();
      if (!detectedLanguage) {
        // No language detected in browser navigator - set main language
        window.localStorage.setItem('marketAppLanguage', JSON.stringify('main'));
      } else {
        for (const languageAlias of ['main', 'sec', 'alt']) {
          // Check if any of provided languages is detected
          if (detectedLanguage.startsWith(t(`main.detectLanguageNames.${languageAlias}`))) {
            window.localStorage.setItem('marketAppLanguage', JSON.stringify(languageAlias));
            break;
          }
        }
      }
    } else /* preferredLanguage was found in localStorage */ {
      const parsedPreferredLanguage = JSON.parse(preferredLanguage) as 'main' | 'sec' | 'alt';
      if (parsedPreferredLanguage !== language) {
        void dispatch(setLanguage(parsedPreferredLanguage));
      }
    }
  }, [locsHash]);

  return { user };
  
};