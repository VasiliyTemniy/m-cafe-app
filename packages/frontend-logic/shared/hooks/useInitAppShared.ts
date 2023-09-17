import { isAllowedTheme } from "@m-cafe-app/shared-constants";
import { useLayoutEffect } from "react";
import { useTranslation } from "./useTranslation";
import { initFixedLocs, initUiSettings, setTheme, sendRefreshToken } from "../reducers";
import { useAppDispatch, useAppSelector } from "./reduxHooks";
import { isString } from "@m-cafe-app/utils";

export const useInitAppShared = () => {

  const { t } = useTranslation();

  const dispatch = useAppDispatch();

  const theme = useAppSelector(state => state.settings.theme);
  const user = useAppSelector(state => state.user);

  useLayoutEffect(() => {
    void dispatch(initFixedLocs(t));
    void dispatch(initUiSettings(t));
    const storedTheme = window.localStorage.getItem('CafeAppTheme');
    if (!storedTheme) window.localStorage.setItem('CafeAppTheme', JSON.stringify(theme));
    else { 
      const parsedTheme = JSON.parse(storedTheme) as unknown;
      if (isString(parsedTheme) && parsedTheme !== theme && (isAllowedTheme(parsedTheme))) {
        void dispatch(setTheme(parsedTheme));
      }
    }
    const userRegistered = window.localStorage.getItem('CafeAppUserRegistered');
    if (!user.phonenumber && userRegistered && JSON.parse(userRegistered) === 'true') {
      void dispatch(sendRefreshToken(t));
    }
  }, []);

  return { user };
  
};