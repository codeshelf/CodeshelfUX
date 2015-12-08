import * as orderDetail from './OrderDetail/store';

export const PERSIST_STATE_PART = [...orderDetail.PERSIST_STATE_PART];

export const ACTIONS = [orderDetail.SETTING_PROPERTY_VISIBILITY, orderDetail.SETTING_PROPERTY_ORDER];

// If you change shape of anything in PERSIST_STATE_PART then increase this number
export const VERSION = 4;

export const STORAGE_KEY = 'codeshelfus-mobile-web';
export const STORAGE_KEY_VERSION = STORAGE_KEY + "-version";