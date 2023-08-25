import { ChangeEventHandler, FocusEventHandler, useRef, FocusEvent } from "react";
import Container from "../Container";

interface TextAreaFieldProps {
  placeholder?: string;
  name: string;
  value: string;
  onChange: ChangeEventHandler<HTMLTextAreaElement>;
  onBlur: FocusEventHandler<HTMLTextAreaElement>;
  className?: string;
  errorMessage?: string;
  disabled?: boolean;
  maxrows: number
}

const TextAreaField = ({
  placeholder,
  name,
  value,
  onChange,
  onBlur,
  className,
  errorMessage,
  disabled = false,
  maxrows
}: TextAreaFieldProps) => {

  const areaRef = useRef<HTMLTextAreaElement>(null);

  const classNameSum = className
    ? errorMessage
      ? `text-area-input ${className} error`
      : `text-area-input ${className}`
    : errorMessage
      ? `text-area-input error`
      : `text-area-input`;

  const labelText = errorMessage
    ? errorMessage
    : placeholder;

  const labelBugFix = value === ''
    ? 'bugfix'
    : '';

  const handleBlur = (e: FocusEvent<HTMLTextAreaElement>) => {
    onBlur(e);
    areaRef.current.style.height = "inherit";
    areaRef.current.style.height = `${
      Math.min(
        Math.max(
          areaRef.current.scrollHeight,
          32
        ),
        32 * maxrows + 7
      )
    }px`;
  };


  return (
    <Container className='text-area input-wrapper'>
      <textarea
        id={name}
        name={name}
        className={`${classNameSum} rows-${maxrows}`}
        value={value}
        onChange={onChange}
        onBlur={handleBlur}
        disabled={disabled}
        ref={areaRef}
        rows={1}
        autoComplete='off'
        autoCorrect='off'
        autoCapitalize='off'
        spellCheck='false'
      />
      <label htmlFor={name} className={labelBugFix}>{labelText}</label>
      <div className='bar'/>
    </Container>
  );

};

export default TextAreaField;