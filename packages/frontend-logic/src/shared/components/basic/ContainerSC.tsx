import { MouseEventHandler, Ref } from "react";
import { CommonLCProps, CommonSCProps } from '../../../types';
import { useInitLC } from "../../hooks";

interface ContainerProps {
  children?: JSX.Element[] | JSX.Element;
  onClick?: MouseEventHandler;
  onMouseMove?: MouseEventHandler;
  onMouseDown?: MouseEventHandler;
  onMouseLeave?: MouseEventHandler;
  onMouseUp?: MouseEventHandler;
  ref?: Ref<HTMLDivElement>;
  text?: string;
}

interface ContainerSCProps extends ContainerProps, CommonSCProps {
  ContainerLC: React.FC<ContainerLCProps>
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
  ref,
  ContainerLC
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
    >
      {children}
    </ContainerLC>
  );

};