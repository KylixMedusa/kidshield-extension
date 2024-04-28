import { ILogger } from '../../utils/Logger';
import { Store } from '../context/types';
import { PredictionRequest } from './baseTypes';

// eslint-disable-next-line no-shadow
export enum ChromeMessageType {
  TOGGLE_EXTENSION = 'TOGGLE_EXTENSION',

  PROCESS_REQUEST = 'PROCESS_REQUEST',

  PREDICTION_REQUEST = 'PREDICTION_REQUEST',
  PREDICTION_REQUEST_MODIFICATION = 'PREDICTION_REQUEST_MODIFICATION',
}

export type loadType = {
  logger: ILogger;
  store: Store;
};

export type ChromeMessage<T, U> = {
  type: T;
  payload: U;
};

export type ChromeRequest<T = PredictionRequest> = ChromeMessage<
  ChromeMessageType,
  T
>;
