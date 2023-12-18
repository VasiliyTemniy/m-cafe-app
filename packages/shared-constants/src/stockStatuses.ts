export enum StockStatus {
  InStock = 'inStock',
  EnRoute = 'enRoute',
}

export const StockStatusNumericMapping = {
  [StockStatus.InStock]: 0,
  [StockStatus.EnRoute]: 1
};

export const NumericToStockStatusMapping: { [key: number]: StockStatus } = {};
Object.values(StockStatus).forEach((value) => {
  NumericToStockStatusMapping[StockStatusNumericMapping[value]] = value;
});

export const isStockStatus = (state: unknown): state is StockStatus => {
  if (!(typeof state === 'string')) {
    return false;
  }
  return Object.values(StockStatus).includes(state as StockStatus);
};