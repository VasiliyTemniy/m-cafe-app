import { Route, createBrowserRouter, createRoutesFromElements } from 'react-router-dom';
import { ErrorPage, UnderConstruction } from 'shared/components';
import { apiBaseUrl } from '@m-cafe-app/shared-constants';
import { AppLayout } from './AppLayout';
import { FixedLocsPage } from 'shared/staffComponents';


export const router = createBrowserRouter(
  createRoutesFromElements(
    <Route element={<AppLayout />} errorElement={<ErrorPage/>}>
      <Route index element={<div> Customer view will be here </div>} />
      <Route path="under-construction" element={<UnderConstruction svgUrl={`${apiBaseUrl}/public/pictures/svg/construction.svg`}/>} />
      <Route path="fixed-locs" element={<FixedLocsPage/>} />
      <Route path="ui-settings" element={<div> ui settings view </div>} />
    </Route>
  ),
  {
    basename: '/admin/'
  }
);