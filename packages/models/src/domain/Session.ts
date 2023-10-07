export class Session {
  constructor (
    readonly userId: number,
    readonly token: string,
    readonly userAgentHash: string,
    readonly rights: string
  ) {}
}

// Session is internal and has no DT.