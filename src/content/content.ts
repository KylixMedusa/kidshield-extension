import { createChromeStore } from '../popup/context/chrome-storage';
import { DOMWatcher } from './DOMWatcher/DOMWatcher';
import Loader from './loader';

const init = (): void => {
  Loader.createLoader();

  const domWatcher = new DOMWatcher();

  createChromeStore()
    .then(store => {
      const { websites } = store.getState().settings;
      if (!websites.includes(window.location.hostname)) {
        domWatcher.watch();
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
