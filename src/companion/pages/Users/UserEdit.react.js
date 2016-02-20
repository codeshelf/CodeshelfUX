import {toUserModalForm, getFormMetadata} from "./UserForm.js";
import {updateUser} from "data/csapi";
import {Map} from "immutable";
import _ from "lodash";

const fields = ["id", "username", "active", "roles"];

function editFormMetadata() {
  return _.chain(getFormMetadata())
          .filter((m) => fields.indexOf(m.name) >= 0)
          .map((m) => {
            if (m.name == "username") {
              let editM = _.clone(m);
              editM.readOnly = "true";
              editM.required = false;
              return editM;
            } else {
              return m;
            }
          }).value();
}
const returnRoute = "/admin/users";

function handleSave(formMap: Map) {
    let user = formMap.toJS();
    let subFields = _.difference(fields, ["id", "username"]);
    let params = _.pick(user, subFields);
    params.roles = (params.roles.join) ? params.roles.join(",") : '';
    return updateUser(user.id, params);
}

function toSelectedUser(ComponentForm) {
    class SelectedUser extends React.Component {
        render() {
            let {userId} = this.props.params;
            let {users} = this.props;
            let user = new Map(users.find((u) => {
              return u.id == parseInt(userId);
            }));
            return <ComponentForm title={"Edit " + user.username} initialFormData={user} />;
        }
    }
    return SelectedUser;
}

export default toSelectedUser(toUserModalForm("Title should be specified as prop", editFormMetadata, returnRoute, handleSave));
