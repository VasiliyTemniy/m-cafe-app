import { ButtonLCProps, TooltipSC } from '@m-cafe-app/frontend-logic/src/shared/components';
import { ContainerLC } from './ContainerLC';

export const ButtonLC = ({
  className,
  id,
  style,
  label,
  onClick,
  disabled,
  type,
  tooltip
}: ButtonLCProps) => {

  return (
    <>
      <button
        className={className}
        id={id}
        style={style}
        onClick={onClick}
        disabled={disabled}
        type={type}
      >
        {label}
      </button>
      {
        tooltip &&
        <TooltipSC text={tooltip} ContainerLC={ContainerLC}/>
      }
    </>
  );
};