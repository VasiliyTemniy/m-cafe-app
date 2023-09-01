import { FieldHookConfig, useField } from "formik";
import type { CommonFieldSCProps } from '@m-cafe-app/frontend-logic/types';
import { useInitLC } from '@m-cafe-app/frontend-logic/shared/hooks';
import { ContainerLC, InputLC } from "../../lcWeb";
import { ImageSC, TooltipSC } from "../../scBasic";
import { apiBaseUrl } from "@m-cafe-app/shared-constants";

type FormikTimeFieldProps = FieldHookConfig<string> & CommonFieldSCProps;

export const FormikTimeFieldSC = ({ disabled = false, ...props }: FormikTimeFieldProps) => {
  
  const [field, meta] = useField(props);

  const errorMessage = meta.error && meta.touched
    ? meta.error
    : '';

  const { className, style, specific, tooltip } = useInitLC({
    componentType: 'input',
    componentName: 'input-time',
    classNameAddon: props.classNameAddon,
    classNameOverride: props.classNameOverride,
    errorMessage,
    placeholder: props.placeholder,
    label: props.label,
    tooltipTNode: props.tooltipTNode
  });
  

  return(
    <ContainerLC className='input-wrapper time'>
      <InputLC
        placeholder={props.placeholder}
        type='time'
        name={field.name}
        value={field.value}
        onChange={field.onChange}
        onBlur={field.onBlur}
        className={className}
        errorMessage={errorMessage}
        disabled={disabled}
        style={style}
        specific={specific}
      />
      <ImageSC src={`${apiBaseUrl}/public/pictures/svg/time.svg`}/>
      <>
        {tooltip &&
          <TooltipSC text={tooltip}/>
        }
      </>
    </ContainerLC>
  );
};