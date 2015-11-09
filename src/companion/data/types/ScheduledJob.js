import {toProperties, createTypeRecord} from "./properties";
export const keyColumn = "type";
export const properties = toProperties([
    {id: 'type',
     title: 'Type'},
    {id: 'schedule',
     title: "Schedule"}
]);

export const ScheduleJobRecord = createTypeRecord(properties);
