import { CSSProperties } from "react";
import Container from "./Container";

interface ButtonGroupProps {
  className?: string;
  id?: string;
  style?: CSSProperties;
  children: JSX.Element[] | JSX.Element;
}

const ButtonGroup = ({ className, id, style, children }: ButtonGroupProps) => {

  const classNameSum = className
    ? `button-group ${className}`
    : `button-group`;

  return (
    <Container className={classNameSum} id={id} style={style}>
      {children}
    </Container>
  );
};

export default ButtonGroup;