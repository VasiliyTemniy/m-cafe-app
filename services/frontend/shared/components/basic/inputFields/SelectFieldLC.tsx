import { ContainerLC } from '../ContainerLC';
import { SVGImageLC } from '../SVGImageLC';
import {
  SelectFieldLCProps,
  ContainerSC,
  TooltipSC,
  SVGImageSC
} from '@m-cafe-app/frontend-logic/src/shared/components';


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
  onChooseOption,
  tooltip,
  style,
  specific
}: SelectFieldLCProps) => {

  const inputPlaceholder = specific?.labelAsPlaceholder
    ? undefined
    : placeholder;

  return (
    <ContainerSC classNameAddon='input-wrapper select' ContainerLC={ContainerLC}>
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
      <SVGImageSC svgUrl={svgUrl} SVGImageLC={SVGImageLC}/>
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
      <ContainerSC classNameAddon='dropdown-wrapper' ContainerLC={ContainerLC}>
        <ContainerSC classNameAddon='options-wrapper' ContainerLC={ContainerLC}>
          {options.map(option => 
            <div key={option} onMouseDown={onChooseOption} id={option}>{
              option
            }</div>)
          }
        </ContainerSC>
        <>
          {options.length > 0 && specific?.useBarBelow &&
            <div className='bar-after'/>
          }
        </>
      </ContainerSC>
    </ContainerSC>
  );

};

export default SelectField;