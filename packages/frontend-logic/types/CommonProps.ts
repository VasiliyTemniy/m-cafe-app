export type InputSpecificValue = {
  labelAsPlaceholder: boolean,
  useBarBelow: boolean,
  firefoxFix: boolean
} | undefined;

export type NotificationSpecificValue = {
  animate: boolean,
  hidden: boolean
} | undefined;

export type LCSpecificValue =
  undefined |
  InputSpecificValue |
  NotificationSpecificValue;

export interface CommonProps {
  classNameOverride?: string;
  classNameAddon?: string;
  className?: string;
  id?: string;
  tooltip?: string;
}

export interface CommonFieldProps extends CommonProps {
  placeholder?: string;
  label?: string;
  // onChange: ChangeEventHandler<HTMLInputElement>;
  // onBlur: FocusEventHandler<HTMLInputElement>;
  disabled?: boolean;
}