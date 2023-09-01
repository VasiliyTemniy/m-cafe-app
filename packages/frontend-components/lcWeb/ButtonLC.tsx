import { ButtonLCProps } from '../scBasic';

export const ButtonLC = ({
  className,
  id,
  style,
  label,
  onClick,
  disabled,
  type
}: ButtonLCProps) => {

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
    </button>
  );
};