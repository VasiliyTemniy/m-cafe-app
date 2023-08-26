import { ChangeEventHandler, FocusEventHandler } from "react";

import Container from "../Container";
import SVGImage from "../SVGImage";

interface TimeFieldProps {
  placeholder?: string;
  name: string;
  value: string;
  onChange: ChangeEventHandler<HTMLInputElement>;
  onBlur: FocusEventHandler<HTMLInputElement>;
  svgUrl: string;
  className?: string;
  errorMessage?: string;
  type?: string;
  disabled?: boolean;
}

const TimeField = ({
  placeholder,
  name,
  value,
  onChange,
  onBlur,
  svgUrl,
  className,
  errorMessage,
  type = 'time',
  disabled = false
}: TimeFieldProps) => {

  const classNameSum = className
    ? errorMessage
      ? `time-input ${className} error`
      : `time-input ${className}`
    : errorMessage
      ? `time-input error`
      : `time-input`;

  const labelText = errorMessage
    ? errorMessage
    : placeholder;

  return (
    <Container className='time input-wrapper'>
      <input
        type={type}
        id={name}
        name={name}
        className={classNameSum}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        disabled={disabled}
        step={1}
      />
      <label htmlFor={name}>{labelText}</label>
      <SVGImage svgUrl={svgUrl} className='svg-image'/>
      <div className='bar'/>
    </Container>
  );

};

export default TimeField;