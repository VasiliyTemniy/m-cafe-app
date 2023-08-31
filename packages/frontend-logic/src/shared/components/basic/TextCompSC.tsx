import { CommonSCProps } from '../../../types';
import { useInitLC } from "../../hooks";
import { ContainerLCProps } from './ContainerSC';

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