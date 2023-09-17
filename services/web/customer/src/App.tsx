import { useInitAppCustomer } from '@m-cafe-app/frontend-logic/customer/hooks';
import { AppRoutes } from './AppRoutes';
import { AppContent, Wrapper, Header } from 'shared/components';
import { collapseExpanded } from '@m-cafe-app/frontend-logic/utils';


export const App = () => {

  useInitAppCustomer();

  console.log('You actually see JS from customer module executed');


  return (
    <>
      <Wrapper id='app-wrapper' onClick={() => collapseExpanded()}>
        <Header />
        <AppContent>
          {/* <Notification/> */}
          <AppRoutes/>
        </AppContent>
      </Wrapper>
    </>
  );
};