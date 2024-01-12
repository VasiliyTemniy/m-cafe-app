import type { MouseEventHandler } from 'react';
import type { CommonProps } from '@m-market-app/frontend-logic/types';
import { useInitLC } from '@m-market-app/frontend-logic/shared/hooks';
import { Tooltip } from './Tooltip';

interface ButtonProps extends CommonProps {
  label: string;
  onClick?: MouseEventHandler;
  disabled?: boolean;
  type?: React.ButtonHTMLAttributes<HTMLButtonElement>['type'];
  variant?: 'primary' | 'secondary' | 'delete';
}

export const Button = ({
  classNameOverride,
  classNameAddon,
  id,
  label,
  onClick,
  disabled = false,
  type = 'button',
  variant = 'primary',
  tooltip
}: ButtonProps) => {

  const { className, style } = useInitLC({
    componentType: 'button',
    componentName: 'button',
    classNameAddon,
    classNameOverride,
    variant,
  });

  return (
    <button
      className={className}
      id={id}
      style={style}
      onClick={onClick}
      disabled={disabled}
      type={type}
    >
      {label}
      {tooltip &&
          <Tooltip text={tooltip}/>
      }
    </button>
  );
};