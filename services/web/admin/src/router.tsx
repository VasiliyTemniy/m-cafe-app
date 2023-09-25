import { Route, createBrowserRouter, createRoutesFromElements } from 'react-router-dom';
import { UnderConstruction } from 'shared/components';
import { apiBaseUrl } from '@m-cafe-app/shared-constants';
import { AppLayout } from './AppLayout';


export const router = createBrowserRouter(
  createRoutesFromElements(
    <Route element={<AppLayout />}>
      <Route index element={<div> Fuck dis sheet </div>} />
      <Route path="under-construction" element={<UnderConstruction svgUrl={`${apiBaseUrl}/public/pictures/svg/construction.svg`}/>} />
    </Route>
  ),
  {
    basename: '/admin/'
  }
);