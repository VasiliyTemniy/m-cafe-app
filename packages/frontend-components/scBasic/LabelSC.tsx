import type { CommonLCProps, CommonSCProps } from '@m-cafe-app/frontend-logic/types';
import { LabelLC } from "../lcWeb";

interface LabelProps {
  htmlFor?: string;
  children: string;
}

interface LabelSCProps extends LabelProps, CommonSCProps {
}

export interface LabelLCProps extends LabelProps, CommonLCProps {
}

export const LabelSC = ({
  htmlFor,
  children
}: LabelSCProps) => {

  return (
    <LabelLC htmlFor={htmlFor}>{children}</LabelLC>
  );
};