import type { UiSettingDT } from '@m-market-app/utils';
import { useCallback } from 'react';
import { useAppSelector } from './reduxHooks';

export type UIFunction = (uiNode: string) => UiSettingDT[];

/**
 * Returns ui function that gives memoised array of parsed ui settings by uiNode
 * 
 * uiNode examples
 * @example
 * uiNode === 'input-dark-baseVariant'
 * uiNode === 'modal-light-inlineCSS'
 * etc
 */
export const useUiSettings = (): { ui: UIFunction } => {

  const theme = useAppSelector(store => store.settings.theme);
  const uiSettings = useAppSelector(state => state.settings.parsedUiSettings);
  const uiSettingsHash = useAppSelector(state => state.settings.parsedUiSettingsHash);

  const ui = useCallback((uiNode: string) => {
    if (!uiSettings[uiNode]) return [];
    // For admin module, ui settings filter is applied before component init, not inside of a reducer to preserve falsy settings in state
    const result = process.env.FRONTEND_MODULE_ADMIN
      ? uiSettings[uiNode].filter(uiSetting => uiSetting.value !== 'false')
      : uiSettings[uiNode];
    return result;
  }, [theme, uiSettingsHash]);

  return { ui };
};