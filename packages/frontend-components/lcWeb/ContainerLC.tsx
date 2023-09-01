import { ContainerLCProps } from '../scBasic';

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
  onMouseDownAlt,
  ref,
  text
}: ContainerLCProps) => {
  
  const onMouseDownHalndler = onMouseDownAlt
    ? onMouseDownAlt :
    onMouseDown;

  return (
    <div
      ref={ref}
      className={className}
      id={id}
      style={style}
      onClick={onClick}
      onMouseMove={onMouseMove}
      onMouseDown={onMouseDownHalndler}
      onMouseLeave={onMouseLeave}
      onMouseUp={onMouseUp}
    >
      {text}
      {children}
    </div>
  );

};