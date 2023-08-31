// Maybe will be updated
const possibleCSSPropertiesKeys = [
  'backgroundColor',
  'borderRadius'
] as const;

export type PossibleCSSPropertiesKeys = typeof possibleCSSPropertiesKeys[number];

const possibleCSSPropertiesKeysSet = new Set([ ...possibleCSSPropertiesKeys as readonly string[] ]);

export const isCSSPropertyKey = (key: string): key is PossibleCSSPropertiesKeys => {
  return possibleCSSPropertiesKeysSet.has(key);
};