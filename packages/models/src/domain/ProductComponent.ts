import type { IngredientS } from './Ingredient';
import type { ProductS } from './Product';

export class ProductComponent {
  constructor (
    readonly component: IngredientS | ProductS,
    readonly quantity: number,
    readonly compositeProduct: boolean
  ) {}
}