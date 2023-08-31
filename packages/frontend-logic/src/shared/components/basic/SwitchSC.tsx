import { CommonLCProps, CommonSCProps } from '../../../types';
import { useInitLC } from "../../hooks";

interface SwitchProps {
  textLeft?: string;
  textRight?: string;
  checked: boolean;
  id: string;
}

interface SwitchSCProps extends Omit<CommonSCProps, 'id'>, SwitchProps {
  SwitchLC: React.FC<SwitchLCProps>
}

export interface SwitchLCProps extends Omit<CommonLCProps, 'id'>, SwitchProps {
}

export const SwitchSC = ({
  classNameOverride,
  classNameAddon,
  textLeft,
  textRight,
  checked,
  id,
  SwitchLC
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