import { SyntheticEvent } from "react";
import { FieldHookConfig, useField } from "formik";
import type {
  TextFieldLCProps,
  TextAreaFieldLCProps,
  SelectFieldLCProps,
  DateFieldLCProps,
  TimeFieldLCProps,
  CommonLCProps
} from "../../../types";

type FormikTextFieldProps = FieldHookConfig<string> & CommonLCProps & {
  TextFieldLC: React.FC<TextFieldLCProps>
};

export const FormikTextFieldSC = ({ disabled = false, TextFieldLC, ...props }: FormikTextFieldProps) => {
  
  const [field, meta] = useField(props);

  const errorMessage = meta.error && meta.touched
    ? meta.error
    : '';

  return(
    <TextFieldLC
      placeholder={props.placeholder}
      label={props.label}
      type={props.type}
      name={field.name}
      value={field.value}
      onChange={field.onChange}
      onBlur={field.onBlur}
      classNameAddon={props.classNameAddon}
      classNameOverride={props.classNameOverride}
      errorMessage={errorMessage}
      disabled={disabled}
      tooltip={props.tooltip}
    />
  );
};

type FormikSelectFieldProps = FieldHookConfig<string> & CommonLCProps & {
  options: string[],
  tNode?: string,
  svgUrl: string,
  SelectFieldLC: React.FC<SelectFieldLCProps>
};

export const FormikSelectFieldSC = ({ disabled = false, SelectFieldLC, ...props }: FormikSelectFieldProps) => {
  
  const [field, meta, helpers] = useField(props);

  const errorMessage = meta.error && meta.touched
    ? meta.error
    : '';

  const handleChooseOption = (e: SyntheticEvent<HTMLDivElement>) => {
    void helpers.setValue(e.currentTarget.innerText, false);
  };

  return(
    <SelectFieldLC
      placeholder={props.placeholder}
      label={props.label}
      type={props.type}
      name={field.name}
      value={field.value}
      onChange={field.onChange}
      onBlur={field.onBlur}
      svgUrl={props.svgUrl}
      options={props.options}
      tNode={props.tNode}
      onChooseOption={handleChooseOption}
      classNameAddon={props.classNameAddon}
      classNameOverride={props.classNameOverride}
      errorMessage={errorMessage}
      disabled={disabled}
      tooltip={props.tooltip}
    />
  );
};

type FormikTextAreaFieldProps = FieldHookConfig<string> & CommonLCProps & {
  maxrows: number,
  TextAreaFieldLC: React.FC<TextAreaFieldLCProps>
};

export const FormikTextAreaFieldSC = ({ disabled = false, TextAreaFieldLC, ...props }: FormikTextAreaFieldProps) => {
  
  const [field, meta] = useField(props);

  const errorMessage = meta.error && meta.touched
    ? meta.error
    : '';

  return(
    <TextAreaFieldLC
      placeholder={props.placeholder}
      label={props.label}
      name={field.name}
      value={field.value}
      onChange={field.onChange}
      onBlur={field.onBlur}
      maxrows={props.maxrows}
      classNameAddon={props.classNameAddon}
      classNameOverride={props.classNameOverride}
      errorMessage={errorMessage}
      disabled={disabled}
      tooltip={props.tooltip}
    />
  );
};

type FormikDateFieldProps = FieldHookConfig<string> & CommonLCProps & {
  svgUrl: string,
  DateFieldLC: React.FC<DateFieldLCProps>
};

export const FormikDateFieldSC = ({ disabled = false, DateFieldLC, ...props }: FormikDateFieldProps) => {
  
  const [field, meta] = useField(props);

  const errorMessage = meta.error && meta.touched
    ? meta.error
    : '';

  return(
    <DateFieldLC
      placeholder={props.placeholder}
      label={props.label}
      name={field.name}
      value={field.value}
      onChange={field.onChange}
      onBlur={field.onBlur}
      svgUrl={props.svgUrl}
      classNameAddon={props.classNameAddon}
      classNameOverride={props.classNameOverride}
      errorMessage={errorMessage}
      disabled={disabled}
      tooltip={props.tooltip}
    />
  );
};

type FormikTimeFieldProps = FieldHookConfig<string> & CommonLCProps & {
  svgUrl: string,
  TimeFieldLC: React.FC<TimeFieldLCProps>
};

export const FormikTimeFieldSC = ({ disabled = false, TimeFieldLC, ...props }: FormikTimeFieldProps) => {
  
  const [field, meta] = useField(props);

  const errorMessage = meta.error && meta.touched
    ? meta.error
    : '';

  return(
    <TimeFieldLC
      placeholder={props.placeholder}
      label={props.label}
      name={field.name}
      value={field.value}
      onChange={field.onChange}
      onBlur={field.onBlur}
      svgUrl={props.svgUrl}
      classNameAddon={props.classNameAddon}
      classNameOverride={props.classNameOverride}
      errorMessage={errorMessage}
      disabled={disabled}
      tooltip={props.tooltip}
    />
  );
};