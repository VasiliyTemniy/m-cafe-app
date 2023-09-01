import { ChangeEventHandler, FocusEventHandler } from 'react';
import { FieldHookConfig, useField } from "formik";
import type { CommonFieldSCProps } from '@m-cafe-app/frontend-logic/types';
import { useInitLC } from '@m-cafe-app/frontend-logic/shared/hooks';
import { ContainerLC, TextAreaLC } from '../../lcWeb';
import { TooltipSC } from '../../scBasic';

type FormikTextAreaFieldProps = FieldHookConfig<string> & CommonFieldSCProps & {
  onChange: ChangeEventHandler<HTMLTextAreaElement>;
  onBlur: FocusEventHandler<HTMLTextAreaElement>;
  maxrows: number
};


export const FormikTextAreaFieldSC = ({ disabled = false, ...props }: FormikTextAreaFieldProps) => {
  
  const [field, meta] = useField(props);

  const errorMessage = meta.error && meta.touched
    ? meta.error
    : '';

  const { className, style, specific, tooltip } = useInitLC({
    componentType: 'input',
    componentName: 'input-textarea',
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
    <ContainerLC className='input-wrapper text-area'>
      <TextAreaLC
        placeholder={inputPlaceholder}
        name={field.name}
        value={field.value}
        onChange={field.onChange}
        onBlur={field.onBlur}
        maxrows={props.maxrows}
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