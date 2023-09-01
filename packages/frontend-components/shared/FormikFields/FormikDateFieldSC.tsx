import { FieldHookConfig, useField } from "formik";
import type { CommonFieldSCProps } from '@m-cafe-app/frontend-logic/types';
import { useInitLC } from '@m-cafe-app/frontend-logic/shared/hooks';
import { InputLC } from "../../lcWeb/InputLC";
import { ImageSC, TooltipSC } from "../../scBasic";
import { ContainerLC } from "../../lcWeb";
import { apiBaseUrl } from "@m-cafe-app/shared-constants";

type FormikDateFieldProps = FieldHookConfig<string> & CommonFieldSCProps;

export const FormikDateFieldSC = ({ disabled = false, ...props }: FormikDateFieldProps) => {
  
  const [field, meta] = useField(props);

  const errorMessage = meta.error && meta.touched
    ? meta.error
    : '';

  const { className, style, specific, tooltip } = useInitLC({
    componentType: 'input',
    componentName: 'input-date',
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

  return(
    <ContainerLC className='input-wrapper date'>
      <InputLC
        placeholder={inputPlaceholder}
        type='date'
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
      <ImageSC src={`${apiBaseUrl}/public/pictures/svg/calendar.svg`}/>
      <>
        {tooltip &&
          <TooltipSC text={tooltip}/>
        }
      </>
    </ContainerLC>
  );
};