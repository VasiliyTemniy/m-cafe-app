export enum FixedLocScope {
  Customer = 'customer',
  Manager = 'manager',
  Admin = 'admin',
  Shared = 'shared',
  Staff = 'staff'
}

export const FixedLocScopeNumericMapping = {
  [FixedLocScope.Customer]: 0,
  [FixedLocScope.Manager]: 1,
  [FixedLocScope.Admin]: 2,
  [FixedLocScope.Shared]: 3,
  [FixedLocScope.Staff]: 4,
};

export const NumericToFixedLocScopeMapping: { [key: number]: FixedLocScope } = {};
Object.values(FixedLocScope).forEach((value) => {
  NumericToFixedLocScopeMapping[FixedLocScopeNumericMapping[value]] = value;
});

export const isFixedLocScope = (scope: unknown): scope is FixedLocScope => {
  if (!(typeof scope === 'string')) {
    return false;
  }
  return Object.values(FixedLocScope).includes(scope as FixedLocScope);
};