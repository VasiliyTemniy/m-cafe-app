import type { CommonProps } from '@m-market-app/frontend-logic/types';
import { useInitLC } from '@m-market-app/frontend-logic/shared/hooks';
  
interface TextCompProps extends CommonProps {
  text?: string;
  children?: JSX.Element[] | JSX.Element;
  htmlEl?: 'div' | 'span' | 'p' | 'h1' | 'h2' | 'h3' | 'h4';
}

export const TextComp = ({
  classNameOverride,
  classNameAddon,
  id,
  text,
  children,
  htmlEl = 'div'
}: TextCompProps) => {

  const { className, style } = useInitLC({
    componentType: 'text',
    componentName: 'text',
    classNameAddon,
    classNameOverride,
  });

  if (!text) return null;

  switch (htmlEl) {
    case 'div':
      return (
        <div
          className={className}
          id={id}
          style={style}
        >
          {text}
          {children}
        </div>
      );
    case 'span':
      return (
        <span
          className={className}
          id={id}
          style={style}
        >
          {text}
          {children}
        </span>
      );
    case 'p':
      return (
        <p
          className={className}
          id={id}
          style={style}
        >
          {text}
          {children}
        </p>
      );
    case 'h1':
      return (
        <h1
          className={className}
          id={id}
          style={style}
        >
          {text}
          {children}
        </h1>
      );
    case 'h2':
      return (
        <h2
          className={className}
          id={id}
          style={style}
        >
          {text}
          {children}
        </h2>
      );
    case 'h3':
      return (
        <h3
          className={`${className} w100`}
          id={id}
          style={style}
        >
          {text}
          {children}
        </h3>
      );
    case 'h4':
      return (
        <h4
          className={className}
          id={id}
          style={style}
        >
          {text}
          {children}
        </h4>
      );
  }
};