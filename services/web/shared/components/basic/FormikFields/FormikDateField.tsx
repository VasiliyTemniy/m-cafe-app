import type { CommonFieldProps } from '@m-cafe-app/frontend-logic/types';
import type { FieldHookConfig } from "formik";
import { useField } from "formik";
import { useInitLC } from '@m-cafe-app/frontend-logic/shared/hooks';
import { Image } from "../Image";
import { Tooltip } from "../Tooltip";
import { apiBaseUrl } from "@m-cafe-app/shared-constants";

type FormikDateFieldProps = FieldHookConfig<string> & CommonFieldProps;

export const FormikDateField = ({ disabled = false, ...props }: FormikDateFieldProps) => {
  
  const [field, meta] = useField(props);

  const errorMessage = meta.error && meta.touched
    ? meta.error
    : '';

  const { className, style, specific, baseVariant, baseColorVariant } = useInitLC({
    componentType: 'input',
    componentName: 'input-date',
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
    <div className={`input-wrapper date ${baseVariant} ${baseColorVariant}${specific?.firefoxFix ? ' firefox-fix' : ''}`}>
      <input
        type='date'
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
      <Image src={`${apiBaseUrl}/public/pictures/svg/calendar.svg`} classNameAddon='svg'/>
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
    </div>
  );
};