import type { CommonProps } from '@m-cafe-app/frontend-logic/types';
import { useInitLC } from '@m-cafe-app/frontend-logic/shared/hooks';

interface ButtonGroupProps extends CommonProps {
  children: JSX.Element[] | JSX.Element;
}

export const ButtonGroup = ({
  classNameOverride,
  classNameAddon,
  id,
  children
}: ButtonGroupProps) => {

  const { className, style } = useInitLC({
    componentType: 'button-group',
    componentName: 'button-group',
    classNameAddon,
    classNameOverride,
  });

  return (
    <div
      className={className}
      id={id}
      style={style}
    >
      {children}
    </div>
  );
};