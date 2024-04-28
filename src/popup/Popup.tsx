import React from 'react';

import { RouterProvider } from 'react-router-dom';

import router from './Router';

const Popup: React.FC = () => {
  return (
    <div className="popup">
      <RouterProvider router={router} />
    </div>
  );
};

export default Popup;
