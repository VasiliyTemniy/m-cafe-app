import { SyntheticEvent } from "react";
import { FieldHookConfig, useField } from "formik";
import Container from "./Container";
import TextField from "./inputFields/TextField";
import SelectField from "./inputFields/SelectField";
import TextAreaField from "./inputFields/TextAreaField";
import DateField from "./inputFields/DateField";
import TimeField from "./inputFields/TimeField";

export const FormikTextField = ({ disabled = false, ...props }: FieldHookConfig<string>) => {
  
  const [field, meta] = useField(props);

  const errorMessage = meta.error && meta.touched
    ? meta.error
    : '';

  return(
    <Container className='field-wrapper'>
      <TextField
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
    </Container>
  );
};

type FormikSelectFieldProps = FieldHookConfig<string> & { options: string[], tNode?: string, svgUrl: string };

export const FormikSelectField = ({ disabled = false, ...props }: FormikSelectFieldProps) => {
  
  const [field, meta, helpers] = useField(props);

  const errorMessage = meta.error && meta.touched
    ? meta.error
    : '';

  const handleChooseOption = (e: SyntheticEvent<HTMLDivElement>) => {
    helpers.setValue(e.currentTarget.innerText, false);
  };

  return(
    <Container className='field-wrapper'>
      <SelectField
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
        chooseOption={handleChooseOption}
      />
    </Container>
  );
};

type FormikTextAreaFieldProps = FieldHookConfig<string> & { maxrows: number };

export const FormikTextAreaField = ({ disabled = false, ...props }: FormikTextAreaFieldProps) => {
  
  const [field, meta] = useField(props);

  const errorMessage = meta.error && meta.touched
    ? meta.error
    : '';

  return(
    <Container className='field-wrapper'>
      <TextAreaField
        placeholder={props.placeholder}
        name={field.name}
        value={field.value}
        onChange={field.onChange}
        onBlur={field.onBlur}
        errorMessage={errorMessage}
        disabled={disabled}
        maxrows={props.maxrows}
      />
    </Container>
  );
};

type FormikDateFieldProps = FieldHookConfig<string> & { svgUrl: string };

export const FormikDateField = ({ disabled = false, ...props }: FormikDateFieldProps) => {
  
  const [field, meta] = useField(props);

  const errorMessage = meta.error && meta.touched
    ? meta.error
    : '';

  return(
    <Container className='field-wrapper'>
      <DateField
        placeholder={props.placeholder}
        name={field.name}
        value={field.value}
        onChange={field.onChange}
        onBlur={field.onBlur}
        svgUrl={props.svgUrl}
        errorMessage={errorMessage}
        disabled={disabled}
      />
    </Container>
  );
};

type FormikTimeFieldProps = FieldHookConfig<string> & { svgUrl: string };

export const FormikTimeField = ({ disabled = false, ...props }: FormikTimeFieldProps) => {
  
  const [field, meta] = useField(props);

  const errorMessage = meta.error && meta.touched
    ? meta.error
    : '';

  return(
    <Container className='field-wrapper'>
      <TimeField
        placeholder={props.placeholder}
        name={field.name}
        value={field.value}
        onChange={field.onChange}
        onBlur={field.onBlur}
        svgUrl={props.svgUrl}
        errorMessage={errorMessage}
        disabled={disabled}
      />
    </Container>
  );
};