import { useAppSelector } from '@m-market-app/frontend-logic/admin/hooks';
import { useTranslation } from '@m-market-app/frontend-logic/shared/hooks';
import { AppContent, Header, NavItem, Notification, Container } from 'shared/components';
import { collapseExpanded } from '@m-market-app/frontend-logic/utils';
import { StaffSidebar } from 'shared/staffComponents';
import { Outlet } from 'react-router-dom';


export const AppLayout = () => {

  const user = useAppSelector(state => state.user);

  const { t } = useTranslation();

  const sidebarTNode = 'staffSidebar';

  if (!user.phonenumber) {
    return (
      <Container id='app-wrapper' onClick={() => collapseExpanded()} type='wrapper'>
        <Notification />
        <Header loginNecessary={true}/>
        <AppContent />
      </Container>
    );
  } else {
    return (
      <Container id='app-wrapper' onClick={() => collapseExpanded()} type='wrapper'>
        <Notification />
        <Header loginNecessary={true}/>
        <AppContent>
          <Outlet />
        </AppContent>
        <StaffSidebar>
          <NavItem path='/' label={t(`${sidebarTNode}.customerView`)}/>
          <NavItem path='/fixed-locs' label={t(`${sidebarTNode}.fixedLocs`)}/>
          <NavItem path='/ui-settings' label={t(`${sidebarTNode}.uiSettings`)}/>
          {/* <NavItem path='/' label='SECOND NAV YAY'/>
            <NavItem path='/' label='SECOND NAV YAY'/>
            <NavItem path='/' label='SECOND NAV YAY'/> */}
        </StaffSidebar>
      </Container>
    );
  }
};