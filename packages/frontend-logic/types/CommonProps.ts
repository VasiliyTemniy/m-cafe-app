import {
  ChangeEventHandler,
  FocusEventHandler,
  CSSProperties
} from "react";

export type InputSpecificValue = {
  labelAsPlaceholder: boolean,
  labelText: string,
  useBarBelow: boolean
};

export type LCSpecificValue = undefined | InputSpecificValue;

export interface CommonSCProps {
  classNameOverride?: string;
  classNameAddon?: string;
  id?: string;
  tooltipTNode?: string;
  tooltip?: string;
}

export interface CommonLCProps {
  id?: string;
  className?: string;
  style?: CSSProperties;
  specific?: LCSpecificValue;
}

export interface CommonFieldSCProps extends CommonSCProps {
  placeholder?: string;
  label?: string;
}

export interface CommonFieldLCProps extends CommonLCProps {
  placeholder?: string;
  label?: string;
  name: string;
  value: string;
  onChange: ChangeEventHandler<HTMLInputElement>;
  onBlur: FocusEventHandler<HTMLInputElement>;
  errorMessage?: string;
  disabled?: boolean;
}