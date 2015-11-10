import {toProperties, createTypeRecord} from "./properties";
import DateTime from "./DateTime.js";

export const types = [
    {value: "AccumulateDailyMetrics", label: "Summarize previous day's completed work instructions."},
    {value: "DatabasePurge", label: "Purge old data."},
    {value: "DatabaseSizeCheck", label: "Gather total data size for health check."},
    {value: "EdiSizeCheck", label: "Check EDI directories for health check."},
    {value: "EdiPurge", label: "Clean old files out of EDI directories"},
    {value: "PutWallLightRefresher", label: "Periodically make sure putwall lights are current."},
    {value: "EdiImport", label: "Check each file-based importer for new files"},
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
     type: Boolean}
]);

export const ScheduleJobRecord = createTypeRecord(properties);
