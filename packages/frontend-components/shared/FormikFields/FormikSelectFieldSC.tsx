import { SyntheticEvent } from "react";
import { FieldHookConfig, useField } from "formik";
import type { CommonFieldSCProps } from '@m-cafe-app/frontend-logic/types';
import { useInitLC, useTranslation } from '@m-cafe-app/frontend-logic/shared/hooks';
import {
  autoCompleteTranslatedArray,
  autoCompleteArray
} from '@m-cafe-app/frontend-logic/utils';
import { InputLC, ContainerLC } from "../../lcWeb";
import { ImageSC, TooltipSC } from "../../scBasic";

type FormikSelectFieldProps = FieldHookConfig<string> & CommonFieldSCProps & {
  options: string[],
  tNode?: string,
  svgUrl: string,
};

/**
 * NEEDS REWORK! ... ? For react-native : for sure
 */
export const FormikSelectFieldSC = ({ disabled = false, ...props }: FormikSelectFieldProps) => {
  
  const { t } = useTranslation();

  const [field, meta, helpers] = useField(props);

  const errorMessage = meta.error && meta.touched
    ? meta.error
    : '';

  const { className, style, specific, tooltip } = useInitLC({
    componentType: 'input',
    componentName: 'input-select',
    classNameAddon: props.classNameAddon,
    classNameOverride: props.classNameOverride,
    errorMessage,
    placeholder: props.placeholder,
    label: props.label,
    tooltipTNode: props.tooltipTNode
  });

  const inputPlaceholder = specific?.labelAsPlaceholder
    ? undefined
    : props.placeholder;

  const handleChooseOption = (e: SyntheticEvent<HTMLDivElement>) => {
    void helpers.setValue(e.currentTarget.innerText, false);
  };

  const translatedOptions = props.tNode
    ? props.options.map(option => t(`${props.tNode}.${option}`))
    : undefined;

  const displayedOptions = props.tNode && translatedOptions
    ? autoCompleteTranslatedArray(translatedOptions, field.value, t, props.tNode)
    : autoCompleteArray(props.options, field.value);

  return(
    <ContainerLC className='input-wrapper select'>
      <InputLC
        placeholder={inputPlaceholder}
        type='text'
        name={field.name}
        value={field.value}
        onChange={field.onChange}
        onBlur={field.onBlur}
        className={className}
        errorMessage={errorMessage}
        style={style}
        disabled={disabled}
        specific={specific}
      />
      <ImageSC src={props.svgUrl}/>
      <ContainerLC className='dropdown-wrapper'>
        <ContainerLC className='options-wrapper'>
          {displayedOptions.map(option => 
            <ContainerLC key={option} onMouseDownAlt={handleChooseOption} id={option} text={option}/>)
          }
        </ContainerLC>
        <>
          {displayedOptions.length > 0 && specific?.useBarBelow &&
            <ContainerLC className='bar-after'/>
          }
          {tooltip &&
            <TooltipSC text={tooltip}/>
          }
        </>
      </ContainerLC>
    </ContainerLC>
  );
};