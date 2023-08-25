import { ChangeEventHandler, FocusEventHandler } from "react";
import Container from "../Container";

interface TextFieldProps {
  placeholder?: string;
  name: string;
  value: string;
  onChange: ChangeEventHandler<HTMLInputElement>;
  onBlur: FocusEventHandler<HTMLInputElement>;
  className?: string;
  errorMessage?: string;
  type?: string;
  disabled?: boolean;
}

const TextField = ({
  placeholder,
  name,
  value,
  onChange,
  onBlur,
  className,
  errorMessage,
  type = 'text',
  disabled = false
}: TextFieldProps) => {

  const classNameSum = className
    ? errorMessage
      ? `text-input ${className} error`
      : `text-input ${className}`
    : errorMessage
      ? `text-input error`
      : `text-input`;

  const labelText = errorMessage
    ? errorMessage
    : placeholder;

  return (
    <Container className='text-plain input-wrapper'>
      <input
        type={type}
        id={name}
        name={name}
        className={classNameSum}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        disabled={disabled}
        autoComplete='off'
        autoCorrect='off'
        autoCapitalize='off'
        spellCheck='false'
      />
      <label htmlFor={name}>{labelText}</label>
      <div className='bar'/>
    </Container>
  );

};

export default TextField;