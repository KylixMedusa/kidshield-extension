import './index.scss';

import React from 'react';

import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';

import { createChromeStore } from './context/chrome-storage';
import Popup from './Popup';

chrome.tabs.query({ active: true, currentWindow: true }, _tab => {
  (async () => {
    chrome.runtime.connect();
    const store = await createChromeStore();

    createRoot(document.getElementById('popup')!).render(
      <Provider store={store}>
        <Popup />
      </Provider>,
    );
  })();
});

// createRoot(document.getElementById("root")!).render(
//   <Provider store={store}>
//     <Popup />
//   </Provider>
// );
