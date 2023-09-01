import type { LabelLCProps } from "../scBasic";

export const LabelLC = ({
  htmlFor,
  children
}: LabelLCProps) => {

  return <label htmlFor={htmlFor}>{children}</label>;
};