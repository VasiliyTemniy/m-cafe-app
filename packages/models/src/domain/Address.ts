export class Address {
  constructor (
    readonly id: number,
    readonly city: string,
    readonly street: string,
    readonly house?: string,
    readonly entrance?: string,
    readonly floor?: number,
    readonly flat?: string,
    readonly entranceKey?: string,
    readonly cityDistrict?: string,
    readonly region?: string,
    readonly regionDistrict?: string,
    readonly postalCode?: string,
    readonly createdAt?: Date,
    readonly updatedAt?: Date
  ) {}
}