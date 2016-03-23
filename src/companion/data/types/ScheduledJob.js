import {toProperties, createTypeRecord} from "./properties";
import DateTime from "./DateTime.js";

export function toLabel(property) {
    return property.toUpperCase();
}

export const types = [
    {value: "AccumulateDailyMetrics", label: "Accumulate Daily Metrics"},
    {value: "CheckActiveSiteControllerHealth", label: "Active Site Controllers Health Check"},
    {value: "CheckStandbySiteControllerHealth", label: "Standby Site Controllers Health Check"},
    {value: "DatabaseConnection", label: "Database Connection Check"},
    {value: "DatabasePurge", label: "Database Purge"},
    {value: "DatabaseSizeCheck", label: "Database Size Check"},
    {value: "DropboxCheck", label: "Dropbox Connection Check"},
    {value: "EdiHealthCheck", label: "EDI Health Check"},
    {value: "EdiSizeCheck", label: "EDI Size Check"},
    {value: "EdiPurge", label: "EDI Purge"},
    {value: "IsProductionServer", label: "Production Property Check"},
    {value: "PicksActivity", label: "Picks Activity Check"}
//    {value: "PutWallLightRefresher", label: "PutWall Light Refresher"},
//    {value: "EdiImport", label: "EdiImport"},
];
export const keyColumn = "type";
export const properties = toProperties([
    {id: 'type',
     title: 'Type'},
    {id: 'cronExpression',
     title: "Schedule"},
    {id: 'futureScheduled',
     title: "Next",
     type: DateTime}, //array TODO make an array<DateTime> style type
    {id: 'running',
     title: 'Runnning',
     type: Boolean},
    {id: 'active',
     title: 'Active',
             type: Boolean},
    {id: 'usingDefaults',
     title: 'Default',
     type: Boolean}
]);

export const ScheduleJobRecord = createTypeRecord(properties);
