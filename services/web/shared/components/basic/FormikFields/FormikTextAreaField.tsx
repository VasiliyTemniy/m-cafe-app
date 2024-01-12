import type { CommonFieldProps } from '@m-market-app/frontend-logic/types';
import type { FieldHookConfig } from 'formik';
import { useField } from 'formik';
import { Tooltip } from '../Tooltip';
import { TextArea } from '../TextArea';

type FormikTextAreaFieldProps = FieldHookConfig<string> & CommonFieldProps & {
  maxTextLength?: number;
  spellCheck?: 'true' | 'false';
};

export const FormikTextAreaField = ({ 
  disabled = false,
  classNameOverride,
  classNameAddon,
  placeholder,
  label,
  autoComplete,
  autoCorrect,
  autoCapitalize,
  spellCheck,
  tooltip,
  maxTextLength,
  ...props
}: FormikTextAreaFieldProps) => {

  const [field, meta] = useField(props);

  const errorMessage = meta.error && meta.touched
    ? meta.error
    : '';

  return(
    <TextArea
      classNameOverride={classNameOverride}
      classNameAddon={classNameAddon}
      errorMessage={errorMessage}
      id={field.name}
      name={field.name}
      value={field.value}
      onChange={field.onChange}
      onBlur={field.onBlur}
      disabled={disabled}
      autoComplete={autoComplete}
      autoCorrect={autoCorrect}
      autoCapitalize={autoCapitalize}
      spellCheck={spellCheck}
      placeholder={placeholder}
      label={label}
      maxTextLength={maxTextLength}
    >
      <>
        {tooltip &&
          <Tooltip text={tooltip}/>
        }
      </>
    </TextArea>
  );
};