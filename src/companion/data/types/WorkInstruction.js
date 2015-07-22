import {fromJS, Record, Seq, Iterable} from "immutable";
import {PropertyRecord} from "./properties";


    export const keyColumn = "persistentId";
export const properties = fromJS([
    {'id':    'groupAndSortCode',
     'title': 'Sort'},
    {'id':    'assigned',
     'title': 'Assign'},
    {'id':    'completed',
     'title': 'Complete'},
    {'id':    'pickInstructionUi',
     'title': 'Where'},
    {'id':    'nominalLocationId',
     'title': 'Nominal Location'},
    {'id':    'wiPosAlongPath',
     'title': 'Meters Along Path'},
    {'id':    'description',
     'title': 'Description'},
    {'id':    'itemMasterId',
     'title': 'SKU'},
    {'id':    'planQuantity',
     'title': 'Quant.'},
    {'id':    'uomMasterId',
     'title': 'UOM'},
    {'id':    'orderId',
     'title': 'for Order'},
    {'id':    'orderDetailId',
     'title': 'for Order Detail'},
    {'id':    'containerId',
     'title': 'Container'},
    {'id':    'assignedCheName',
     'title': 'CHE'},
    {'id':    'domainId',
     'title': 'ID'},
    {'id':    keyColumn,
     'title': 'Persistent ID'},
    {'id':    'status',
     'title': 'Status'},
    {'id':    'planMinQuantity',
     'title': 'Min.'},
    {'id':    'planMaxQuantity',
     'title': 'Max.'},
    {'id':    'actualQuantity',
     'title': 'Actual'},
    {'id':    'litLedsForWi',
     'title': 'LEDs'},
    {'id': 'gtinId',
     'title': 'GTIN'},
    {'id': 'needsScan',
     'title': 'Needs Scan'}
], (key, value) => {
    if (Iterable.isKeyed(value)) {
        return PropertyRecord(value);
    } else {
        return value;
    }
});

export const WorkInstructionRecord = Record(Seq(properties).reduce((spec, metadata) => {
    spec[metadata.id] = null;
    return spec;
}, {}));
