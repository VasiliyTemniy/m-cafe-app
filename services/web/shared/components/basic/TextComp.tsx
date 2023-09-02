import type { CommonProps } from '@m-cafe-app/frontend-logic/types';
import { useInitLC } from '@m-cafe-app/frontend-logic/shared/hooks';
  
interface TextCompProps extends CommonProps {
  text?: string;
  children?: JSX.Element[] | JSX.Element;
}

export const TextComp = ({
  classNameOverride,
  classNameAddon,
  id,
  text,
  children
}: TextCompProps) => {

  const { className, style } = useInitLC({
    componentType: 'container',
    componentName: 'text',
    classNameAddon,
    classNameOverride,
  });

  return (
    <div
      className={className}
      id={id}
      style={style}
    >
      {text}
      {children}
    </div>
  );
};