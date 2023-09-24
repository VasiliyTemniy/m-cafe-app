import type { MouseEventHandler } from 'react';
import type { CommonProps } from '@m-cafe-app/frontend-logic/types';
import { useInitLC } from '@m-cafe-app/frontend-logic/shared/hooks';

interface SVGButtonProps extends CommonProps {
  svgUrl: string;
  altText: string;
  onClick?: MouseEventHandler;
}

export const SVGButton = ({
  classNameOverride,
  classNameAddon,
  id,
  svgUrl,
  altText,
  onClick
}: SVGButtonProps) => {

  const { className, style } = useInitLC({
    componentType: 'svg-button',
    componentName: 'svg-button',
    classNameAddon,
    classNameOverride
  });

  return (
    <div className={className} id={id} style={style} onClick={onClick}>
      <img className='svg' src={svgUrl} alt={altText} />
    </div>
  );
};