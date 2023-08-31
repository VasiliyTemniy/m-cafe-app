import { MouseEventHandler, SyntheticEvent } from "react";
import { FieldHookConfig, useField } from "formik";
import type {
  CommonFieldSCProps,
  CommonFieldLCProps
} from "../../../types";
import { useInitLC, useTranslation } from "../../hooks";
import {
  autoCompleteTranslatedArray,
  autoCompleteArray
} from '../../../utils/autocomplete';

type FormikSelectFieldProps = FieldHookConfig<string> & CommonFieldSCProps & {
  options: string[],
  tNode?: string,
  svgUrl: string,
  SelectFieldLC: React.FC<SelectFieldLCProps>
};

export interface SelectFieldLCProps extends CommonFieldLCProps {
  svgUrl: string;
  type?: string;
  options: string[];
  onChooseOption: MouseEventHandler<HTMLDivElement>;
}

export const FormikSelectFieldSC = ({ disabled = false, SelectFieldLC, ...props }: FormikSelectFieldProps) => {
  
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
    <SelectFieldLC
      placeholder={props.placeholder}
      label={props.label}
      type={props.type}
      name={field.name}
      value={field.value}
      onChange={field.onChange}
      onBlur={field.onBlur}
      svgUrl={props.svgUrl}
      options={displayedOptions}
      onChooseOption={handleChooseOption}
      className={className}
      errorMessage={errorMessage}
      disabled={disabled}
      tooltip={tooltip}
      style={style}
      specific={specific}
    />
  );
};