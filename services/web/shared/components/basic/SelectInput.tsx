import type { MouseEventHandler } from 'react';
import type { InputProps } from './Input';
import { useDeferredValue } from 'react';
import { useInitLC, useTranslation } from '@m-cafe-app/frontend-logic/shared/hooks';
import { apiBaseUrl } from '@m-cafe-app/shared-constants';
import { Image } from './Image';
import { Scrollable } from './Scrollable';
import { autoCompleteArray } from '@m-cafe-app/frontend-logic/utils';

interface SelectInputProps extends InputProps {
  handleChooseOption: MouseEventHandler;
  options: string[] | [];
  tNode?: string;
}

export const SelectInput = ({
  classNameOverride,
  classNameAddon,
  placeholder,
  label,
  style,
  id,
  type,
  internalType = type,
  name,
  value,
  onChange,
  onBlur,
  handleChooseOption,
  disabled,
  errorMessage,
  children,
  autoComplete = 'off',
  autoCorrect = 'off',
  autoCapitalize = 'off',
  spellCheck = 'false',
  options,
  tNode
}: SelectInputProps) => {

  const { t } = useTranslation();

  const deferredValue = useDeferredValue(value);

  const { className, style: uiSettingsStyle, specific } = useInitLC({
    componentType: 'input',
    componentName: `input ${internalType}`,
    classNameAddon,
    classNameOverride,
    errorMessage
  });

  const inputPlaceholder = specific?.labelAsPlaceholder
    ? undefined
    : placeholder;

  const labelText = specific?.labelAsPlaceholder
    ? errorMessage
      ? errorMessage
      : placeholder
    : label;

  const displayedOptions = autoCompleteArray(options, deferredValue, t, tNode);

  return (
    <div
      id={id}
      className={className}
      style={{ ...style, ...uiSettingsStyle }}
    >
      <input
        type={type}
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        disabled={disabled}
        autoComplete={autoComplete}
        autoCorrect={autoCorrect}
        autoCapitalize={autoCapitalize}
        spellCheck={spellCheck}
        placeholder={inputPlaceholder}
      />
      <label htmlFor={name}>{labelText}</label>
      {specific?.useBarBelow &&
        <div className='bar'/>
      }
      {!specific?.labelAsPlaceholder && errorMessage &&
        <div className='error'>
          {errorMessage}
        </div>
      }
      <Image src={`${apiBaseUrl}/public/pictures/svg/arrow.svg`} classNameAddon='svg'/>
      <div className='dropdown-wrapper'>
        <Scrollable classNameAddon='options-wrapper' heightTweak={4} highlightScrollbarOnContentHover={false}>
          {displayedOptions.map(option => 
            <div key={option} onMouseDown={handleChooseOption} id={option}>
              { tNode ? t(`${tNode}.${option}`) : option }
            </div>)
          }
        </Scrollable>
        <>
          {displayedOptions.length > 0 && specific?.useBarBelow &&
            <div className='bar-after'/>
          }
        </>
      </div>
      {children}
    </div>
  );
};