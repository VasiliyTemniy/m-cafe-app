// Maybe will be updated
const allowedThemesConst = [
  'dark',
  'light'
] as const;

export type AllowedThemes = typeof allowedThemesConst[number];

const allowedThemesSet = new Set([ ...allowedThemesConst as readonly string[] ]);

export const allowedThemes = [ ...allowedThemesConst as readonly string[] ];

export const isAllowedTheme = (theme: string): theme is AllowedThemes => {
  return allowedThemesSet.has(theme);
};