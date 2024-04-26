import {
  PredictionRequest,
  PredictionResponse,
} from '../../popup/types/baseTypes';
import { QueueBase, TabIdUrl } from './QueueBase';

// @TODO Add tabs priority, when user opens 5 tabs at once(restore tabs) and go to 4th tab - we need to switch to images prediction of 4th tab immediately

type IQueueWrapper = {
  analyze: (
    request: PredictionRequest,
    tabId: TabIdUrl,
    callback: (value: PredictionResponse) => void,
  ) => Promise<void>;
  analyzeModification: (
    request: PredictionRequest,
    tabId: TabIdUrl,
    callback: (value: PredictionResponse) => void,
  ) => Promise<void>;
  clearByTabId: (tabId: number) => void;
  addTabIdUrl: (tabIdUrl: TabIdUrl) => void;
  updateTabIdUrl: (tabIdUrl: TabIdUrl) => void;
  setActiveTabId: (tabId: number) => void;
};

export class QueueWrapper extends QueueBase implements IQueueWrapper {
  public analyze = async (
    request: PredictionRequest,
    tabIdUrl: TabIdUrl,
    callback: (value: PredictionResponse) => void,
  ) => {
    const { tabId, tabUrl } = tabIdUrl;
    const cache = this.cache.get(tabUrl);
    if (this.cache.has(tabUrl) && cache) {
      callback(cache as PredictionResponse);
      return;
    }
    // send request to backend
    await this.sendRequest(tabId, tabUrl, request, callback);
  };

  public analyzeModification = async (
    request: PredictionRequest,
    tabIdUrl: TabIdUrl,
    callback: (value: PredictionResponse) => void,
  ) => {
    const { tabId, tabUrl } = tabIdUrl;
    await this.sendRequest(tabId, tabUrl, request, callback, true);
  };

  private sendRequest = async (
    tabId: number,
    url: string,
    request: PredictionRequest,
    callback: (value: PredictionResponse) => void,
    appendToCache = false,
  ) => {
    const resp = await fetch(
      'https://9wn4104g-9000.inc1.devtunnels.ms/filter-content',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
      },
    );
    const response: PredictionResponse = (await resp.json()).result;
    if (appendToCache) {
      const cache = this.cache.get(url);
      if (cache) {
        cache.modifications = [
          ...cache.modifications,
          ...response.modifications,
        ];
        cache.images = [...cache.images, ...response.images];
        this.cache.set(url, cache);
      } else {
        this.cache.set(url, response);
      }
    } else {
      this.cache.set(url, response);
    }
    callback(response);
  };

  public addTabIdUrl(tabIdUrl: TabIdUrl): void {
    const { tabId, tabUrl } = tabIdUrl;
    this.currentTabIdUrls.set(tabId, tabUrl);
  }

  public updateTabIdUrl(tabIdUrl: TabIdUrl): void {
    const { tabId, tabUrl } = tabIdUrl;
    this.currentTabIdUrls.set(tabId, tabUrl);
  }

  public clearByTabId(tabId: number): void {
    if (this.currentTabIdUrls.has(tabId)) {
      this.currentTabIdUrls.delete(tabId);
    }
  }

  public setActiveTabId(tabId: number): void {
    this.activeTabId = tabId;
  }
}
