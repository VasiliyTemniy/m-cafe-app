import type { ProductS } from './Product.js';

/**
 * OrderProduct contains quantity, archiveProductPrice, archiveProductId, archiveProductName and orderId\
 * Product record is optional because product db record can be deleted after order creation
 */
export class OrderProduct {
  constructor (
    readonly quantity: number,
    readonly archiveProductPrice: number,
    readonly archiveProductId: number,
    readonly archiveProductName: string,
    readonly orderId?: number, // Maybe delete this?
    readonly product?: ProductS
  ) {}
}