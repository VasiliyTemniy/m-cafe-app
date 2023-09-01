import type { CommonSCProps } from '@m-cafe-app/frontend-logic/types';
import { useInitLC } from "@m-cafe-app/frontend-logic/shared/hooks";
import { ContainerLC } from '../lcWeb';

interface ButtonGroupProps {
  children: JSX.Element[] | JSX.Element;
}

interface ButtonGroupSCProps extends ButtonGroupProps, CommonSCProps {
}

export const ButtonGroupSC = ({
  classNameOverride,
  classNameAddon,
  id,
  children
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