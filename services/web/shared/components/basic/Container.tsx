import type { CSSProperties, MouseEventHandler, Ref } from "react";

interface ContainerProps {
  className?: string;
  id?: string;
  style?: CSSProperties;
  children?: JSX.Element[] | JSX.Element;
  onClick?: MouseEventHandler;
  onMouseEnter?: MouseEventHandler;
  onMouseMove?: MouseEventHandler;
  onMouseDown?: MouseEventHandler;
  onMouseLeave?: MouseEventHandler;
  onMouseUp?: MouseEventHandler;
  ref?: Ref<HTMLDivElement>;
  text?: string;
}

export const Container = ({
  className,
  id,
  style,
  children,
  onClick,
  onMouseEnter,
  onMouseMove,
  onMouseDown,
  onMouseLeave,
  onMouseUp,
  ref,
  text
}: ContainerProps) => {

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
      onMouseEnter={onMouseEnter}
      onMouseMove={onMouseMove}
      onMouseDown={onMouseDown}
      onMouseLeave={onMouseLeave}
      onMouseUp={onMouseUp}
    >
      {text}
      {children}
    </div>
  );
};