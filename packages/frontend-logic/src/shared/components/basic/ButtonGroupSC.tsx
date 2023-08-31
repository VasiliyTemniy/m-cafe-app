import { CommonSCProps } from '../../../types';
import { useInitLC } from "../../hooks";
import { ContainerLCProps } from './ContainerSC';

interface ButtonGroupProps {
  children: JSX.Element[] | JSX.Element;
}

interface ButtonGroupSCProps extends ButtonGroupProps, CommonSCProps {
  ContainerLC: React.FC<ContainerLCProps>
}

export const ButtonGroupSC = ({
  classNameOverride,
  classNameAddon,
  id,
  children,
  ContainerLC
}: ButtonGroupSCProps) => {

  const { className, style } = useInitLC({
    componentType: 'container',
    componentName: 'button-group',
    classNameAddon,
    classNameOverride,
  });

  return (
    <ContainerLC
      className={className}
      id={id}
      style={style}
    >
      {children}
    </ContainerLC>
  );
};