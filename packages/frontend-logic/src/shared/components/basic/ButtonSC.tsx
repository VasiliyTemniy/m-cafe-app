import { MouseEventHandler } from "react";
import { CommonLCProps, CommonSCProps } from '../../../types';
import { useInitLC } from "../../hooks";

interface ButtonProps {
  label: string;
  onClick?: MouseEventHandler;
  disabled?: boolean;
  type?: React.ButtonHTMLAttributes<HTMLButtonElement>["type"];
}

interface ButtonSCProps extends ButtonProps, CommonSCProps {
  variant?: 'primary' | 'secondary' | 'delete';
  ButtonLC: React.FC<ButtonLCProps>
}

export interface ButtonLCProps extends ButtonProps, CommonLCProps {
}

export const ButtonSC = ({
  classNameOverride,
  classNameAddon,
  id,
  label,
  onClick,
  disabled = false,
  type = 'button',
  variant = 'primary',
  tooltipTNode,
  ButtonLC
}: ButtonSCProps) => {

  const { className, style, tooltip } = useInitLC({
    componentType: 'button',
    componentName: 'button',
    classNameAddon,
    classNameOverride,
    variant,
    tooltipTNode
  });

  return (
    <ButtonLC
      className={className}
      id={id}
      style={style}
      onClick={onClick}
      disabled={disabled}
      type={type}
      label={label}
      tooltip={tooltip}
    />
  );
};