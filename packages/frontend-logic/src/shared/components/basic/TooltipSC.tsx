import { CommonLCProps, CommonSCProps } from '../../../types';
import { useInitLC } from "../../hooks";
import { ContainerLCProps } from './ContainerSC';

interface TooltipProps{
  text: string;
}

interface TooltipSCProps extends TooltipProps, CommonSCProps {
  ContainerLC: React.FC<ContainerLCProps>
}

export interface TooltipLCProps extends TooltipProps, CommonLCProps {
}

export const TooltipSC = ({
  text,
  ContainerLC,
  classNameAddon,
  classNameOverride
}: TooltipSCProps) => {

  const { className, style } = useInitLC({
    componentType: 'container',
    componentName: 'tooltip',
    classNameAddon,
    classNameOverride,
  });

  // TODO
  return (
    <ContainerLC
      text={text}
      className={className}
      style={style}
    />
  );
};