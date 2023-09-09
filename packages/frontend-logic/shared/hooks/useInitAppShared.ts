import { isAllowedTheme } from "@m-cafe-app/shared-constants";
import { useLayoutEffect } from "react";
import { useTranslation } from "./useTranslation";
import { initFixedLocs, initUiSettings, setTheme, sendRefreshToken } from "../reducers";
import { useAppDispatch, useAppSelector } from "./reduxHooks";

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
    else if (JSON.parse(storedTheme) !== theme && (isAllowedTheme(storedTheme))) {
      void dispatch(setTheme(storedTheme));
    }
    const userRegistered = window.localStorage.getItem('CafeAppUserRegistered');
    if (!user.phonenumber && userRegistered && JSON.parse(userRegistered) === 'true') {
      void dispatch(sendRefreshToken(t));
    }
  }, []);
  
};