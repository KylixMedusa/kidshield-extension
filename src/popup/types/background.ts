import { ILogger } from '../../utils/Logger';
import { Store } from '../context/types';
import { FilterEffect, PredictionRequest } from './baseTypes';

// eslint-disable-next-line no-shadow
export enum ChromeMessageType {
  TOGGLE_EXTENSION = 'TOGGLE_EXTENSION',
  CHANGE_FILTER_EFFECT = 'CHANGE_FILTER_EFFECT',

  PROCESS_REQUEST = 'PROCESS_REQUEST',

  PREDICTION_REQUEST = 'PREDICTION_REQUEST',
  PREDICTION_REQUEST_MODIFICATION = 'PREDICTION_REQUEST_MODIFICATION',

  LOG_WEB_SESSION = 'LOG_WEB_SESSION',
}

export type loadType = {
  logger: ILogger;
  store: Store;
};

export type ChromeMessage<T, U> = {
  type: T;
  payload: U;
};

export type LogSessionRequest = {
  url: string;
  metadata: {
    icon: string;
    title: string;
    description?: string | null;
  };
};

export type ChromeRequest =
  | ChromeMessage<ChromeMessageType.TOGGLE_EXTENSION, boolean>
  | ChromeMessage<ChromeMessageType.CHANGE_FILTER_EFFECT, FilterEffect>
  | ChromeMessage<
      | ChromeMessageType.PREDICTION_REQUEST
      | ChromeMessageType.PREDICTION_REQUEST_MODIFICATION,
      PredictionRequest
    >
  | ChromeMessage<ChromeMessageType.LOG_WEB_SESSION, LogSessionRequest>;
