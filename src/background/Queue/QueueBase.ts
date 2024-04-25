import { PredictionResponse } from 'popup/types/baseTypes';

import { ILogger } from '../../utils/Logger';
import { LRUCache } from '../LRUCache';

export type CallbackFunction = (
  err: unknown | undefined,
  result: unknown | undefined,
) => undefined;

type KeyType<T, K extends keyof T> = T[K];
export type TabIdUrl = { tabId: number; tabUrl: string };
export const DEFAULT_TAB_ID = 999999;

export class QueueBase {
  protected readonly logger: ILogger;

  protected readonly currentTabIdUrls: Map<
    KeyType<TabIdUrl, 'tabId'>,
    KeyType<TabIdUrl, 'tabUrl'>
  >;

  protected activeTabId: KeyType<TabIdUrl, 'tabId'>;

  protected readonly requestMap: Map<number, unknown>;

  protected readonly DEFAULT_TAB_ID: number;

  protected readonly cache: LRUCache<string, PredictionResponse>;

  constructor(logger: ILogger) {
    this.logger = logger;

    this.requestMap = new Map();
    this.DEFAULT_TAB_ID = DEFAULT_TAB_ID;
    this.activeTabId = this.DEFAULT_TAB_ID;
    this.currentTabIdUrls = new Map([
      [this.DEFAULT_TAB_ID, `${this.DEFAULT_TAB_ID}`],
    ]);
    this.cache = new LRUCache(1000);
  }

  public clearCache(): void {
    this.cache.clear();
  }

  public debounce = <T extends unknown[]>(
    func: (...args: T) => Promise<void>,
    wait: number,
  ) => {
    return (identifier: number, ...args: T) => {
      clearTimeout(this.requestMap.get(identifier) as number);
      this.requestMap.set(
        identifier,
        setTimeout(() => {
          func(...args);
        }, wait),
      );
    };
  };

  protected _checkCurrentTabIdUrlStatus({
    tabId,
    tabUrl,
  }: {
    tabId: number;
    tabUrl: string;
  }): boolean {
    if (!this.currentTabIdUrls.has(tabId)) {
      return false; // user closed this tab id
    }
    if (
      this.currentTabIdUrls.has(tabId) &&
      tabUrl !== this.currentTabIdUrls.get(tabId)
    ) {
      return false; // user's tab id matches current tab id, but url references to an another page
    }
    return true;
  }
}
