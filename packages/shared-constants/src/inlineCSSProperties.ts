// Maybe will be updated
const allowedCSSPropertiesKeys = [
  'backgroundColor',
  'borderRadius',
  'height',
  'width'
] as const;

export type AllowedCSSPropertiesKeys = typeof allowedCSSPropertiesKeys[number];

export type AllowedCSSProperties = {
  [key in AllowedCSSPropertiesKeys]: string | number;
};

const allowedCSSPropertiesKeysSet = new Set([ ...allowedCSSPropertiesKeys as readonly string[] ]);

export const isCSSPropertyKey = (key: string): key is AllowedCSSPropertiesKeys => {
  return allowedCSSPropertiesKeysSet.has(key);
};