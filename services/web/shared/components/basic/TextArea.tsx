import type { CSSProperties, ChangeEventHandler, FocusEventHandler } from 'react';
import type { CommonFieldProps } from '@m-cafe-app/frontend-logic/types';
import { useInitLC } from '@m-cafe-app/frontend-logic/shared/hooks';
import { useEffect, useRef } from 'react';

export interface TextAreaProps extends CommonFieldProps {
  errorMessage?: string;
  name: string;
  value: string;
  onChange: ChangeEventHandler<HTMLTextAreaElement>;
  onBlur?: FocusEventHandler<HTMLTextAreaElement>;
  style?: CSSProperties;
  children?: JSX.Element[] | JSX.Element;
  autoComplete?: string;
  autoCorrect?: string;
  autoCapitalize?: string;
  spellCheck?: 'true' | 'false';
  step?: number;
  rows?: number;
  maxTextLength?: number;
}

export const TextArea = ({
  classNameOverride,
  classNameAddon,
  placeholder,
  label,
  style,
  id,
  name,
  value,
  onChange,
  onBlur,
  disabled,
  errorMessage,
  children,
  autoComplete = 'off',
  autoCorrect = 'off',
  autoCapitalize = 'off',
  spellCheck = 'false',
  rows = 1,
  maxTextLength
}: TextAreaProps) => {

  const areaRef = useRef<HTMLTextAreaElement>(null);

  const { className, style: uiSettingsStyle, specific } = useInitLC({
    componentType: 'input',
    componentName: 'input textarea',
    classNameAddon,
    classNameOverride,
    errorMessage
  });

  const inputPlaceholder = specific?.labelAsPlaceholder
    ? undefined
    : placeholder;

  const labelText = specific?.labelAsPlaceholder
    ? errorMessage
      ? errorMessage
      : placeholder
    : label;

  const labelBugFix = value === ''
    ? 'bugfix'
    : '';

  const handleAreaHeight = () => {
    if (!areaRef.current) return;
    areaRef.current.style.removeProperty('height');
    areaRef.current.style.height = `${areaRef.current.scrollHeight}px`;
  };

  useEffect(() => {
    handleAreaHeight();
  }, []);

  return (
    <div
      id={id}
      className={className}
      style={{ ...style, ...uiSettingsStyle }}
    >
      <textarea
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        disabled={disabled}
        autoComplete={autoComplete}
        autoCorrect={autoCorrect}
        autoCapitalize={autoCapitalize}
        spellCheck={spellCheck}
        placeholder={inputPlaceholder}
        ref={areaRef}
        rows={rows}
        maxLength={maxTextLength}
        onKeyUp={handleAreaHeight}
      />
      <label htmlFor={name} className={labelBugFix}>{labelText}</label>
      {specific?.useBarBelow &&
        <div className='bar'/>
      }
      {!specific?.labelAsPlaceholder && errorMessage &&
        <div className='error'>
          {errorMessage}
        </div>
      }
      {children}
    </div>
  );
};