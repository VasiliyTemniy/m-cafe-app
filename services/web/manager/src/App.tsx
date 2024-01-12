import { useAppSelector, useInitAppManager } from '@m-market-app/frontend-logic/manager/hooks';
import { AppRoutes } from './AppRoutes';
import { AppContent, Header, Loading, Container } from 'shared/components';
import { collapseExpanded } from '@m-market-app/frontend-logic/utils';
import { StaffSidebar } from 'shared/staffComponents';


export const App = () => {

  useInitAppManager();

  console.log('You actually see JS from manager module executed');

  const uiSettingsHash = useAppSelector(state => state.settings.parsedUiSettingsHash);
  const fixedLocsHash = useAppSelector(state => state.fixedLocs.parsedFixedLocsHash);
  const user = useAppSelector(state => state.user);

  if (!uiSettingsHash || !fixedLocsHash)
    return <Loading size='medium'/>;

  if (!user.phonenumber) {
    return (
      <>
        {/* <Notification/> */}
        <Container id='app-wrapper' onClick={() => collapseExpanded()} type='wrapper'>
          <Header loginNecessary={true}/>
          <AppContent />
        </Container>
      </>
    );
  } else {
    return (
      <>
        <Container id='app-wrapper' onClick={() => collapseExpanded()} type='wrapper'>
          <Header loginNecessary={true}/>
          <AppContent>
            {/* <Notification/> */}
            <AppRoutes/>
          </AppContent>
          <StaffSidebar>
            
          </StaffSidebar>
        </Container>
      </>
    );
  }
};