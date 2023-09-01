import type { InputLCProps } from '../shared';


export const InputLC = ({
  placeholder,
  name,
  value,
  onChange,
  onBlur,
  className,
  errorMessage,
  type = 'date',
  disabled = false,
  autoComplete='off',
  autoCorrect='off',
  autoCapitalize='off',
  spellCheck='false',
  step,
  style,
  specific
}: InputLCProps) => {

  return (
    <>
      <input
        type={type}
        id={name}
        name={name}
        className={className}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        style={style}
        disabled={disabled}
        placeholder={placeholder}
        autoComplete={autoComplete}
        autoCorrect={autoCorrect}
        autoCapitalize={autoCapitalize}
        spellCheck={spellCheck}
        step={step}
      />
      <label htmlFor={name}>{specific?.labelText}</label>
      {specific?.useBarBelow &&
        <div className='bar'/>
      }
      {!specific?.labelAsPlaceholder && errorMessage &&
        <div className='error'>
          {errorMessage}
        </div>
      }
    </>
  );
};