import { FieldHookConfig, useField } from "formik";
import type { CommonFieldProps } from '@m-cafe-app/frontend-logic/types';
import { useInitLC } from '@m-cafe-app/frontend-logic/shared/hooks';
import { Container } from "../Container";
import { Image } from "../Image";
import { Tooltip } from "../Tooltip";
import { apiBaseUrl } from "@m-cafe-app/shared-constants";

type FormikTimeFieldProps = FieldHookConfig<string> & CommonFieldProps;

export const FormikTimeField = ({ disabled = false, ...props }: FormikTimeFieldProps) => {
  
  const [field, meta] = useField(props);

  const errorMessage = meta.error && meta.touched
    ? meta.error
    : '';

  const { className, style, specific, baseVariant } = useInitLC({
    componentType: 'input',
    componentName: 'input-time',
    classNameAddon: props.classNameAddon,
    classNameOverride: props.classNameOverride,
    errorMessage,
    placeholder: props.placeholder,
    label: props.label,
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
    <Container className={`input-wrapper time ${baseVariant}${specific?.firefoxFix ? ' firefox-fix' : ''}`}>
      <input
        type='time'
        id={field.name}
        className={className}
        name={field.name}
        value={field.value}
        onChange={field.onChange}
        onBlur={field.onBlur}
        style={style}
        disabled={disabled}
        placeholder={inputPlaceholder}
        step={1}
      />
      <label htmlFor={props.name}>{labelText}</label>
      <Image src={`${apiBaseUrl}/public/pictures/svg/time.svg`} classNameAddon='svg'/>
      <>
        {specific?.useBarBelow &&
          <div className='bar'/>
        }
        {!specific?.labelAsPlaceholder && errorMessage &&
          <div className='error'>
            {errorMessage}
          </div>
        }
        {props.tooltip &&
          <Tooltip text={props.tooltip}/>
        }
      </>
    </Container>
  );
};