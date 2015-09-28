import {toProperties, createTypeRecord} from "./properties";
export const keyColumn = "domainId";
export const properties = toProperties([
    {id: 'domainId',
     title: 'ID'},
    {id: "serviceState",
     title: "State"},
    {id: "provider",
     title: "Provider"},
    {id: "hasCredentials",
            title: "Has Creds"},
    {id: "active",
     title: "Active"}

]);

export const UserRecord = createTypeRecord(properties);
