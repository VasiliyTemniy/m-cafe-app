import { apiBaseUrl } from "@m-cafe-app/shared-constants";
import { useEffect, useState } from "react";
import { Scrollable, SVGButton } from "../basic";
import { NavItem } from "../NavItem";

export const StaffSidebar = () => {

  const [sidebarPaddingTop, setSidebarPaddingTop] = useState(80);
  const [sidebarScrollableHeight, setSidebarScrollableHeight] = useState(0);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  useEffect(() => {
    const header = document.getElementById('app-header');
    const root = document.getElementById('root');
    if (header && root) {
      setSidebarPaddingTop(header.clientHeight);
      setSidebarScrollableHeight(root.clientHeight - header.clientHeight);
    }
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
      <Scrollable highlightScrollbarOnContentHover={false} wrapperHeight={sidebarScrollableHeight}>
        <ul>
          <NavItem path='/under-construction' label='FIRST NAV YAY'/>
          <NavItem path='/' label='SECOND NAV YAY'/>
          <NavItem path='/' label='SECOND NAV YAY'/>
          <NavItem path='/' label='SECOND NAV YAY'/>
          <NavItem path='/' label='SECOND NAV YAY'/>
          <NavItem path='/' label='SECOND NAV YAY'/>
        </ul>
      </Scrollable>
    </nav>
  );
};