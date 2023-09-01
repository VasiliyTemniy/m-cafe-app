import {
  DropboxLCProps,
  SVGImageSC,
  TextCompSC
} from "@m-cafe-app/frontend-logic/src/shared/components";
import { ContainerLC } from "./ContainerLC";
import { SVGImageLC } from "./SVGImageLC";

/**
 * NEEDS REWORK! ... ?
 */
export const DropboxLC = ({
  className,
  id,
  style,
  options,
  currentOption,
  onClick,
  onChoose,
  label,
  svgUrl,
  specific
}: DropboxLCProps) => {

  return (
    <ContainerLC className={className} id={id} style={style}>
      <ContainerLC className='chosen-wrapper' onClick={onClick}>
        <TextCompSC text={currentOption} ContainerLC={ContainerLC}/>
        <label htmlFor={id}>{label}</label>
        <>
          {svgUrl && <SVGImageSC svgUrl={svgUrl} SVGImageLC={SVGImageLC}/>}
          {specific?.useBarBelow &&
            <div className='bar'/>
          }
        </>
      </ContainerLC>
      <ContainerLC className='dropdown-wrapper'>
        <ContainerLC className='options-wrapper'>
          {options.map(option => 
            <div key={option} onClick={onChoose} id={option} className='option'>{
              option
            }</div>)
          }
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