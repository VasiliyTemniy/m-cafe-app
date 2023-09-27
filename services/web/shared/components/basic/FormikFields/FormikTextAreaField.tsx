import type { CommonFieldProps } from '@m-cafe-app/frontend-logic/types';
import type { FieldHookConfig } from 'formik';
import { useField } from 'formik';
import { useInitLC } from '@m-cafe-app/frontend-logic/shared/hooks';
import { Tooltip } from '../Tooltip';
import { useRef, useEffect } from 'react';

type FormikTextAreaFieldProps = FieldHookConfig<string> & CommonFieldProps & {
  maxTextLength?: number
};

export const FormikTextAreaField = ({ disabled = false, ...props }: FormikTextAreaFieldProps) => {

  const areaRef = useRef<HTMLTextAreaElement>(null);
  
  const [field, meta] = useField(props);

  const errorMessage = meta.error && meta.touched
    ? meta.error
    : '';

  const { className, style, specific, baseVariant, baseColorVariant } = useInitLC({
    componentType: 'input',
    componentName: 'input-textarea',
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

  const labelBugFix = field.value === ''
    ? 'bugfix'
    : '';

  const handleAreaHeight = () => {
    if (!areaRef.current) return;
    areaRef.current.style.removeProperty('height');
    if (areaRef.current.scrollHeight > areaRef.current.clientHeight) {
      areaRef.current.style.height = `${areaRef.current.scrollHeight}px`;
    }
  };

  useEffect(() => {
    handleAreaHeight();
  }, []);

  return(
    <div className={`input-wrapper textarea ${baseVariant} ${baseColorVariant}`}>
      <textarea
        id={field.name}
        name={field.name}
        className={`${className}`}
        value={field.value}
        onChange={field.onChange}
        style={style}
        disabled={disabled}
        ref={areaRef}
        rows={1}
        autoComplete='off'
        autoCorrect='off'
        autoCapitalize='off'
        spellCheck='false'
        placeholder={inputPlaceholder}
        onKeyUp={handleAreaHeight}
        maxLength={props.maxTextLength}
      />
      <label htmlFor={props.name} className={labelBugFix}>{labelText}</label>
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