import { useAppSelector } from '@m-cafe-app/frontend-logic/admin/hooks';
import { AppContent, Wrapper, Header } from 'shared/components';
import { collapseExpanded } from '@m-cafe-app/frontend-logic/utils';
import { StaffSidebar } from 'shared/staffComponents';
import { Outlet } from 'react-router-dom';


export const AppLayout = () => {

  const user = useAppSelector(state => state.user);

  if (!user.phonenumber) {
    return (
      <>
        {/* <Notification/> */}
        <Wrapper id='app-wrapper' onClick={() => collapseExpanded()}>
          <Header loginNecessary={true}/>
          <AppContent />
        </Wrapper>
      </>
    );
  } else {
    return (
      <>
        <Wrapper id='app-wrapper' onClick={() => collapseExpanded()}>
          <Header loginNecessary={true}/>
          <AppContent>
            {/* <Notification/> */}
            <Outlet />
          </AppContent>
          <StaffSidebar/>
        </Wrapper>
      </>
    );
  }
};