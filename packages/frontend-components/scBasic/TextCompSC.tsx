import type { CommonSCProps } from '@m-cafe-app/frontend-logic/types';
import { useInitLC } from '@m-cafe-app/frontend-logic/shared/hooks';
import type { ContainerLCProps } from './ContainerSC';

interface TextCompProps {
  text?: string;
  children?: JSX.Element[] | JSX.Element;
}

interface TextCompSCProps extends TextCompProps, CommonSCProps {
  ContainerLC: React.FC<ContainerLCProps>
}


export const TextCompSC = ({
  classNameOverride,
  classNameAddon,
  id,
  text,
  children,
  ContainerLC
}: TextCompSCProps) => {

  const { className, style } = useInitLC({
    componentType: 'container',
    componentName: 'text',
    classNameAddon,
    classNameOverride,
  });

  return (
    <ContainerLC
      className={className}
      id={id}
      style={style}
      text={text}
    >
      {children}
    </ContainerLC>
  );
};