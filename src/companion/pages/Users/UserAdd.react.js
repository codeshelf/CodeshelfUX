import {toUserModalForm, getFormMetadata} from "./UserForm.js";
import {createUser} from "data/csapi";
import {Map} from "immutable";
import _ from "lodash";

const fields = ["username", "roles"];
function addFormMetadata() {
  return _.filter(getFormMetadata(), (m) => fields.indexOf(m.name) >= 0);
}

const title = "New User";
const returnRoute = "/admin/users";

function handleSave(formMap: Map) {
    return createUser(formMap.toJS());
}
export default toUserModalForm(title, addFormMetadata, returnRoute, handleSave);
