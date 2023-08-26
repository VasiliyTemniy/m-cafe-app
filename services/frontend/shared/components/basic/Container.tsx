import { CSSProperties, MouseEventHandler, Ref } from "react";

interface ContainerProps {
  className?: string;
  id?: string;
  style?: CSSProperties;
  children: JSX.Element[] | JSX.Element;
  onClick?: MouseEventHandler;
  onMouseMove?: MouseEventHandler;
  onMouseDown?: MouseEventHandler;
  onMouseLeave?: MouseEventHandler;
  onMouseUp?: MouseEventHandler;
  ref?: Ref<HTMLDivElement>;
}

const Container = ({ className, id, style, children, onClick, onMouseMove, onMouseDown, onMouseLeave, onMouseUp, ref }: ContainerProps) => {

  const classNameSum = className
    ? `container ${className}`
    : `container`;

  return (
    <div
      ref={ref}
      className={classNameSum}
      id={id}
      style={style}
      onClick={onClick}
      onMouseMove={onMouseMove}
      onMouseDown={onMouseDown}
      onMouseLeave={onMouseLeave}
      onMouseUp={onMouseUp}
    >
      {children}
    </div>
  );

};

export default Container;