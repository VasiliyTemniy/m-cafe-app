import { MouseEventHandler } from "react";
import { CommonLCProps, CommonSCProps, InputSpecificValue } from '../../../types';
import { useInitLC, useTranslation } from "../../hooks";

interface FiltersboxProps {
  options: Array<{
    name: string,
    checked: boolean
  }>;
  onClick: MouseEventHandler;
  onChoose: MouseEventHandler;
  svgUrl?: string;
  label: string;
}

interface FiltersboxSCProps extends FiltersboxProps, CommonSCProps {
  tNode?: string;
  FiltersboxLC: React.FC<FiltersboxLCProps>
}

export interface FiltersboxLCProps extends FiltersboxProps, CommonLCProps {
  specific?: InputSpecificValue;
}


/**
 * NEEDS REWORK! ... ?
 */
export const FiltersboxSC = ({
  classNameOverride,
  classNameAddon,
  id,
  options,
  onClick,
  onChoose,
  tNode,
  svgUrl,
  label,
  FiltersboxLC
}: FiltersboxSCProps) => {

  const { t } = useTranslation();

  const { className, style, specific } = useInitLC({
    componentType: 'input',
    componentName: 'filtersbox',
    classNameAddon,
    classNameOverride,
  });

  const translatedOptions = tNode
    ? options.map(option => {
      return {
        checked: option.checked,
        name: t(`${tNode}.${option.name}`)
      };
    })
    : options;

  return (
    <FiltersboxLC
      className={className}
      id={id}
      options={translatedOptions}
      onClick={onClick}
      onChoose={onChoose}
      svgUrl={svgUrl}
      style={style}
      specific={specific}
      label={label}
    />
  );
};