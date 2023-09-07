// Maybe will be updated
const uiSettingTypesConst = [
  'classNames',
  'special',
  'baseVariant',
  'inlineCSS'
] as const;

export type UiSettingTypes = typeof uiSettingTypesConst[number];

const uiSettingTypesSet = new Set([ ...uiSettingTypesConst as readonly string[] ]);

export const uiSettingTypes = [ ...uiSettingTypesConst as readonly string[] ];

export const isUiSettingType = (theme: string): theme is UiSettingTypes => {
  return uiSettingTypesSet.has(theme);
};