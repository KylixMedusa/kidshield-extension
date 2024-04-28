import { createChromeStore } from '../popup/context/chrome-storage';
import { DOMWatcher } from './DOMWatcher/DOMWatcher';
import Loader from './loader';

const init = (): void => {
  createChromeStore()
    .then(store => {
      const {
        settings: { websites },
        app: { isExtensionOn },
      } = store.getState();
      if (!websites.includes(window.location.hostname)) {
        if (isExtensionOn) {
          Loader.createLoader();
          const domWatcher = new DOMWatcher();

          // TODO: Enable watch again after optimizing the API
          // domWatcher.watch();
        }
      }
    })
    .catch(error => {
      console.warn(error);
      //   imageFilter.setSettings({ filterEffect: 'blur' });
    });
};

// Ignore iframes, https://stackoverflow.com/a/326076/10432429
if (window.self === window.top) {
  init();
}
