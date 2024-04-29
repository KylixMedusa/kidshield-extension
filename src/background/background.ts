import { createChromeStore } from '../popup/context/chrome-storage';
import {
  setFilterEffect,
  toggleExtension,
} from '../popup/context/reducers/settingsReducer';
import { RootState } from '../popup/context/types';
import {
  ChromeMessageType,
  ChromeRequest,
  loadType,
} from '../popup/types/background';
import { PredictionResponse } from '../popup/types/baseTypes';
import { Logger } from '../utils/Logger';
import { DEFAULT_TAB_ID, TabIdUrl } from './Queue/QueueBase';
import { QueueWrapper as Queue } from './Queue/QueueWrapper';

const _buildTabIdUrl = (tab: chrome.tabs.Tab): TabIdUrl => {
  const tabIdUrl = {
    tabId: tab?.id ? tab.id : DEFAULT_TAB_ID,
    tabUrl: tab?.url ? tab?.url : `${DEFAULT_TAB_ID}`,
  };

  return tabIdUrl;
};

const load = ({ logger, store }: loadType): void => {
  const queue = new Queue(logger, store);

  // Event when content sends request to toggle extension
  chrome.runtime.onMessageExternal.addListener(
    (request: ChromeRequest, sender, sendResponse) => {
      switch (request.type) {
        case ChromeMessageType.TOGGLE_EXTENSION:
          store.dispatch(toggleExtension(request.payload));
          break;
        case ChromeMessageType.CHANGE_FILTER_EFFECT:
          store.dispatch(setFilterEffect(request.payload));
          break;
        default:
          break;
      }

      return true; // https://stackoverflow.com/a/56483156
    },
  );

  // Event when content sends request to filter content
  chrome.runtime.onMessage.addListener(
    (
      request: ChromeRequest,
      sender,
      callback: (value: PredictionResponse) => void,
    ) => {
      switch (request.type) {
        case ChromeMessageType.LOG_WEB_SESSION:
          queue.logWebsiteSession(request.payload);
          break;
        case ChromeMessageType.PREDICTION_REQUEST:
          queue.analyze(
            request.payload,
            _buildTabIdUrl(sender.tab as chrome.tabs.Tab),
            callback,
          );
          break;
        case ChromeMessageType.PREDICTION_REQUEST_MODIFICATION:
          queue.analyzeModification(
            request.payload,
            _buildTabIdUrl(sender.tab as chrome.tabs.Tab),
            callback,
          );
          break;
        default:
          break;
      }

      return true; // https://stackoverflow.com/a/56483156
    },
  );

  // When user opened new tab
  chrome.tabs.onCreated.addListener(tab => {
    const tabIdUrl = _buildTabIdUrl(tab);
    queue.addTabIdUrl(tabIdUrl);
  });

  // When user closed tab
  chrome.tabs.onRemoved.addListener(tabId => {
    queue.clearByTabId(tabId);
  });

  // When user went to new url in same domain
  chrome.tabs.onUpdated.addListener((_tabId, changeInfo, tab) => {
    if (changeInfo.status === 'loading') {
      const tabIdUrl = _buildTabIdUrl(tab);
      queue.updateTabIdUrl(tabIdUrl);
    }
  });

  // When user selected tab as active
  chrome.tabs.onActivated.addListener(activeInfo => {
    queue.setActiveTabId(activeInfo.tabId);
  });

  // When user closed popup window
  chrome.runtime.onConnect.addListener(port =>
    port.onDisconnect.addListener(() => {
      const { logging } = store.getState().settings;

      if (logging) {
        logger.enable();
      } else {
        logger.disable();
      }

      queue.clearCache();
    }),
  );
};

const init = async (): Promise<void> => {
  const store = await createChromeStore();
  const { logging } = (store.getState() as RootState).settings;

  const logger = new Logger();
  if (logging === true) logger.enable();

  load({ logger, store });
};

init();
