import type { CSSProperties, ChangeEventHandler, FocusEventHandler } from 'react';
import type { CommonFieldProps } from '@m-cafe-app/frontend-logic/types';
import { useInitLC } from '@m-cafe-app/frontend-logic/shared/hooks';

export interface InputProps extends CommonFieldProps {
  type: 'text' | 'password' | 'email' | 'tel' | 'date' | 'time';
  internalType?: 'text' | 'password' | 'email' | 'tel' | 'date' | 'time' | 'select';
  errorMessage?: string;
  name: string;
  value: string;
  onChange: ChangeEventHandler<HTMLInputElement>;
  onBlur?: FocusEventHandler<HTMLInputElement>;
  style?: CSSProperties;
  children?: JSX.Element[] | JSX.Element;
  autoComplete?: string;
  autoCorrect?: string;
  autoCapitalize?: string;
  spellCheck?: 'true' | 'false';
  step?: number;
}

export const Input = ({
  classNameOverride,
  classNameAddon,
  placeholder,
  label,
  style,
  id,
  type,
  internalType = type,
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
  step
}: InputProps) => {

  const { className, style: uiSettingsStyle, specific } = useInitLC({
    componentType: 'input',
    componentName: `input ${internalType}`,
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

  return (
    <div
      id={id}
      className={`${className}${specific?.firefoxFix ? ' firefox-fix' : ''}`}
      style={{ ...style, ...uiSettingsStyle }}
    >
      <input
        type={type}
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
        step={step}
      />
      <label htmlFor={name}>{labelText}</label>
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