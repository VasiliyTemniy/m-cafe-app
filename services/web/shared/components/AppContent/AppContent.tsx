import { useEffect, useRef, useState } from 'react';
import { Scrollable } from '../basic';

interface AppContentProps {
  children?: JSX.Element[] | JSX.Element;
}

export const AppContent = ({
  children
}: AppContentProps) => {

  const observer = useRef<ResizeObserver | null>(null);
  const [appContentHeight, setAppContentHeight] = useState(0);

  const handleResize = (headerHeight: number) => {
    setAppContentHeight(document.body.clientHeight - headerHeight);
  };

  useEffect(() => {
    const header = document.getElementById('app-header');
    const headerHeight = header ? header.clientHeight : 0;
    observer.current = new ResizeObserver(() => {
      handleResize(headerHeight);
    });
    observer.current.observe(document.body);
    return () => {
      observer.current?.unobserve(document.body);
    };
  }, []);

  return (
    <Scrollable
      wrapperClassNameAddon='app-content-wrapper'
      id='app-content'
      highlightScrollbarOnContentHover={false}
      wrapperStyle={{ height: `${appContentHeight}px` }}
    >
      {children}
    </Scrollable>
  );
};