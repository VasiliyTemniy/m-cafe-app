import type { CommonProps } from '@m-cafe-app/frontend-logic/types';
import type { ChangeEventHandler, FocusEventHandler } from 'react';

export interface InputLCProps extends CommonProps {
  placeholder?: string;
  name: string;
  value: string;
  onChange: ChangeEventHandler<HTMLInputElement>;
  onBlur: FocusEventHandler<HTMLInputElement>;
  errorMessage?: string;
  disabled?: boolean;
  type?: string;
  autoComplete?: string;
  autoCorrect?: string;
  autoCapitalize?: string;
  spellCheck?: 'true' | 'false';
  step?: number;
}

export interface TextAreaLCProps extends CommonProps {
  placeholder?: string;
  name: string;
  value: string;
  onChange: ChangeEventHandler<HTMLTextAreaElement>;
  onBlur: FocusEventHandler<HTMLTextAreaElement>;
  errorMessage?: string;
  disabled?: boolean;
  maxrows: number;
}