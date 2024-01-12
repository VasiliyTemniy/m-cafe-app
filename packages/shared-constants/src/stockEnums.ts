export enum StockStatus {
  InStock = 0,
  EnRoute = 1,
}

export const isStockStatus = (state: unknown): state is StockStatus =>
  (typeof state === 'number' || typeof state === 'string') && (state in StockStatus);


export enum StockEntityType {
  Product = 0,
  Ingredient = 1,
}

export const isStockEntityType = (type: unknown): type is StockEntityType =>
  (typeof type === 'number' || typeof type === 'string') && (type in StockEntityType);