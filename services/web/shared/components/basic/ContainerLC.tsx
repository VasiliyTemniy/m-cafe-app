import { ContainerLCProps } from '@m-cafe-app/frontend-logic/src/shared/components';

export const ContainerLC = ({
  className,
  id,
  style,
  children,
  onClick,
  onMouseMove,
  onMouseDown,
  onMouseLeave,
  onMouseUp,
  ref,
  text
}: ContainerLCProps) => {

  return (
    <div
      ref={ref}
      className={className}
      id={id}
      style={style}
      onClick={onClick}
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