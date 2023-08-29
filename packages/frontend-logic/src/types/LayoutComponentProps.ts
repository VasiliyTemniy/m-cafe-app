import {
  CSSProperties,
  MouseEventHandler,
  // Ref,
  ChangeEventHandler,
  FocusEventHandler
} from "react";

interface CommonLCProps {
  className?: string;
  id?: string;
  style?: CSSProperties;
}

// export interface ContainerProps extends CommonLayoutComponentProps {
//   children: JSX.Element[] | JSX.Element;
//   onClick?: MouseEventHandler;
//   onMouseMove?: MouseEventHandler;
//   onMouseDown?: MouseEventHandler;
//   onMouseLeave?: MouseEventHandler;
//   onMouseUp?: MouseEventHandler;
//   ref?: Ref<HTMLDivElement>;
// }


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