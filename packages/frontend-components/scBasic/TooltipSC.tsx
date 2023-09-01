import type { CommonLCProps, CommonSCProps } from '@m-cafe-app/frontend-logic/types';
import { useInitLC } from '@m-cafe-app/frontend-logic/shared/hooks';
import { ContainerLC } from '../lcWeb';

interface TooltipProps{
  text: string;
}

interface TooltipSCProps extends TooltipProps, CommonSCProps {
}

export interface TooltipLCProps extends TooltipProps, CommonLCProps {
}

export const TooltipSC = ({
  text,
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