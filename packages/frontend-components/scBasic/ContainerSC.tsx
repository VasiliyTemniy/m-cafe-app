import type { MouseEventHandler, Ref, SyntheticEvent } from "react";
import type { CommonLCProps, CommonSCProps } from '@m-cafe-app/frontend-logic/types';
import { useInitLC } from '@m-cafe-app/frontend-logic/shared/hooks';
import { ContainerLC } from "../lcWeb";

interface ContainerProps {
  children?: JSX.Element[] | JSX.Element;
  onClick?: MouseEventHandler;
  onMouseMove?: MouseEventHandler;
  onMouseDown?: MouseEventHandler;
  onMouseLeave?: MouseEventHandler;
  onMouseUp?: MouseEventHandler;
  onMouseDownAlt?: (e: SyntheticEvent<HTMLDivElement>) => void;
  ref?: Ref<HTMLDivElement>;
  text?: string;
}

interface ContainerSCProps extends ContainerProps, CommonSCProps {
}

export interface ContainerLCProps extends ContainerProps, CommonLCProps {
}

export const ContainerSC = ({
  classNameOverride,
  classNameAddon,
  id,
  children,
  onClick,
  onMouseMove,
  onMouseDown,
  onMouseLeave,
  onMouseUp,
  onMouseDownAlt,
  ref
}: ContainerSCProps) => {

  const { className, style } = useInitLC({
    componentType: 'container',
    componentName: 'container',
    classNameAddon,
    classNameOverride,
  });

  return (
    <ContainerLC
      ref={ref}
      className={className}
      id={id}
      style={style}
      onClick={onClick}
      onMouseMove={onMouseMove}
      onMouseDown={onMouseDown}
      onMouseLeave={onMouseLeave}
      onMouseUp={onMouseUp}
      onMouseDownAlt={onMouseDownAlt}
    >
      {children}
    </ContainerLC>
  );

};