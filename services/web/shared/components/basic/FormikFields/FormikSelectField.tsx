import { MouseEvent, useMemo } from "react";
import { FieldHookConfig, useField } from "formik";
import type { CommonFieldProps } from '@m-cafe-app/frontend-logic/types';
import { useInitLC, useTranslation } from '@m-cafe-app/frontend-logic/shared/hooks';
import { autoCompleteArray } from '@m-cafe-app/frontend-logic/utils';
import { Image } from "../Image";
import { Tooltip } from "../Tooltip";
import { apiBaseUrl } from "@m-cafe-app/shared-constants";
import { Scrollable } from "../Scrollable";


type FormikSelectFieldProps = FieldHookConfig<string> & CommonFieldProps & {
  options: string[],
  tNode?: string,
};

export const FormikSelectField = ({ disabled = false, ...props }: FormikSelectFieldProps) => {
  
  const { t } = useTranslation();

  const [field, meta, helpers] = useField(props);

  const errorMessage = meta.error && meta.touched
    ? meta.error
    : '';

  const { className, style, specific, baseVariant, baseColorVariant } = useInitLC({
    componentType: 'input',
    componentName: 'input-select',
    classNameAddon: props.classNameAddon,
    classNameOverride: props.classNameOverride,
    errorMessage,
    placeholder: props.placeholder,
    label: props.label,
  });

  const inputPlaceholder = specific?.labelAsPlaceholder
    ? undefined
    : props.placeholder;

  const labelText = specific?.labelAsPlaceholder
    ? errorMessage
      ? errorMessage
      : props.placeholder
    : props.label;

  const handleChooseOption = (e: MouseEvent<HTMLDivElement>) => {
    void helpers.setValue(e.currentTarget.innerText, false);
  };

  const displayedOptions = useMemo(
    () => autoCompleteArray(props.options, field.value, t, props.tNode),
    [props.options, field.value]
  );

  return(
    <div className={`input-wrapper select ${baseVariant} ${baseColorVariant}`}>
      <input
        type='text'
        id={field.name}
        name={field.name}
        className={className}
        value={field.value}
        onChange={field.onChange}
        onBlur={field.onBlur}
        disabled={disabled}
        autoComplete='off'
        autoCorrect='off'
        autoCapitalize='off'
        spellCheck='false'
        style={style}
        placeholder={inputPlaceholder}
      />
      <label htmlFor={field.name}>{labelText}</label>
      <Image src={`${apiBaseUrl}/public/pictures/svg/arrow.svg`} classNameAddon='svg'/>
      <>
        {specific?.useBarBelow &&
          <div className='bar'/>
        }
      </>
      <div className='dropdown-wrapper'>
        <Scrollable classNameAddon='options-wrapper' heightTweak={4} highlightScrollbarOnContentHover={false}>
          {displayedOptions.map(option => 
            <div key={option} onMouseDown={handleChooseOption} id={option}>
              { props.tNode ? t(`${props.tNode}.${option}`) : option }
            </div>)
          }
        </Scrollable>
        <>
          {displayedOptions.length > 0 && specific?.useBarBelow &&
            <div className='bar-after'/>
          }
          {props.tooltip &&
            <Tooltip text={props.tooltip}/>
          }
        </>
      </div>
    </div>
  );
};