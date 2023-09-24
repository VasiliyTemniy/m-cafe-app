import type { CommonFieldProps } from '@m-cafe-app/frontend-logic/types';
import type { FieldHookConfig } from 'formik';
import { useField } from 'formik';
import { useInitLC } from '@m-cafe-app/frontend-logic/shared/hooks';
import { Tooltip } from '../Tooltip';

type FormikTextFieldProps = FieldHookConfig<string> & CommonFieldProps & {
  type: 'text' | 'password' | 'email' | 'tel';
};


export const FormikTextField = ({ disabled = false, ...props }: FormikTextFieldProps) => {
  
  const [field, meta] = useField(props);

  const errorMessage = meta.error && meta.touched
    ? meta.error
    : '';

  const { className, style, specific, baseVariant, baseColorVariant } = useInitLC({
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
    <div className={`input-wrapper text ${baseVariant} ${baseColorVariant}`}>
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
        {props.tooltip &&
          <Tooltip text={props.tooltip}/>
        }
      </>
    </div>
  );
};