import type { CommonLCProps } from "@m-cafe-app/frontend-logic/types";
import type { ChangeEventHandler, FocusEventHandler, FocusEvent } from 'react';
import { useRef } from "react";

interface TextAreaLCProps extends CommonLCProps {
  placeholder?: string;
  name: string;
  value: string;
  onChange: ChangeEventHandler<HTMLTextAreaElement>;
  onBlur: FocusEventHandler<HTMLTextAreaElement>;
  errorMessage?: string;
  disabled?: boolean;
  maxrows: number;
}

export const TextAreaLC = ({
  placeholder,
  name,
  value,
  onChange,
  onBlur,
  className,
  errorMessage,
  disabled = false,
  maxrows,
  style,
  specific
}: TextAreaLCProps) => {

  const areaRef = useRef<HTMLTextAreaElement>(null);

  const labelBugFix = value === ''
    ? 'bugfix'
    : '';

  const handleBlur = (e: FocusEvent<HTMLTextAreaElement>) => {
    onBlur(e);
    if (areaRef.current) {
      areaRef.current.style.height = "inherit";
      areaRef.current.style.height = `${
        Math.min(
          Math.max(
            areaRef.current?.scrollHeight,
            32
          ),
          32 * maxrows + 7
        )
      }px`;
    }
  };

  const inputPlaceholder = specific?.labelAsPlaceholder
    ? undefined
    : placeholder;

  return (
    <>
      <textarea
        id={name}
        name={name}
        className={`${className} rows-${maxrows}`}
        value={value}
        onChange={onChange}
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
      <label htmlFor={name} className={labelBugFix}>{specific?.labelText}</label>
      {
        specific?.useBarBelow &&
          <div className='bar'/>
      }
      {
        !specific?.labelAsPlaceholder && errorMessage &&
          <div className='error'>
            {errorMessage}
          </div>
      }
    </>
  );

};