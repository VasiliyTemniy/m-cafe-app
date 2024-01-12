import { apiBaseUrl } from '@m-market-app/shared-constants';
import { useEffect, useRef, useState } from 'react';
import { Scrollable, SVGButton } from '../../components';

interface StaffSidebarProps {
  children: JSX.Element | JSX.Element[];
}

export const StaffSidebar = ({
  children
}: StaffSidebarProps) => {

  const observer = useRef<ResizeObserver | null>(null);
  const [sidebarPaddingTop, setSidebarPaddingTop] = useState(80);
  const [sidebarScrollableHeight, setSidebarScrollableHeight] = useState(0);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const handleResize = (header: HTMLElement, root: HTMLElement) => {
    setSidebarPaddingTop(header.clientHeight);
    setSidebarScrollableHeight(root.clientHeight - header.clientHeight);
  };

  useEffect(() => {
    const header = document.getElementById('app-header');
    const root = document.getElementById('root');
    if (!header || !root) return;
    observer.current = new ResizeObserver(() => {
      handleResize(header, root);
    });
    observer.current.observe(root);
    return () => {
      observer.current?.unobserve(root);
    };
  }, []);

  const handleToggleSidebar = () => {
    setSidebarCollapsed(prev => !prev);
  };

  return (
    <nav
      className={`glass${sidebarCollapsed ? ' collapsed' : ''}`}
      id='staff-sidebar'
      style={{ paddingTop: `${sidebarPaddingTop}px` }}
    >
      <SVGButton
        id='staff-sidebar-toggler'
        svgUrl={`${apiBaseUrl}/public/pictures/svg/arrow.svg`}
        onClick={handleToggleSidebar} altText=''
        classNameAddon='glass'
      />
      <Scrollable highlightScrollbarOnContentHover={false} wrapperStyle={{ height: `${sidebarScrollableHeight}px` }}>
        <ul>
          {children}
        </ul>
      </Scrollable>
    </nav>
  );
};