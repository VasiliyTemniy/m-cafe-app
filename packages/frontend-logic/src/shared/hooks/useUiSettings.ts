import { useCallback } from 'react';
import { UiSettingDT } from "@m-cafe-app/utils";
import { useAppSelector } from "../../customer/hooks/reduxHooks";

export type UIFunction = (uiNode: string) => UiSettingDT[];

export const useUiSettings = (): { ui: UIFunction } => {

  const theme = useAppSelector(store => store.settings.theme);

  const ui = useCallback((uiNode: string) => {
    const uiSettings = useAppSelector(state => state.settings.uiSettings[uiNode]);
    return uiSettings;
  }, [theme]);

  return { ui };
};