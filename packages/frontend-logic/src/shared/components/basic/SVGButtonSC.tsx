import { MouseEventHandler } from "react";
import { CommonSCProps } from '../../../types';
import { useInitLC } from "../../hooks";
import { ContainerLCProps } from './ContainerSC';
import { SVGImageLCProps } from "./SVGImageSC";

interface SVGButtonProps {
  svgUrl: string;
  altText: string;
  onClick?: MouseEventHandler;
}

interface SVGButtonSCProps extends SVGButtonProps, CommonSCProps {
  ContainerLC: React.FC<ContainerLCProps>
  SVGImageLC: React.FC<SVGImageLCProps>
}


const SVGButtonSC = ({
  classNameOverride,
  classNameAddon,
  id,
  svgUrl,
  altText,
  onClick,
  ContainerLC,
  SVGImageLC
}: SVGButtonSCProps) => {

  const { className, style } = useInitLC({
    componentType: 'svg-button',
    componentName: 'svg-button',
    classNameAddon,
    classNameOverride
  });

  return (
    <ContainerLC className={className} id={id} style={style} onClick={onClick}>
      <SVGImageLC className={`${className} svg`} svgUrl={svgUrl} altText={altText} />
    </ContainerLC>
  );
};

export default SVGButtonSC;