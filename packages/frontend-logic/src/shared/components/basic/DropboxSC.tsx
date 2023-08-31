import { MouseEventHandler } from "react";
import { CommonLCProps, CommonSCProps, InputSpecificValue } from '../../../types';
import { useInitLC, useTranslation } from "../../hooks";

interface DropboxProps {
  options: string[];
  currentOption: string;
  onClick: MouseEventHandler;
  onChoose: MouseEventHandler;
  svgUrl?: string;
  label: string;
}

interface DropboxSCProps extends DropboxProps, CommonSCProps {
  tNode?: string;
  DropboxLC: React.FC<DropboxLCProps>
}

export interface DropboxLCProps extends DropboxProps, CommonLCProps {
  specific?: InputSpecificValue;
}


/**
 * NEEDS REWORK! ... ?
 */
export const DropboxSC = ({
  classNameOverride,
  classNameAddon,
  id,
  options,
  currentOption,
  onClick,
  onChoose,
  tNode,
  label,
  svgUrl,
  DropboxLC
}: DropboxSCProps) => {

  const { t } = useTranslation();

  const { className, style, specific } = useInitLC({
    componentType: 'input',
    componentName: 'dropbox',
    classNameAddon,
    classNameOverride,
  });

  const translatedOptions = tNode
    ? options.map(option => t(`${tNode}.${option}`))
    : options;
  
  const translatedCurrentOption = tNode
    ? t(`${tNode}.${currentOption}`)
    : currentOption;

  return (
    <DropboxLC
      className={className}
      id={id}
      currentOption={translatedCurrentOption}
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