export enum FixedLocScope {
  Customer = 0,
  Manager = 1,
  Admin = 2,
  Shared = 3,
  Staff = 4
}

export const isFixedLocScope = (scope: unknown): scope is FixedLocScope =>
  (typeof scope === 'number' || typeof scope === 'string') && (scope in FixedLocScope);