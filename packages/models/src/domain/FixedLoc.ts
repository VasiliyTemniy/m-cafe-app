import type { LocStringS, LocString } from './LocString.js';


export class FixedLoc {
  constructor(
    readonly id: number,
    readonly name: string,
    readonly namespace: string,
    readonly scope: string,
    readonly locString: LocString
  ) {}
}

export class FixedLocS {
  constructor(
    readonly name: string,
    readonly namespace: string,
    readonly scope: string,
    readonly locString: LocStringS
  ) {}
}

export type FixedLocUniquePropertiesGroup = {
  name: string,
  namespace: string,
  scope: string,
};