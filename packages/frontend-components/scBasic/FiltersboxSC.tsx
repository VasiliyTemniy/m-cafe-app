import type { MouseEventHandler } from "react";
import type { CommonLCProps, CommonSCProps, InputSpecificValue } from '@m-cafe-app/frontend-logic/types';
import { useInitLC, useTranslation } from '@m-cafe-app/frontend-logic/shared/hooks';
import { ContainerLC } from "../lcWeb";
import { TextCompSC } from "./TextCompSC";
import { ImageSC } from "./ImageSC";
import { SwitchSC } from "./SwitchSC";


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
}

export interface FiltersboxLCProps extends FiltersboxProps, CommonLCProps {
  specific?: InputSpecificValue;
}


/**
 * NEEDS REWORK! ... ? For react-native : for sure
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
  label
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
    <ContainerLC className={className} id={id} style={style}>
      <ContainerLC className='chosen-wrapper' onClick={onClick}>
        <TextCompSC text={label} ContainerLC={ContainerLC}/>
        <>
          {svgUrl && <ImageSC src={svgUrl}/>}
          {specific?.useBarBelow &&
          <ContainerLC className='bar'/>
          }
        </>
      </ContainerLC>
      <ContainerLC className='dropdown-wrapper'>
        <ContainerLC className='options-wrapper filters'>
          {translatedOptions.map(option =>
            <ContainerLC key={`${option.name} filter-option`} onClick={onChoose} className='option' id={option.name}>
              <ContainerLC text={option.name}/>
              <SwitchSC checked={option.checked} id={option.name}/>
            </ContainerLC>
          )}
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