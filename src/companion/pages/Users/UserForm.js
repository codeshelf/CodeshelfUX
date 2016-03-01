import React from "react";
import DocumentTitle from "react-document-title";
import ModalForm from "components/common/ModalForm";
import FormFields from "components/common/FormFields";
import {Map} from "immutable";
import {getEmail} from "data/user/store";
import _ from "lodash";


export function getFormMetadata() {
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
    }

    handleSave() {
      if (this.userId) {
        const userForm = this.props.formData;
        let promise = this.props.acEditUser(userForm, this.userId);
        return promise;
      } else {
        const userForm = this.props.formData;
        let promise = this.props.acAddUser(userForm);
        return promise;
      }
      
      // this was previoulsy in User.Edit, not sure what it does
      /*let subFields = _.difference(fields, ["id", "username"]);
      let params = _.pick(userForm, subFields);
      params.roles = (params.roles.join) ? params.roles.join(",") : '';*/
    }

    handleChange(field, value) {
        this.props.updateForm(field.name, value);
    }

    render() {
        const returnRoute = "/admin/users";
        const {formMetadata} = this.props;
        let {formData} = this.props;

        var user = undefined;
        if (Object.keys(this.props.params).length) {
          let {userId} = this.props.params;
          let {users} = this.props;
          user = new Map(users.find((u) => {
            return u.id == parseInt(userId);
          }));
          this.userId = userId;
          formData = user;
        }
        const title = (user !== undefined ? `Edit ${user.get('username')}` : "New user");

        return (<DocumentTitle title={title}>
                <ModalForm title={title} returnRoute={returnRoute}
                 onSave={() => this.handleSave()}
                 formData={formData}>

                <FormFields formMetadata={formMetadata()}
                 handleChange={this.handleChange}
                 formData={formData}/>
                </ModalForm>
                </DocumentTitle>
               );
    }
};
