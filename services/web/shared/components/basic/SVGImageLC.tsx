import { SVGImageLCProps } from '@m-cafe-app/frontend-logic/src/shared/components';


export const SVGImageLC = ({
  className,
  id,
  style,
  altText,
  svgUrl
}: SVGImageLCProps) => {

  return (
    <img src={svgUrl} className={className} id={id} style={style} alt={altText} />
  );

};