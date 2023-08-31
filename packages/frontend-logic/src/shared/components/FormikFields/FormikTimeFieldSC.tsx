import { FieldHookConfig, useField } from "formik";
import type {
  CommonFieldSCProps,
  CommonFieldLCProps
} from "../../../types";
import { useInitLC } from "../../hooks";

type FormikTimeFieldProps = FieldHookConfig<string> & CommonFieldSCProps & {
  svgUrl: string,
  TimeFieldLC: React.FC<TimeFieldLCProps>
};

export interface TimeFieldLCProps extends CommonFieldLCProps {
  svgUrl: string;
  type?: string;
}

export const FormikTimeFieldSC = ({ disabled = false, TimeFieldLC, ...props }: FormikTimeFieldProps) => {
  
  const [field, meta] = useField(props);

  const errorMessage = meta.error && meta.touched
    ? meta.error
    : '';

  const { className, style, specific, tooltip } = useInitLC({
    componentType: 'input',
    componentName: 'input-time',
    classNameAddon: props.classNameAddon,
    classNameOverride: props.classNameOverride,
    errorMessage,
    placeholder: props.placeholder,
    label: props.label,
    tooltipTNode: props.tooltipTNode
  });
  

  return(
    <TimeFieldLC
      placeholder={props.placeholder}
      label={props.label}
      name={field.name}
      value={field.value}
      onChange={field.onChange}
      onBlur={field.onBlur}
      svgUrl={props.svgUrl}
      className={className}
      errorMessage={errorMessage}
      disabled={disabled}
      tooltip={tooltip}
      style={style}
      specific={specific}
    />
  );
};