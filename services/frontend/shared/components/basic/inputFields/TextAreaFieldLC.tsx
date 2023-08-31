import { useRef, FocusEvent } from "react";
import { ContainerLC } from '../ContainerLC';
import {
  TextAreaFieldLCProps,
  ContainerSC,
  TooltipSC,
} from '@m-cafe-app/frontend-logic/src/shared/components';

export const TextAreaFieldLC = ({
  placeholder,
  name,
  value,
  onChange,
  onBlur,
  className,
  errorMessage,
  disabled = false,
  maxrows,
  tooltip,
  style,
  specific
}: TextAreaFieldLCProps) => {

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
    areaRef.current!.style.height = "inherit";  // investigate ! flag for current!
    areaRef.current!.style.height = `${         // investigate ! flag for current!
      Math.min(
        Math.max(
          areaRef.current!.scrollHeight,        // investigate ! flag for current!
          32
        ),
        32 * maxrows + 7
      )
    }px`;
  };

  const inputPlaceholder = specific?.labelAsPlaceholder
    ? undefined
    : placeholder;

  return (
    <ContainerSC classNameAddon='input-wrapper text-area' ContainerLC={ContainerLC}>
      <textarea
        id={name}
        name={name}
        className={`${classNameSum} rows-${maxrows}`}
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
      <label htmlFor={name} className={labelBugFix}>{labelText}</label>
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