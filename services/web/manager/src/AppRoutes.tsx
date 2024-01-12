import { Outlet, Route, Routes } from 'react-router-dom';

import { UnderConstruction } from 'shared/components';

import { apiBaseUrl } from '@m-market-app/shared-constants';

export const AppRoutes = () => {
  return (
    <>
      <Outlet />
      <Routes>
        <Route path="/" element={<UnderConstruction svgUrl={`${apiBaseUrl}/public/pictures/svg/construction.svg`}/>} />
        <Route path="/under-construction" element={<UnderConstruction svgUrl={`${apiBaseUrl}/public/pictures/svg/construction.svg`}/>} />
      </Routes>
    </>
  );
};