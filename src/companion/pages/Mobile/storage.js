import * as orderDetail from './OrderDetail/store';
import * as workerDetail from './WorkerDetail/store';
import * as detailFactory from './Detail/storeFactory';


export const PERSIST_STATE_PART = [...orderDetail.PERSIST_STATE_PART, ...workerDetail.PERSIST_STATE_PART];

export const ACTIONS = [detailFactory.SETTING_PROPERTY_VISIBILITY, detailFactory.SETTING_PROPERTY_ORDER];

// If you change shape of anything in PERSIST_STATE_PART then increase this number
export const VERSION = 8;

export const STORAGE_KEY = 'codeshelfus-mobile-web';
export const STORAGE_KEY_VERSION = STORAGE_KEY + "-version";
