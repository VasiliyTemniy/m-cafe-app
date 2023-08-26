import { CSSProperties } from "react";

interface SVGImageProps {
  className?: string;
  id?: string;
  style?: CSSProperties;
  altText?: string;
  svgUrl: string;
}

const SVGImage = ({ className, id, style, altText, svgUrl }: SVGImageProps) => {

  const classNameSum = className
    ? `svg-image ${className}`
    : `svg-image`;

  return (
    <img src={svgUrl} className={classNameSum} id={id} style={style} alt={altText} />
  );

};

export default SVGImage;