import { FieldHookConfig, useField } from "formik";
import type { CommonFieldSCProps } from '@m-cafe-app/frontend-logic/types';
import { useInitLC } from '@m-cafe-app/frontend-logic/shared/hooks';
import { ContainerLC, InputLC } from "../../lcWeb";
import { TooltipSC } from "../../scBasic";

type FormikTextFieldProps = FieldHookConfig<string> & CommonFieldSCProps;


export const FormikTextFieldSC = ({ disabled = false, ...props }: FormikTextFieldProps) => {
  
  const [field, meta] = useField(props);

  const errorMessage = meta.error && meta.touched
    ? meta.error
    : '';

  const { className, style, specific, tooltip } = useInitLC({
    componentType: 'input',
    componentName: 'input-text',
    classNameAddon: props.classNameAddon,
    classNameOverride: props.classNameOverride,
    errorMessage,
    placeholder: props.placeholder,
    label: props.label,
    tooltipTNode: props.tooltipTNode
  });

  return(
    <ContainerLC className='input-wrapper text-plain'>
      <InputLC
        placeholder={props.placeholder}
        type={props.type}
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
      <>
        {tooltip &&
          <TooltipSC text={tooltip}/>
        }
      </>
    </ContainerLC>
  );
};