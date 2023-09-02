import type { CommonProps } from '@m-cafe-app/frontend-logic/types';
import { useInitLC } from '@m-cafe-app/frontend-logic/shared/hooks';

interface TooltipProps extends CommonProps {
  text: string;
}

export const Tooltip = ({
  text,
  classNameAddon,
  classNameOverride
}: TooltipProps) => {

  const { className, style } = useInitLC({
    componentType: 'container',
    componentName: 'tooltip',
    classNameAddon,
    classNameOverride,
  });

  // TODO
  return (
    <div className={className} style={style}>
      {text}
    </div>
  );
};