export const specificUiSettingsReadonly = {
  input: {
    useBarBelow: true,
    labelAsPlaceholder: true,
  },
  notification: {
    animate: true,
    hidden: false
  }
} as const;

type MapToMutableOrUndefined<T> = {
  -readonly [Property in keyof T]?:
  T[Property] extends boolean ? boolean :
  T[Property] extends string ? string :
  T[Property] extends number ? number :
  T[Property]
};

export type InputSpecificValue = MapToMutableOrUndefined<typeof specificUiSettingsReadonly['input']> & {
  firefoxFix?: boolean
} | undefined;

export type NotificationSpecificValue = MapToMutableOrUndefined<typeof specificUiSettingsReadonly['notification']>
| undefined;


export type LCSpecificValue =
  InputSpecificValue &
  NotificationSpecificValue;