import type { MouseEventHandler } from 'react';
import type { CommonProps } from '@m-market-app/frontend-logic/types';
import { useInitLC } from '@m-market-app/frontend-logic/shared/hooks';

interface SwitchProps extends CommonProps {
  textLeft?: string;
  textRight?: string;
  checked: boolean;
  id: string;
  onClick: MouseEventHandler;
  disabled?: boolean;
}

export const Switch = ({
  classNameOverride,
  classNameAddon,
  textLeft,
  textRight,
  checked,
  onClick,
  id,
  disabled = false
}: SwitchProps) => {
  
  const { className } = useInitLC({
    componentType: 'switch',
    componentName: 'switch',
    classNameAddon,
    classNameOverride,
  });
  
  return (
    <div className={className} onClick={onClick}>
      <input
        type="checkbox"
        className="switch-checkbox"
        name={id}
        id={id}
        checked={checked}
        readOnly={true}
        disabled={disabled}
      />
      <label className="switch-label" htmlFor={id}>
        <span className="switch-inner" data-textleft={textLeft} data-textright={textRight} />
        <span className="switch-switch" />
      </label>
    </div>
  );
};