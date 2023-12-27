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


export enum StockEntityType {
  Product = 'product',
  Ingredient = 'ingredient',
}

export const StockEntityTypeNumericMapping = {
  [StockEntityType.Product]: 0,
  [StockEntityType.Ingredient]: 1,
};

export const NumericToStockEntityTypeMapping: { [key: number]: StockEntityType } = {};
Object.values(StockEntityType).forEach((value) => {
  NumericToStockEntityTypeMapping[StockEntityTypeNumericMapping[value]] = value;
});

export const isStockEntityType = (type: unknown): type is StockEntityType => {
  if (!(typeof type === 'string')) {
    return false;
  }
  return Object.values(StockEntityType).includes(type as StockEntityType);
};