import { ExtendedStore } from 'reduxed-chrome-storage';
import { ILogger } from 'utils/Logger';

import { PredictionRequest } from './baseTypes';

// eslint-disable-next-line no-shadow
export enum ChromeMessageType {
  SIGN_CONNECT = 'SIGN_CONNECT',

  PROCESS_REQUEST = 'PROCESS_REQUEST',

  PREDICTION_REQUEST = 'PREDICTION_REQUEST',
  PREDICTION_REQUEST_MODIFICATION = 'PREDICTION_REQUEST_MODIFICATION',
}

export type loadType = {
  logger: ILogger;
  store: ExtendedStore;
};

export type ChromeMessage<T, U> = {
  type: T;
  payload: U;
};

export type ChromeRequest = ChromeMessage<ChromeMessageType, PredictionRequest>;
