import type { CommonLCProps, CommonSCProps } from '@m-cafe-app/frontend-logic/types';
import { useInitLC } from '@m-cafe-app/frontend-logic/shared/hooks';
import { SwitchLC } from '../lcWeb';

interface SwitchProps {
  textLeft?: string;
  textRight?: string;
  checked: boolean;
  id: string;
}

interface SwitchSCProps extends Omit<CommonSCProps, 'id'>, SwitchProps {
}

export interface SwitchLCProps extends Omit<CommonLCProps, 'id'>, SwitchProps {
}

export const SwitchSC = ({
  classNameOverride,
  classNameAddon,
  textLeft,
  textRight,
  checked,
  id
}: SwitchSCProps) => {
  
  const { className } = useInitLC({
    componentType: 'switch',
    componentName: 'switch',
    classNameAddon,
    classNameOverride,
  });
  
  return (
    <SwitchLC
      className={className}
      id={id}
      textLeft={textLeft}
      textRight={textRight}
      checked={checked}
    />
  );
};