export enum LocType {
  Name = 'name',
  Description = 'description',
  StockMeasure = 'stockMeasure',
  Text = 'text',
}

export const LocTypeNumericMapping = {
  [LocType.Name]: 0,
  [LocType.Description]: 1,
  [LocType.StockMeasure]: 2,
  [LocType.Text]: 3,
};

export const NumericToLocTypeMapping: { [key: number]: LocType } = {};
Object.values(LocType).forEach((value) => {
  NumericToLocTypeMapping[LocTypeNumericMapping[value]] = value;
});

export const isLocType = (type: unknown): type is LocType => {
  if (!(typeof type === 'string')) {
    return false;
  }
  return Object.values(LocType).includes(type as LocType);
};