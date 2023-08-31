import { FieldHookConfig, useField } from "formik";
import type {
  CommonFieldSCProps,
  CommonFieldLCProps
} from "../../../types";
import { useInitLC } from "../../hooks";

type FormikDateFieldProps = FieldHookConfig<string> & CommonFieldSCProps & {
  svgUrl: string,
  DateFieldLC: React.FC<DateFieldLCProps>
};

export interface DateFieldLCProps extends CommonFieldLCProps {
  svgUrl: string;
  type?: string;
}

export const FormikDateFieldSC = ({ disabled = false, DateFieldLC, ...props }: FormikDateFieldProps) => {
  
  const [field, meta] = useField(props);

  const errorMessage = meta.error && meta.touched
    ? meta.error
    : '';

  const { className, style, specific, tooltip } = useInitLC({
    componentType: 'input',
    componentName: 'input-date',
    classNameAddon: props.classNameAddon,
    classNameOverride: props.classNameOverride,
    errorMessage,
    placeholder: props.placeholder,
    label: props.label,
    tooltipTNode: props.tooltipTNode
  });

  return(
    <DateFieldLC
      placeholder={props.placeholder}
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