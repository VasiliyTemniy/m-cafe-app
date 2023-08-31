import { ContainerLC } from '../ContainerLC';
import {
  TextFieldLCProps,
  ContainerSC,
  TooltipSC,
} from '@m-cafe-app/frontend-logic/src/shared/components';

export const TextFieldLC = ({
  placeholder,
  name,
  value,
  onChange,
  onBlur,
  className,
  errorMessage,
  type = 'text',
  disabled = false,
  tooltip,
  style,
  specific
}: TextFieldLCProps) => {

  const inputPlaceholder = specific?.labelAsPlaceholder
    ? undefined
    : placeholder;


  return (
    <ContainerSC classNameAddon='input-wrapper text-plain' ContainerLC={ContainerLC}>
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
        autoComplete='off'
        autoCorrect='off'
        autoCapitalize='off'
        spellCheck='false'
        placeholder={inputPlaceholder}
      />
      <label htmlFor={name}>{specific?.labelText}</label>
      <>
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
        {
          tooltip &&
          <TooltipSC text={tooltip} ContainerLC={ContainerLC}/>
        }
      </>
    </ContainerSC>
  );

};