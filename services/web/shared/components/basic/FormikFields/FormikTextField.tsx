import type { CommonFieldProps } from '@m-cafe-app/frontend-logic/types';
import type { FieldHookConfig } from 'formik';
import { useField } from 'formik';
import { Tooltip } from '../Tooltip';
import { Input } from '../Input';

type FormikTextFieldProps = FieldHookConfig<string> & CommonFieldProps & {
  type: 'text' | 'password' | 'email' | 'tel';
  spellCheck?: 'true' | 'false';
};


export const FormikTextField = ({
  disabled = false,
  classNameOverride,
  classNameAddon,
  placeholder,
  label,
  style,
  type,
  autoComplete,
  autoCorrect,
  autoCapitalize,
  spellCheck,
  tooltip,
  ...props
}: FormikTextFieldProps) => {
  
  const [field, meta] = useField(props);

  const errorMessage = meta.error && meta.touched
    ? meta.error
    : '';

  return(
    <Input
      classNameOverride={classNameOverride}
      classNameAddon={classNameAddon}
      errorMessage={errorMessage}
      type={type}
      id={field.name}
      name={field.name}
      value={field.value}
      onChange={field.onChange}
      onBlur={field.onBlur}
      disabled={disabled}
      style={style}
      autoComplete={autoComplete}
      autoCorrect={autoCorrect}
      autoCapitalize={autoCapitalize}
      spellCheck={spellCheck}
      placeholder={placeholder}
      label={label}
    >
      <>
        {tooltip &&
          <Tooltip text={tooltip}/>
        }
      </>
    </Input>
  );
};