import type { UiSettingDT } from '@m-cafe-app/utils';
import { useCallback } from 'react';
import { useAppSelector } from './reduxHooks';

export type UIFunction = (uiNode: string) => UiSettingDT[];

/**
 * Gives memoised array of actual (non-falsy) ui settings by uiNode
 */
export const useUiSettings = (): { ui: UIFunction } => {

  const theme = useAppSelector(store => store.settings.theme);
  const actualUiSettings = useAppSelector(state => state.settings.actualUiSettings);
  const uiSettingsHash = useAppSelector(state => state.settings.uiSettingsHash);

  const ui = useCallback((uiNode: string) => {
    return actualUiSettings[uiNode] ? actualUiSettings[uiNode] : [];
  }, [theme, uiSettingsHash]);

  return { ui };
};