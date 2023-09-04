import { isAllowedTheme } from "@m-cafe-app/shared-constants";
import { useLayoutEffect } from "react";
import { useTranslation } from "./useTranslation";
import { initFixedLocs, initUiSettings, setTheme } from "../../admin/reducers";
import { useAppDispatch, useAppSelector } from "./reduxHooks";

export const useInitAppShared = () => {

  const { t } = useTranslation();

  const dispatch = useAppDispatch();

  const theme = useAppSelector((state) => state.settings.theme);

  useLayoutEffect(() => {
    void dispatch(initFixedLocs(t));
    void dispatch(initUiSettings(t));
    const storedTheme = window.localStorage.getItem('CafeAppTheme');
    if (!storedTheme) window.localStorage.setItem('CafeAppTheme', JSON.stringify(theme));
    else if (JSON.parse(storedTheme) !== theme && (isAllowedTheme(storedTheme))) {
      void dispatch(setTheme({ theme: storedTheme }));
    }
  }, []);
  
};