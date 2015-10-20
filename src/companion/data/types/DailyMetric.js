import {toProperties, createTypeRecord} from "./properties";
import DateTime from "./DateTime.js";
export const keyColumn = "date";

export const properties = toProperties([
    {'id': 'date', title: 'Date', type: DateTime},
    {'id': 'ordersPicked', 'title': 'Orders Picked'},
    {'id': 'linesPickedEach', 'title': 'Lines Picked Each'},
    {'id': 'linesPickedCase', 'title': 'Lines Picked Case'},
    {'id': 'linesPickedOther', 'title': 'Lines Picked Other'},
    {'id': 'countPickedEach', 'title': 'Count Picked Each'},
    {'id': 'countPickedCase', 'title': 'Count Picked Case'},
    {'id': 'countPickedOther', 'title': 'Count Picked Other'},
    {'id': 'houseKeeping', 'title': 'Housekeeping'},
    {'id': 'putWallPut', 'title': 'Putwall Put'},
    {'id': 'skuWallPut', 'title': 'Skuwall Put'},
    {'id': 'palletizerPut', 'title': 'Palletizer Put'},
    {'id': 'replenishPut', 'title': 'Replenish Put'},
    {'id': 'skipScanEvent', 'title': 'Skipscan Event'},
    {'id': 'shortEvent', 'title': 'Short Event'}
]);

export const DailyMetricRecord = createTypeRecord(properties);
