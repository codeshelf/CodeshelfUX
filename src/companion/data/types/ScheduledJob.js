import {toProperties, createTypeRecord} from "./properties";
import DateTime from "./DateTime.js";
export const keyColumn = "type";
export const properties = toProperties([
    {id: 'type',
     title: 'Type'},
    {id: 'cronExpression',
            title: "Schedule"},
    {id: 'nextScheduled',
            title: "Next",
     type: DateTime}
]);

export const ScheduleJobRecord = createTypeRecord(properties);
