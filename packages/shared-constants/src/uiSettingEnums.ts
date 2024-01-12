export enum UiSettingType {
  ClassName = 0,
  Specific = 1,
  BaseVariant = 2,
  BaseColorVariant = 3,
  InlineCSS = 4
}

export const isUiSettingType = (type: unknown): type is UiSettingType =>
  (typeof type === 'number' || typeof type === 'string') && (type in UiSettingType);


export enum UiSettingClassName {
  Glass = 0,
  Rounded = 1,
  Rectangular = 2,
  Smaller = 3,
  Larger = 4,
  SmallerText = 5,
  LargerText = 6,
  Shadowed = 7
}

export const isUiSettingClassName = (className: unknown): className is UiSettingClassName =>
  (typeof className === 'number' || typeof className === 'string') && (className in UiSettingClassName);


export enum UiSettingTheme {
  Dark = 0,
  Light = 1
}

export const isUiSettingTheme = (theme: unknown): theme is UiSettingTheme =>
  (typeof theme === 'number' || typeof theme === 'string') && (theme in UiSettingTheme);


export enum UiSettingInlineCSS {
  BackgroundColor = 0,
  BorderRadius = 1,
  Height = 2,
  Width = 3
}

export const isUiSettingInlineCSS = (inlineCSS: unknown): inlineCSS is UiSettingInlineCSS =>
  (typeof inlineCSS === 'number' || typeof inlineCSS === 'string') && (inlineCSS in UiSettingInlineCSS);


export enum UiSettingComponentGroup {
  Input = 0,
  Container = 1,
  Wrapper = 2,
  Tooltip = 3,
  Text = 4,
  Button = 5,
  ButtonGroup = 6,
  NavItem = 7,
  Notification = 8,
  Modal = 9,
  SvgImage = 10,
  SvgButton = 11,
  Switch = 12,
  Dropbox = 13,
  Table = 14,
  Image = 15,
  Scrollbar = 16,
  // Layout components will be added by names as keys later
}

export const isUiSettingComponentGroup = (componentType: unknown): componentType is UiSettingComponentGroup =>
  (typeof componentType === 'number' || typeof componentType === 'string') && (componentType in UiSettingComponentGroup);