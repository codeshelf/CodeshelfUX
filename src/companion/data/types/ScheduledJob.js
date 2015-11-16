import {toProperties, createTypeRecord} from "./properties";
import DateTime from "./DateTime.js";

export function toLabel(property) {
    return property.toUpperCase();
}

export const types = [
    {value: "AccumulateDailyMetrics", label: "Accumulate Daily Metrics"},
    {value: "DatabasePurge", label: "Database Purge"},
    {value: "DatabaseSizeCheck", label: "Database Size Check"},
    {value: "EdiSizeCheck", label: "EDI Size Check"},
    {value: "EdiPurge", label: "EDI Purge"}
//    {value: "PutWallLightRefresher", label: "PutWall Light Refresher"},
//    {value: "EdiImport", label: "EdiImport"},
];
export const keyColumn = "type";
export const properties = toProperties([
    {id: 'type',
     title: 'Type'},
    {id: 'cronExpression',
     title: "Schedule"},
    {id: 'nextScheduled',
     title: "Next",
     type: DateTime},
    {id: 'running',
     title: 'Runnning',
     type: Boolean},
    {id: 'active',
     title: 'Active',
     type: Boolean}

]);

export const ScheduleJobRecord = createTypeRecord(properties);
