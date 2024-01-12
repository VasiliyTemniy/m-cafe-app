import type { OrderS } from './Order';


export class Carrier {
  constructor (
    readonly id: number,
    readonly name: string,
    readonly contactNumbers: string,
    readonly orders?: OrderS[]
  ) {}
}