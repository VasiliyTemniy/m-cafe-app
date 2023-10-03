export class UiSetting {
  constructor(
    readonly id: number,
    readonly name: string,
    readonly value: string,
    readonly group: string,
    readonly theme: string
  ) {}
}