export enum UiSettingType {
  ClassName = 'className',
  Specific = 'specific',
  BaseVariant = 'baseVariant',
  BaseColorVariant = 'baseColorVariant',
  InlineCSS = 'inlineCSS'
}

export const UiSettingTypeNumericMapping = {
  [UiSettingType.ClassName]: 0,
  [UiSettingType.Specific]: 1,
  [UiSettingType.BaseVariant]: 2,
  [UiSettingType.BaseColorVariant]: 3,
  [UiSettingType.InlineCSS]: 4
};  

export const NumericToUiSettingTypeMapping: { [key: number]: UiSettingType } = {};
Object.values(UiSettingType).forEach((value) => {
  NumericToUiSettingTypeMapping[UiSettingTypeNumericMapping[value]] = value;
});

export const isUiSettingType = (type: unknown): type is UiSettingType => {
  if (!(typeof type === 'string')) {
    return false;
  }
  return Object.values(UiSettingType).includes(type as UiSettingType);
};


export enum UiSettingClassName {
  Glass = 'glass',
  Rounded = 'rounded',
  Rectangular = 'rectangular',
  Smaller = 'smaller',
  Larger = 'larger',
  SmallerText = 'smaller-text',
  LargerText = 'larger-text',
  Shadowed = 'shadowed'
}

export const UiSettingClassNameNumericMapping = {
  [UiSettingClassName.Glass]: 0,
  [UiSettingClassName.Rounded]: 1,
  [UiSettingClassName.Rectangular]: 2,
  [UiSettingClassName.Smaller]: 3,
  [UiSettingClassName.Larger]: 4,
  [UiSettingClassName.SmallerText]: 5,
  [UiSettingClassName.LargerText]: 6,
  [UiSettingClassName.Shadowed]: 7
};

export const NumericToUiSettingClassNameMapping: { [key: number]: UiSettingClassName } = {};
Object.values(UiSettingClassName).forEach((value) => {
  NumericToUiSettingClassNameMapping[UiSettingClassNameNumericMapping[value]] = value;
});

export const isUiSettingClassName = (className: unknown): className is UiSettingClassName => {
  if (!(typeof className === 'string')) {
    return false;
  }
  return Object.values(UiSettingClassName).includes(className as UiSettingClassName);
};


export enum UiSettingTheme {
  Dark = 'dark',
  Light = 'light'
}

export const UiSettingThemeNumericMapping = {
  [UiSettingTheme.Dark]: 0,
  [UiSettingTheme.Light]: 1
};

export const NumericToUiSettingThemeMapping: { [key: number]: UiSettingTheme } = {};
Object.values(UiSettingTheme).forEach((value) => {
  NumericToUiSettingThemeMapping[UiSettingThemeNumericMapping[value]] = value;
});

export const isUiSettingTheme = (theme: unknown): theme is UiSettingTheme => {
  if (!(typeof theme === 'string')) {
    return false;
  }
  return Object.values(UiSettingTheme).includes(theme as UiSettingTheme);
};


export enum UiSettingInlineCSS {
  BackgroundColor = 'backgroundColor',
  BorderRadius = 'borderRadius',
  Height = 'height',
  Width = 'width'
}

export const UiSettingInlineCSSNumericMapping = {
  [UiSettingInlineCSS.BackgroundColor]: 0,
  [UiSettingInlineCSS.BorderRadius]: 1,
  [UiSettingInlineCSS.Height]: 2,
  [UiSettingInlineCSS.Width]: 3
};

export const NumericToUiSettingInlineCSSMapping: { [key: number]: UiSettingInlineCSS } = {};
Object.values(UiSettingInlineCSS).forEach((value) => {
  NumericToUiSettingInlineCSSMapping[UiSettingInlineCSSNumericMapping[value]] = value;
});

export const isUiSettingInlineCSS = (inlineCSS: unknown): inlineCSS is UiSettingInlineCSS => {
  if (!(typeof inlineCSS === 'string')) {
    return false;
  }
  return Object.values(UiSettingInlineCSS).includes(inlineCSS as UiSettingInlineCSS);
};