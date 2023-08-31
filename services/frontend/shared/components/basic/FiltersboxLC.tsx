import {
  FiltersboxLCProps,
  SVGImageSC,
  SwitchSC,
  TextCompSC
} from "@m-cafe-app/frontend-logic/src/shared/components";
import { ContainerLC } from "./ContainerLC";
import { SwitchLC } from "./SwitchLC";
import { SVGImageLC } from "./SVGImageLC";

/**
 * NEEDS REWORK! ... ?
 */
export const FiltersboxLC = ({
  className,
  id,
  style,
  options,
  onClick,
  onChoose,
  svgUrl,
  specific,
  label
}: FiltersboxLCProps) => {

  return (
    <ContainerLC className={className} id={id} style={style}>
      <ContainerLC className='chosen-wrapper' onClick={onClick}>
        <TextCompSC text={label} ContainerLC={ContainerLC}/>
        <>
          {svgUrl && <SVGImageSC svgUrl={svgUrl} SVGImageLC={SVGImageLC}/>}
          {specific?.useBarBelow &&
            <div className='bar'/>
          }
        </>
      </ContainerLC>
      <ContainerLC className='dropdown-wrapper'>
        <ContainerLC className='options-wrapper filters'>
          {options.map(option =>
            <ContainerLC key={`${option.name} filter-option`} onClick={onChoose} className='option' id={option.name}>
              <div>{ option.name }</div>
              <SwitchSC checked={option.checked} id={option.name} SwitchLC={SwitchLC}/>
            </ContainerLC>
          )}
        </ContainerLC>
        <>
          {options.length > 0 && specific?.useBarBelow &&
            <div className='bar-after'/>
          }
        </>
      </ContainerLC>
    </ContainerLC>
  );
};