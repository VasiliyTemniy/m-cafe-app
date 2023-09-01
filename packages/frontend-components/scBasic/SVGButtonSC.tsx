import type { MouseEventHandler } from "react";
import type { CommonSCProps } from '@m-cafe-app/frontend-logic/types';
import { useInitLC } from '@m-cafe-app/frontend-logic/shared/hooks';
import { ContainerLC, ImageLC } from "../lcWeb";

interface SVGButtonProps {
  svgUrl: string;
  altText: string;
  onClick?: MouseEventHandler;
}

interface SVGButtonSCProps extends SVGButtonProps, CommonSCProps {
}


const SVGButtonSC = ({
  classNameOverride,
  classNameAddon,
  id,
  svgUrl,
  altText,
  onClick
}: SVGButtonSCProps) => {

  const { className, style } = useInitLC({
    componentType: 'svg-button',
    componentName: 'svg-button',
    classNameAddon,
    classNameOverride
  });

  return (
    <ContainerLC className={className} id={id} style={style} onClick={onClick}>
      <ImageLC className={`${className} svg`} src={svgUrl} altText={altText} />
    </ContainerLC>
  );
};

export default SVGButtonSC;