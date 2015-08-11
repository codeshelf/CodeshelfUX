import {toUserModalForm, formMetadata} from "./UserForm.js";
import {createUser} from "data/csapi";
import {Map} from "immutable";
import _ from "lodash";

const fields = ["username", "roles"];
const metadata = _.filter(formMetadata, (m) => fields.indexOf(m.name) >= 0);

const title = "New User";
const returnRoute = "users";

function handleSave(formMap: Map) {
    return createUser(formMap.toJS());
}
export default toUserModalForm(title, metadata, returnRoute, handleSave);
