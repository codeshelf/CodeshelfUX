import {toProperties, createTypeRecord} from "./properties";

export const keyColumn = "id";
export const properties = toProperties([
    {'id': 'username',
    'title': 'Email'},
    {'id': "active",
    title: "Active"}
     ]);

export const UserRecord = createTypeRecord(properties);
