import type { LocS } from './Loc.js';


export class FixedLoc {
  constructor(
    readonly id: number,
    readonly name: string,
    readonly namespace: string,
    readonly scope: string,
    readonly locs: LocS[]
  ) {}
}

export class FixedLocS {
  constructor(
    readonly name: string,
    readonly namespace: string,
    readonly scope: string,
    readonly locs: LocS[]
  ) {}
}

export type FixedLocUniquePropertiesGroup = {
  name: string,
  namespace: string,
  scope: string,
};