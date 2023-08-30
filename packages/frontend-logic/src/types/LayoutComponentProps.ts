import { UiSettingDT } from "@m-cafe-app/utils";
import {
  CSSProperties,
  MouseEventHandler,
  ChangeEventHandler,
  FocusEventHandler
} from "react";

export interface CommonLCProps {
  classNameOverride?: string;
  classNameAddon?: string;
  id?: string;
  style?: CSSProperties;
  uiSettings: UiSettingDT[];
}

/**
 * Input fields props start
 */

interface CommonFieldLCProps extends CommonLCProps {
  placeholder?: string;
  label?: string;
  name: string;
  value: string;
  onChange: ChangeEventHandler<HTMLInputElement>;
  onBlur: FocusEventHandler<HTMLInputElement>;
  errorMessage?: string;
  disabled?: boolean;
}

export interface TextFieldLCProps extends CommonFieldLCProps {
  type?: string;
}

export interface TimeFieldLCProps extends CommonFieldLCProps {
  svgUrl: string;
  type?: string;
}

export interface TextAreaFieldLCProps extends CommonFieldLCProps {
  maxrows: number
}

export interface SelectFieldLCProps extends CommonFieldLCProps {
  svgUrl: string;
  type?: string;
  options: string[];
  tNode?: string;
  onChooseOption: MouseEventHandler<HTMLDivElement>;
}

export interface DateFieldLCProps extends CommonFieldLCProps {
  svgUrl: string;
  type?: string;
}

/**
 * Input fields props end
 */