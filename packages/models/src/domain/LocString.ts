export class LocString {
  constructor(
    readonly id: number,
    readonly mainStr: string,
    readonly secStr?: string,
    readonly altStr?: string
  ) {}
}


export class LocStringS {
  constructor(
    readonly mainStr: string,
    readonly secStr?: string,
    readonly altStr?: string
  ) {}
}