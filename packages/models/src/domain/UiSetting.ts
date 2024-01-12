export class UiSetting {
  constructor(
    readonly id: number,
    readonly name: string,
    readonly value: string,
    readonly group: string,
    readonly theme: string
  ) {}
}

export class UiSettingS {
  constructor(
    readonly name: string,
    readonly value: string,
    readonly group: string,
    readonly theme: string
  ) {}
}

export type UiSettingUniqiePropertiesGroup = {
  name: string,
  group: string,
  theme: string
};