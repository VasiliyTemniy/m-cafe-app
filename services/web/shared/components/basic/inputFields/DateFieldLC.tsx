import { ContainerLC } from '../ContainerLC';
import { SVGImageLC } from '../SVGImageLC';
import {
  DateFieldLCProps,
  ContainerSC,
  TooltipSC,
  SVGImageSC
} from '@m-cafe-app/frontend-logic/src/shared/components';


export const DateFieldLC = ({
  placeholder,
  name,
  value,
  onChange,
  onBlur,
  svgUrl,
  className,
  errorMessage,
  type = 'date',
  disabled = false,
  tooltip,
  style,
  specific
}: DateFieldLCProps) => {

  const inputPlaceholder = specific?.labelAsPlaceholder
    ? undefined
    : placeholder;

  return (
    <ContainerSC classNameAddon='input-wrapper date' ContainerLC={ContainerLC}>
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
    </ContainerSC>
  );

};