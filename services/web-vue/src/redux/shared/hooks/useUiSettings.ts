import type { UiSettingDT } from "@m-cafe-app/utils";
import { useAppSelector } from "./reduxHooks";

export type UIFunction = (uiNode: string) => UiSettingDT[];

/**
 * Gives memoised array of actual (non-falsy) ui settings by uiNode
 */
export const useUiSettings = (): { ui: UIFunction } => {

  const actualUiSettings = useAppSelector(state => state.settings.actualUiSettings);

  const ui = (uiNode: string) => {
    return actualUiSettings[uiNode] ? actualUiSettings[uiNode] : [];
  };

  return { ui };
};