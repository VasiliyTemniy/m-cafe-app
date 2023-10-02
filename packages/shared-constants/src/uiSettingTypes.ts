// Maybe will be updated
export const uiSettingTypesReadonly = [
  'classNames',
  'specific',
  'baseVariant',
  'baseColorVariant',
  'inlineCSS'
] as const;

export type UiSettingTypes = typeof uiSettingTypesReadonly[number];

const uiSettingTypesSet = new Set([ ...uiSettingTypesReadonly as readonly string[] ]);

export const uiSettingTypes = [ ...uiSettingTypesReadonly as readonly string[] ];

export const isUiSettingType = (theme: string): theme is UiSettingTypes => {
  return uiSettingTypesSet.has(theme);
};