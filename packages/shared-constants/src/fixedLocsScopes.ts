import { possibleUserRights } from './possibleUserRights';

export const fixedLocsScopesReadonly = [
  ...possibleUserRights,
  'shared',
  'staff'
] as const;

export type FixedLocsScope = typeof fixedLocsScopesReadonly[number];

export const fixedLocsScopes = [ ...fixedLocsScopesReadonly as readonly string[] ];