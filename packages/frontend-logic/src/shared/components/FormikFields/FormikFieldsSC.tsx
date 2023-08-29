import { SyntheticEvent } from "react";
import { FieldHookConfig, useField } from "formik";
import type {
  TextFieldLCProps,
  TextAreaFieldLCProps,
  SelectFieldLCProps,
  DateFieldLCProps,
  TimeFieldLCProps
} from "../../../types";

type FormikTextFieldProps = FieldHookConfig<string> & {
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
      type={props.type}
      name={field.name}
      value={field.value}
      onChange={field.onChange}
      onBlur={field.onBlur}
      className={props.className}
      errorMessage={errorMessage}
      disabled={disabled}
    />
  );
};

type FormikSelectFieldProps = FieldHookConfig<string> & {
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
      type={props.type}
      name={field.name}
      value={field.value}
      onChange={field.onChange}
      onBlur={field.onBlur}
      svgUrl={props.svgUrl}
      errorMessage={errorMessage}
      disabled={disabled}
      options={props.options}
      tNode={props.tNode}
      onChooseOption={handleChooseOption}
    />
  );
};

type FormikTextAreaFieldProps = FieldHookConfig<string> & {
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
      name={field.name}
      value={field.value}
      onChange={field.onChange}
      onBlur={field.onBlur}
      errorMessage={errorMessage}
      disabled={disabled}
      maxrows={props.maxrows}
    />
  );
};

type FormikDateFieldProps = FieldHookConfig<string> & {
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
      name={field.name}
      value={field.value}
      onChange={field.onChange}
      onBlur={field.onBlur}
      svgUrl={props.svgUrl}
      errorMessage={errorMessage}
      disabled={disabled}
    />
  );
};

type FormikTimeFieldProps = FieldHookConfig<string> & {
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
      name={field.name}
      value={field.value}
      onChange={field.onChange}
      onBlur={field.onBlur}
      svgUrl={props.svgUrl}
      errorMessage={errorMessage}
      disabled={disabled}
    />
  );
};