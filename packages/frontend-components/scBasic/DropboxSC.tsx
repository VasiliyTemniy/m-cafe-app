import type { MouseEventHandler } from "react";
import type { CommonSCProps } from '@m-cafe-app/frontend-logic/types';
import { useInitLC, useTranslation } from '@m-cafe-app/frontend-logic/shared/hooks';
import { ContainerLC, LabelLC } from "../lcWeb";
import { TextCompSC } from "./TextCompSC";
import { ImageSC } from "./ImageSC";

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
}


/**
 * NEEDS REWORK! ... ? For react-native : for sure
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
  svgUrl
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
    <ContainerLC className={className} id={id} style={style}>
      <ContainerLC className='chosen-wrapper' onClick={onClick}>
        <TextCompSC text={translatedCurrentOption} ContainerLC={ContainerLC}/>
        <LabelLC htmlFor={id}>{label}</LabelLC>
        <>
          {svgUrl && <ImageSC src={svgUrl}/>}
          {specific?.useBarBelow &&
            <ContainerLC className='bar'/>
          }
        </>
      </ContainerLC>
      <ContainerLC className='dropdown-wrapper'>
        <ContainerLC className='options-wrapper'>
          {translatedOptions.map(option => 
            <ContainerLC key={option} onClick={onChoose} id={option} className='option' text={option}/>)
          }
        </ContainerLC>
        <>
          {translatedOptions.length > 0 && specific?.useBarBelow &&
            <ContainerLC className='bar-after'/>
          }
        </>
      </ContainerLC>
    </ContainerLC>
  );
};