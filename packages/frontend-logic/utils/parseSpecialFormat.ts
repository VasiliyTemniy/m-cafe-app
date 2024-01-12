import type { FixedLocDT, UiSettingDT } from '@m-market-app/utils';

export const parseFixedLoc = (fixedLoc: FixedLocDT): { parsedFixedLoc: FixedLocDT, namespace: string } => {
  const firstDotIndex = fixedLoc.name.indexOf('.');
  const namespace = fixedLoc.name.slice(0, firstDotIndex);
  const shortLocName = fixedLoc.name.slice(firstDotIndex + 1);
  const parsedFixedLoc = { ...fixedLoc, name: shortLocName };

  return { parsedFixedLoc, namespace };
};

export const parseUiSetting = (uiSetting: UiSettingDT): { parsedUiSetting: UiSettingDT, uiNode: string } => {
  const firstDotIndex = uiSetting.name.indexOf('.');
  const uiNode = uiSetting.name.slice(0, firstDotIndex);
  const uiSettingName = uiSetting.name.slice(firstDotIndex + 1);
  const parsedUiSetting = { ...uiSetting, name: uiSettingName };

  return { parsedUiSetting, uiNode };
};