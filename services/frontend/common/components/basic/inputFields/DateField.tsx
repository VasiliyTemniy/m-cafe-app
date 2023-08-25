import { ChangeEventHandler, FocusEventHandler } from "react";

import Container from '../Container';
import SVGImage from '../SVGImage';

interface DateFieldProps {
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

const DateField = ({
  placeholder,
  name,
  value,
  onChange,
  onBlur,
  svgUrl,
  className,
  errorMessage,
  type = 'date',
  disabled = false
}: DateFieldProps) => {

  const classNameSum = className
    ? errorMessage
      ? `date-input ${className} error`
      : `date-input ${className}`
    : errorMessage
      ? `date-input error`
      : `date-input`;

  const labelText = errorMessage
    ? errorMessage
    : placeholder;

  return (
    <Container className='date input-wrapper'>
      <input
        type={type}
        id={name}
        name={name}
        className={classNameSum}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        disabled={disabled}
      />
      <label htmlFor={name}>{labelText}</label>
      <SVGImage svgUrl={svgUrl} className='svg-image'/>
      <div className='bar'/>
    </Container>
  );

};

export default DateField;