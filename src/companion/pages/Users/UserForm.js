import React from "react";
import DocumentTitle from "react-document-title";
import ModalForm from "components/common/ModalForm";
import FormFields from "components/common/FormFields";
import {Map, List} from "immutable";
import {getEmail} from "data/user/store";
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
        this.first = true;
    }

    handleSave(userId) {
      const userForm = this.props.formData;
      if (userId) {
        return this.props.acEditUser(userForm, userId)
      } else {
        return this.props.acAddUser(userForm);
      }
    }

    handleChange(field, value) {
        this.props.updateForm(field.name, value);
    }

    componentWillMount() {
    }

    render() {
      const {users, params:{userId}} = this.props;
      let {formData} = this.props;

      const user = users.find((u) => {
          return u.id == userId;
      });

      formData = userId ? user : formData;
      const title = user ?  `Edit ${user.username}` : "New user";

      if (this.first && userId) {
        this.props.updateForm('active', true);
        this.props.updateForm('username', user.username);
        this.props.updateForm('roles', user.roles);
        this.first = false;
      }
      const formMetadata = user ? editFormMetadata : addFormMetadata;

        return (<DocumentTitle title={title}>
                <ModalForm title={title} returnRoute={this.returnRoute}
                 onSave={() => this.handleSave(userId)}
                 formData={formData}>

                <FormFields formMetadata={formMetadata()}
                 handleChange={this.handleChange}
                 formData={formData}/>
                </ModalForm>
                </DocumentTitle>
               );
    }
};
