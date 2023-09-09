import { FieldHookConfig, useField } from "formik";
import type { CommonFieldProps } from '@m-cafe-app/frontend-logic/types';
import { useInitLC } from '@m-cafe-app/frontend-logic/shared/hooks';
import { Container } from "../Container";
import { Tooltip } from "../Tooltip";

type FormikTextFieldProps = FieldHookConfig<string> & CommonFieldProps & {
  type: 'text' | 'password' | 'email' | 'tel';
};


export const FormikTextField = ({ disabled = false, ...props }: FormikTextFieldProps) => {
  
  const [field, meta] = useField(props);

  const errorMessage = meta.error && meta.touched
    ? meta.error
    : '';

  const { className, style, specific, baseVariant } = useInitLC({
    componentType: 'input',
    componentName: 'input-text',
    classNameAddon: props.classNameAddon,
    classNameOverride: props.classNameOverride,
    errorMessage,
    placeholder: props.placeholder,
    label: props.label
  });

  const inputPlaceholder = specific?.labelAsPlaceholder
    ? undefined
    : props.placeholder;

  const labelText = specific?.labelAsPlaceholder
    ? errorMessage
      ? errorMessage
      : props.placeholder
    : props.label;

  return(
    <Container classNameAddon={`input-wrapper text ${baseVariant}`}>
      <input
        type={props.type}
        id={field.name}
        name={field.name}
        className={className}
        value={field.value}
        onChange={field.onChange}
        onBlur={field.onBlur}
        disabled={disabled}
        style={style}
        autoComplete='off'
        autoCorrect='off'
        autoCapitalize='off'
        spellCheck='false'
        placeholder={inputPlaceholder}
      />
      <label htmlFor={props.name}>{labelText}</label>
      <>
        {specific?.useBarBelow &&
          <div className='bar'/>
        }
        {!specific?.labelAsPlaceholder && errorMessage &&
          <div className='error'>
            {errorMessage}
          </div>
        }
      </>
      {/* <Input
        placeholder={props.placeholder}
        type={props.type}
        name={field.name}
        value={field.value}
        onChange={field.onChange}
        onBlur={field.onBlur}
        className={className}
        errorMessage={errorMessage}
        disabled={disabled}
        style={style}
        specific={specific}
      /> */}
      <>
        {props.tooltip &&
          <Tooltip text={props.tooltip}/>
        }
      </>
    </Container>
  );
};