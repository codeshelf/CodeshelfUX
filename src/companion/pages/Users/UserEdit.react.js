import {toUserModalForm, formMetadata} from "./UserForm.js";
import {updateUser} from "data/csapi";
import {Map} from "immutable";
import _ from "lodash";

const fields = ["active", "roles"];

const metadata = _.filter(formMetadata, (m) => fields.indexOf(m.name) >= 0);
const title = "Edit User";
const returnRoute = "users";

function handleSave(formMap: Map) {
    let user = formMap.toJS();
    return updateUser(user.id, user);
}
export default toUserModalForm(title, metadata, returnRoute, handleSave);
