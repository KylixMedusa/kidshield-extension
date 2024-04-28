import React from 'react';

import { Navigate, Outlet, useLocation } from 'react-router-dom';

import { useAppSelector } from '../hooks/context';
import ROUTES from '../types/routes';

const RequireAuth: React.FC = () => {
  const { isLoggedIn } = useAppSelector(state => state.app);
  const location = useLocation();

  if (!isLoggedIn) {
    // Redirect to the /login page, but save the current location they were trying to go to
    return <Navigate to={ROUTES.LOGIN} state={{ from: location }} replace />;
  }

  return <Outlet />;
};

export default RequireAuth;
