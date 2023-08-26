import { CSSProperties } from "react";

interface TextProps {
  className?: string;
  id?: string;
  style?: CSSProperties;
  text?: string;
  children?: JSX.Element[] | JSX.Element;
}

const TextComp = ({ className, id, style, text, children }: TextProps) => {

  const classNameSum = className
    ? `text ${className}`
    : `text`;

  return (
    <div className={classNameSum} id={id} style={style}>
      {text}
      {children}
    </div>
  );

};

export default TextComp;