import React from 'react';

import { createMemoryRouter } from 'react-router-dom';

import RequireAuth from './components/RequireAuth';
import Login from './containers/Login/Login';
import Preview from './containers/Preview/Preview';
import ROUTES from './types/routes';

const router = createMemoryRouter(
  [
    {
      path: ROUTES.HOME,
      element: <RequireAuth />,
      children: [
        {
          path: ROUTES.HOME,
          element: <Preview />,
        },
      ],
    },
    {
      path: ROUTES.LOGIN,
      element: <Login />,
    },
  ],
  {
    initialEntries: [ROUTES.HOME],
    initialIndex: 0,
  },
);

export default router;
