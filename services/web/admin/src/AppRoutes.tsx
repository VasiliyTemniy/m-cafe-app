import { Outlet, Route, Routes } from 'react-router-dom';

import { UnderConstruction } from 'shared/components';

import { apiBaseUrl } from '@m-cafe-app/shared-constants';
import { ColorTestPage } from 'shared/components/ColorTestPage';

export const AppRoutes = () => {
  return (
    <>
      <Outlet />
      <Routes>
        <Route path="/" element={<ColorTestPage/>} />
        <Route path="/under-construction" element={<UnderConstruction svgUrl={`${apiBaseUrl}/public/pictures/svg/construction.svg`}/>} />
      </Routes>
    </>
  );
};