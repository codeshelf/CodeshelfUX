import React from "react";
import DocumentTitle from "react-document-title";
import ModalForm from "components/common/ModalForm";
import FormFields from "components/common/FormFields";
import {Map, List, fromJS} from "immutable";
import {getEmail} from "data/user/store";
import {UserRecord} from "data/types/User";
import _ from "lodash";

const editFormMetadata = () => {
  const fields = ["id", "username", "active", "roles"];
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

const addFormMetadata = () => {
    const fields = ["username", "roles"];
    return _.filter(getFormMetadata(), (m) => fields.indexOf(m.name) >= 0);
}

const getFormMetadata = () => {
    const commonRoles = [{value: "Admin", label: "Admin"},
                 {value: "Upload", label: "Upload"},
                 {value: "View", label: "View"},
                 {value: "Supervise", label: "Supervise"},
                 {value: "Dashboard", label: "Dashboard"},
    ];
    const csRoles = [{value: "CsDeveloper", label: "CsDeveloper"},
                     {value: "CsSupport", label: "CsSupport"}];
    let roles = commonRoles;

    if (getEmail() && getEmail().indexOf("@codeshelf.com") > 0) {
      roles = commonRoles.concat(csRoles);
    }

    return [
      {name: "id",
       label: "ID",
       hidden: true},
      {name: "username",
       label: "Email",
       required: true},
      {name: "active",
       label: "Active",
       type: Boolean,
       required: true},
      {name: "roles",
       label: "Roles",
       options:roles,
       type: Array,
       required: false}
    ];
}


export class UserForm extends React.Component{

    constructor(props) {
        super(props);
        this.handleChange = this.handleChange.bind(this);
        this.returnRoute = "/admin/users";
        this.formMetadata = null;
        this.title = null;
    }

    handleSave() {
      const userForm = this.props.formData;
      if (userForm.get('id')) {
        return this.props.acEditUser(userForm)
      } else {
        return this.props.acAddUser(userForm);
      }
    }

    handleChange(field, value) {
        this.props.updateForm(field.name, value);
    }

    componentWillReceiveProps(newProps) {
      this.findSelectedUserData(newProps);
    }

    componentWillMount() {
      this.findSelectedUserData(this.props);
    }

    findSelectedUserData(props) {
      const path = props.location.pathname;
      let userId = null;
      if (path.indexOf("new") >= 0) {
          userId = "new";
      } else {
          userId = props.params.userId;
      }

      let userForm = this.props.formData;
      if (!userForm) {
        if (userId === "new") {
          userForm = UserRecord();
          userForm = userForm.set('roles', []);
          this.formMetadata = addFormMetadata;
          this.title = "New user";
          props.acStoreSelectedUserForm(userForm);
        } else {
          userForm = props.users.find((u) => {
            return u.id === parseInt(userId);
          });
          this.formMetadata = editFormMetadata;
          this.title = `Edit ${userForm.username}`; 
          props.acStoreSelectedUserForm(Map(userForm));
        }
      }
    }

    componentWillUnmount() {
      this.props.acStoreSelectedUserForm(null);
    }

    render() {
      const {formData, error, acUnsetError} = this.props;

      return (<DocumentTitle title={this.title}>
              <ModalForm title={this.title} 
                         returnRoute={this.returnRoute}
                         onSave={() => this.handleSave()}
                         formData={formData}
                         acUnsetError={acUnsetError}
                         actionError={error}>

              <FormFields formMetadata={this.formMetadata()}
               handleChange={this.handleChange}
               formData={formData}/>
              </ModalForm>
              </DocumentTitle>
             );
    }
};
