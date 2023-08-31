import { useCallback } from 'react';
import { UiSettingDT } from "@m-cafe-app/utils";
import { useAppSelector } from "../index";

export type UIFunction = (uiNode: string) => UiSettingDT[];

/**
 * Maps uiSettings from state, gives uiSetting names as second part after dot
 */
export const useUiSettings = (): { ui: UIFunction } => {

  const theme = useAppSelector(store => store.settings.theme);

  const ui = useCallback((uiNode: string) => {
    const stateUiSettings = useAppSelector(state => state.settings.uiSettings[uiNode]);
    const uiSettings = stateUiSettings.map(uiSetting => {
      const uiSettingName = uiSetting.name.split('.')[1];
      return {
        ...uiSetting,
        name: uiSettingName ? uiSettingName : ''
      };
    });
    return uiSettings;
  }, [theme]);

  return { ui };
};