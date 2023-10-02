// Maybe will be updated
export const allowedThemesReadonly = [
  'dark',
  'light'
] as const;

export type AllowedThemes = typeof allowedThemesReadonly[number];

const allowedThemesSet = new Set([ ...allowedThemesReadonly as readonly string[] ]);

export const allowedThemes = [ ...allowedThemesReadonly as readonly string[] ];

export const isAllowedTheme = (theme: string): theme is AllowedThemes => {
  return allowedThemesSet.has(theme);
};