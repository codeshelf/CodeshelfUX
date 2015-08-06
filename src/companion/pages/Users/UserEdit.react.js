import {toUserModalForm, formMetadata} from "./UserForm.js";
import _ from "lodash";

const fields = ["active", "roles"];

const metadata = _.filter(formMetadata, (m) => fields.indexOf(m.name) >= 0);
const title = "Edit User";
const returnRoute = "users";

export default toUserModalForm(title, metadata, returnRoute);
