import { ChangeEventHandler, FocusEventHandler, MouseEventHandler } from "react";
// import { useTranslation } from "react-i18next";

// import { autoCompleteArray, autoCompleteTranslatedArray } from "../../../utils/portfolioUtils";

import Container from "../Container";
import SVGImage from '../SVGImage';

interface SelectFieldProps {
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
  options: string[];
  tNode?: string;
  chooseOption: MouseEventHandler<HTMLDivElement>;
}

const SelectField = ({
  placeholder,
  name,
  value,
  onChange,
  onBlur,
  svgUrl,
  className,
  errorMessage,
  type = 'text',
  disabled = false,
  options,
  // tNode,
  chooseOption,
}: SelectFieldProps) => {

  // const { t } = useTranslation();

  const classNameSum = className
    ? errorMessage
      ? `select-input ${className} error`
      : `select-input ${className}`
    : errorMessage
      ? `select-input error`
      : `select-input`;

  const labelText = errorMessage
    ? errorMessage
    : placeholder;

  // const displayedOptions = tNode
  //   ? autoCompleteTranslatedArray(options, value, t, tNode)
  //   : autoCompleteArray(options, value);

  const displayedOptions = options;

  return (
    <Container className='select input-wrapper'>
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
      <SVGImage svgUrl={svgUrl} className='svg-image'/>
      <div className='bar'/>
      <Container className='dropdown-wrapper'>
        <Container className='options-wrapper'>
          {displayedOptions.map(option => 
            <div key={option} onMouseDown={chooseOption} id={option}>{
              // tNode ? t(`${tNode}.${option}`) : option
              option
            }</div>)
          }
        </Container>
        <>
          {displayedOptions.length > 0 &&
            <div className='bar-after'/>
          }
        </>
      </Container>
    </Container>
  );

};

export default SelectField;