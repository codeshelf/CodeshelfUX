import {toProperties, createTypeRecord} from "./properties";
import DateTime from "./DateTime.js";
export const keyColumn = "date";

export const properties = toProperties([
    {'id': 'date', title: 'Date', type: DateTime},
    {'id': 'ordersPicked', 'title': 'Orders Picked'},
    {'id': 'linesPicked', 'title': 'Lines Picked'},
    {'id': 'linesPickedEach', 'title': 'Lines Picked Each'},
    {'id': 'linesPickedCase', 'title': 'Lines Picked Case'},
    {'id': 'linesPickedOther', 'title': 'Lines Picked Other'},
    {'id': 'countPicked', 'title': 'Count Picked'},
    {'id': 'countPickedEach', 'title': 'Count Picked Each'},
    {'id': 'countPickedCase', 'title': 'Count Picked Case'},
    {'id': 'countPickedOther', 'title': 'Count Picked Other'},
    {'id': 'houseKeeping', 'title': 'Housekeeping'},
    {'id': 'putWallPuts', 'title': 'Putwall Puts'},
    {'id': 'skuWallPuts', 'title': 'Skuwall Puts'},
    {'id': 'palletizerPuts', 'title': 'Palletizer Puts'},
    {'id': 'replenishPuts', 'title': 'Replenish Puts'},
    {'id': 'skipScanEvents', 'title': 'Skipscan Event'},
    {'id': 'shortEvents', 'title': 'Short Event'}
]);

export const DailyMetricRecord = createTypeRecord(properties);
