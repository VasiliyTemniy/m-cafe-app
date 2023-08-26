import { CSSProperties, MouseEventHandler } from "react";

interface ButtonProps {
  className?: string;
  id?: string;
  style?: CSSProperties;
  label: string;
  onClick?: MouseEventHandler;
  disabled?: boolean;
  type?: React.ButtonHTMLAttributes<HTMLButtonElement>["type"];
  variant?: 'primary' | 'secondary' | 'delete';
}

const Button = ({ className, id, style, label, onClick, disabled = false, type = 'button', variant = 'primary' }: ButtonProps) => {

  const classNameSum = className
    ? `button-${variant} ${className}`
    : `button-${variant}`;

  return (
    <button
      className={`${classNameSum}`}
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

export default Button;