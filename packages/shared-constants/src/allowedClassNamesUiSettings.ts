// Maybe will be updated
export const allowedClassNamesUiSettingsReadonly = [
  'glass',
  'rounded',
  'rectangular',
  'smaller',
  'larger',
  'smaller-text',
  'larger-text',
  'shadowed',
] as const;

export type AllowedClassNamesUiSettings = typeof allowedClassNamesUiSettingsReadonly[number];

const allowedClassNamesUiSettingsSet = new Set([ ...allowedClassNamesUiSettingsReadonly as readonly string[] ]);

export const allowedClassNamesUiSettings = [ ...allowedClassNamesUiSettingsReadonly as readonly string[] ];

export const isAllowedClassNameUiSetting = (uiSetting: string): uiSetting is AllowedClassNamesUiSettings => {
  return allowedClassNamesUiSettingsSet.has(uiSetting);
};