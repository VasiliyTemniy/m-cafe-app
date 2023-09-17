import { useInitLC } from "@m-cafe-app/frontend-logic/shared/hooks";
import { ContainerProps } from "./Container";

export interface WrapperProps extends ContainerProps {
}

export const Wrapper = ({
  classNameOverride,
  classNameAddon,
  id,
  children,
  onClick,
  onMouseEnter,
  onMouseMove,
  onMouseDown,
  onMouseLeave,
  onMouseUp,
  ref,
  text,
  style
}: WrapperProps) => {

  const { className, style: settingsStyle } = useInitLC({
    componentType: 'wrapper',
    componentName: 'wrapper',
    classNameAddon,
    classNameOverride,
  });

  return (
    <div
      ref={ref}
      className={className}
      id={id}
      style={{ ...style, ...settingsStyle }}
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