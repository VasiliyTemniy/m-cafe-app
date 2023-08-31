import { CommonLCProps, CommonSCProps } from '../../../types';
import { useInitLC } from "../../hooks";

interface SVGImageProps {
  altText?: string;
  svgUrl: string;
}

interface SVGImageSCProps extends SVGImageProps, CommonSCProps {
  SVGImageLC: React.FC<SVGImageLCProps>
}

export interface SVGImageLCProps extends SVGImageProps, CommonLCProps {
}

export const SVGImageSC = ({
  classNameOverride,
  classNameAddon,
  id,
  altText,
  svgUrl,
  SVGImageLC
}: SVGImageSCProps) => {

  const { className, style } = useInitLC({
    componentType: 'svg-image',
    componentName: 'svg-image',
    classNameAddon,
    classNameOverride,
  });

  return (
    <SVGImageLC
      svgUrl={svgUrl}
      className={className}
      id={id}
      style={style}
      altText={altText}
    />
  );

};