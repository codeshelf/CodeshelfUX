import  React from "react";
import DocumentTitle from "react-document-title";
import ModalForm from "components/common/ModalForm";
import FormFields from "components/common/FormFields";
import {Map} from "immutable";
import {getEmail} from "data/user/store";
import _ from "lodash";

export class UserForm extends React.Component{

    constructor(props) {
        super(props);
        this.handleChange = this.handleChange.bind(this);
    }

    handleChange(field, value) {
        this.props.acUpdateAddUserForm(field.name, value);
    }

    handleSave() {
        const addUserForm = this.props.formData;
        let promise = this.props.acAddUser(addUserForm);
        return promise;
    }

    getFormMetadata() {
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

    addFormMetadata() {
      const fields = ["username", "roles"];
      return _.filter(this.getFormMetadata(), (m) => fields.indexOf(m.name) >= 0);
    }

    render() {
        const {formData} = this.props;
        const title = "New User";
        const returnRoute = "/admin/users";

        return (<DocumentTitle title={title}>
                <ModalForm title={title} returnRoute={returnRoute}
                 onSave={() => this.handleSave()}
                 formData={formData}>

                <FormFields formMetadata={this.addFormMetadata()}
                 handleChange={this.handleChange}
                 formData={formData}/>
                </ModalForm>
                </DocumentTitle>
               );
    }
};
