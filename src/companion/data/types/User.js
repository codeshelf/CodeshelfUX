import {toProperties, createTypeRecord} from "./properties";
import DateTime from "./DateTime.js";
export const keyColumn = "id";
export const properties = toProperties([
    {'id': 'username',
    'title': 'Email'},
    {'id': "active",
     title: "Active"},
     {'id': "roles",
    title: "Roles"},
    {'id': "lastAuthenticated",
     title: "Last Login",
     type: DateTime}
     ]);

export const UserRecord = createTypeRecord(properties);
