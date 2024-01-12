import type { CommonProps } from '@m-market-app/frontend-logic/types';
// import { useCallback, useEffect, useRef, useState } from 'react';
// import { useInitLC } from '@m-market-app/frontend-logic/shared/hooks';
// import { debounceMouseEvent } from '@m-market-app/frontend-logic/utils';

interface TooltipProps extends CommonProps {
  text: string;
}

// REWORK!
export const Tooltip = ({
  text,
  // classNameAddon,
  // classNameOverride
}: TooltipProps) => {

  // const [tooltipVisible, setTooltipVisible] = useState(false);
  // const [isMouseOver, setIsMouseOver] = useState(false);
  // const tooltipRef = useRef<HTMLDivElement>(null);
  // console.log(isMouseOver);
  // const { className, style } = useInitLC({
  //   componentType: 'tooltip',
  //   componentName: 'tooltip',
  //   classNameAddon,
  //   classNameOverride,
  // });

  // const handleParentMouseEnter = useCallback((e: MouseEvent) => {
  //   if (!isMouseOver) {
  //     setIsMouseOver(true);
  //     console.log('crap');
  //     // debounceMouseEvent(() => setTooltipVisible(true), 3000)(e);
  //   }
  // }, []);

  // const handleParentMouseLeave = useCallback((e: MouseEvent) => {
  //   if (isMouseOver) {
  //     setIsMouseOver(false);
  //   }
  // }, [isMouseOver]);

  // useEffect(() => {
  //   const tooltip = tooltipRef.current;
  //   const parentElement = tooltipRef.current?.parentElement;
  //   if (tooltip && parentElement) {
  //     parentElement.addEventListener('mouseenter', handleParentMouseEnter);
  //     parentElement.addEventListener('mouseleave', handleParentMouseLeave);
  //   }
  //   return () => {
  //     if (parentElement) {
  //       parentElement?.removeEventListener('mouseenter', handleParentMouseEnter);
  //       parentElement?.removeEventListener('mouseleave', handleParentMouseLeave);
  //     }
  //   };
  // }, []);

  return (
    <div
      // style={{ ...style }}
      // ref={tooltipRef}
      // className={tooltipVisible
      //   ? `${className}`
      //   : `${className} invisible`}
    >
      {text}
    </div>
  );
};