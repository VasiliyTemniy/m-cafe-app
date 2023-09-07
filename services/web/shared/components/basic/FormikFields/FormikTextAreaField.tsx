import { ChangeEventHandler, FocusEventHandler, FocusEvent } from 'react';
import { FieldHookConfig, useField } from "formik";
import type { CommonFieldProps } from '@m-cafe-app/frontend-logic/types';
import { useInitLC } from '@m-cafe-app/frontend-logic/shared/hooks';
import { Container } from '../Container';
import { Tooltip } from '../Tooltip';
import { useRef } from "react";

type FormikTextAreaFieldProps = FieldHookConfig<string> & CommonFieldProps & {
  onChange: ChangeEventHandler<HTMLTextAreaElement>;
  onBlur: FocusEventHandler<HTMLTextAreaElement>;
  maxrows: number
};

export const FormikTextAreaField = ({ disabled = false, ...props }: FormikTextAreaFieldProps) => {

  const areaRef = useRef<HTMLTextAreaElement>(null);
  
  const [field, meta] = useField(props);

  const errorMessage = meta.error && meta.touched
    ? meta.error
    : '';

  const { className, style, specific, baseVariant } = useInitLC({
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

  const handleBlur = (e: FocusEvent<HTMLTextAreaElement>) => {
    field.onBlur(e);
    if (areaRef.current) {
      areaRef.current.style.height = "inherit";
      areaRef.current.style.height = `${
        Math.min(
          Math.max(
            areaRef.current?.scrollHeight,
            32
          ),
          32 * props.maxrows + 7
        )
      }px`;
    }
  };

  return(
    <Container className={`input-wrapper textarea ${baseVariant}`}>
      <textarea
        id={field.name}
        name={field.name}
        className={`${className} rows-${props.maxrows}`}
        value={field.value}
        onChange={field.onChange}
        onBlur={handleBlur}
        style={style}
        disabled={disabled}
        ref={areaRef}
        rows={1}
        autoComplete='off'
        autoCorrect='off'
        autoCapitalize='off'
        spellCheck='false'
        placeholder={inputPlaceholder}
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
    </Container>
  );
};