import { FieldHookConfig, useField } from "formik";
import type {
  CommonFieldSCProps,
  CommonFieldLCProps
} from "../../../types";
import { useInitLC } from "../../hooks";

type FormikTextFieldProps = FieldHookConfig<string> & CommonFieldSCProps & {
  TextFieldLC: React.FC<TextFieldLCProps>
};

export interface TextFieldLCProps extends CommonFieldLCProps {
  type?: string;
}

const FormikTextFieldSC = ({ disabled = false, TextFieldLC, ...props }: FormikTextFieldProps) => {
  
  const [field, meta] = useField(props);

  const errorMessage = meta.error && meta.touched
    ? meta.error
    : '';

  const { className, style, specific, tooltip } = useInitLC({
    componentType: 'input',
    componentName: 'input-text',
    classNameAddon: props.classNameAddon,
    classNameOverride: props.classNameOverride,
    errorMessage,
    placeholder: props.placeholder,
    label: props.label,
    tooltipTNode: props.tooltipTNode
  });

  return(
    <TextFieldLC
      placeholder={props.placeholder}
      label={props.label}
      type={props.type}
      name={field.name}
      value={field.value}
      onChange={field.onChange}
      onBlur={field.onBlur}
      className={className}
      errorMessage={errorMessage}
      disabled={disabled}
      tooltip={tooltip}
      style={style}
      specific={specific}
    />
  );
};

export default FormikTextFieldSC;