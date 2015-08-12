import {toUserModalForm, formMetadata} from "./UserForm.js";
import {updateUser} from "data/csapi";
import {Map} from "immutable";
import _ from "lodash";

const fields = ["id", "username", "active", "roles"];

const metadata = _.chain(formMetadata)
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

const returnRoute = "users";

function handleSave(formMap: Map) {
    let user = formMap.toJS();
    let subFields = _.difference(fields, ["id", "username"]);
    return updateUser(user.id, _.pick(user, subFields));
}

function toSelectedUser(ComponentForm) {
    class SelectedUser extends React.Component {
        render() {
            let {userId} = this.props.params;
            let {users} = this.props;
            let user = users.find((u) => {
                    return u.get("id") == parseInt(userId);
                });
            return <ComponentForm title={"Edit " + user.get("username")} initialFormData={user} />;
        }
    }
    return SelectedUser;
}

export default toSelectedUser(toUserModalForm("Title should be specified as prop", metadata, returnRoute, handleSave));
