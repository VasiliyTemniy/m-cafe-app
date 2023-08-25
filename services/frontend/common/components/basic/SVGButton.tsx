import { MouseEventHandler, CSSProperties } from "react";
import Container from "./Container";
import SVGImage from "./SVGImage";

interface SVGButtonProps {
  className?: string;
  id?: string;
  style?: CSSProperties;
  svgUrl: string;
  altText: string;
  onClick?: MouseEventHandler;
}

const SVGButton = ({ className, id, style, svgUrl, altText, onClick }: SVGButtonProps) => {

  const classNameSum = className
    ? `svg-button-wrapper ${className}`
    : `svg-button-wrapper`;

  return (
    <Container className={classNameSum} id={id} style={style} onClick={onClick}>
      <SVGImage svgUrl={svgUrl} altText={altText} />
    </Container>
  );
};

export default SVGButton;