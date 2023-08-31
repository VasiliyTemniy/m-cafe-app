import { ChangeEventHandler, FocusEventHandler } from 'react';
import { FieldHookConfig, useField } from "formik";
import type {
  CommonFieldSCProps,
  CommonFieldLCProps
} from "../../../types";
import { useInitLC } from "../../hooks";

type FormikTextAreaFieldProps = FieldHookConfig<string> & CommonFieldSCProps & {
  onChange: ChangeEventHandler<HTMLTextAreaElement>;
  onBlur: FocusEventHandler<HTMLTextAreaElement>;
  maxrows: number,
  TextAreaFieldLC: React.FC<TextAreaFieldLCProps>
};

export interface TextAreaFieldLCProps extends Omit<CommonFieldLCProps, 'onChange' | 'onBlur'> {
  onChange: ChangeEventHandler<HTMLTextAreaElement>;
  onBlur: FocusEventHandler<HTMLTextAreaElement>;
  maxrows: number
}

export const FormikTextAreaFieldSC = ({ disabled = false, TextAreaFieldLC, ...props }: FormikTextAreaFieldProps) => {
  
  const [field, meta] = useField(props);

  const errorMessage = meta.error && meta.touched
    ? meta.error
    : '';

  const { className, style, specific, tooltip } = useInitLC({
    componentType: 'input',
    componentName: 'input-textarea',
    classNameAddon: props.classNameAddon,
    classNameOverride: props.classNameOverride,
    errorMessage,
    placeholder: props.placeholder,
    label: props.label,
    tooltipTNode: props.tooltipTNode
  });

  return(
    <TextAreaFieldLC
      placeholder={props.placeholder}
      label={props.label}
      name={field.name}
      value={field.value}
      onChange={field.onChange}
      onBlur={field.onBlur}
      maxrows={props.maxrows}
      className={className}
      errorMessage={errorMessage}
      disabled={disabled}
      tooltip={tooltip}
      style={style}
      specific={specific}
    />
  );
};