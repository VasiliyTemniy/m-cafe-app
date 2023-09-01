import type { MouseEventHandler } from "react";
import type { CommonLCProps, CommonSCProps } from '@m-cafe-app/frontend-logic/types';
import { useInitLC } from "@m-cafe-app/frontend-logic/shared/hooks";
import { TooltipSC } from "./TooltipSC";
import { ButtonLC } from "../lcWeb";

interface ButtonProps {
  label: string;
  onClick?: MouseEventHandler;
  disabled?: boolean;
  type?: React.ButtonHTMLAttributes<HTMLButtonElement>["type"];
}

interface ButtonSCProps extends ButtonProps, CommonSCProps {
  variant?: 'primary' | 'secondary' | 'delete';
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
  tooltipTNode
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
    <>
      <ButtonLC
        className={className}
        id={id}
        style={style}
        onClick={onClick}
        disabled={disabled}
        type={type}
        label={label}
      />
      {tooltip &&
        <TooltipSC text={tooltip}/>
      }
    </>
  );
};