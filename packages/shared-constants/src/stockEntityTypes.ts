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