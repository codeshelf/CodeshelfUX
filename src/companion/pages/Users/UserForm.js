import  React from "react";
import DocumentTitle from "react-document-title";
import ModalForm from "components/common/ModalForm";
import FormFields from "components/common/FormFields";
import {Map} from "immutable";
import _ from "lodash";
import {getEmail} from "data/user/store";


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

export function toUserModalForm(defaultTitle, formMetadataFn, returnRoute, handleSave) {

    class UserForm extends React.Component{

        constructor(props) {
            super(props);
            this.handleChange = this.handleChange.bind(this);
            this.state = {formData: this.props.initialFormData || Map()};
        }

        handleChange(field, value) {
            let newFormData = this.state.formData.set(field.name, value);
            this.setState({formData: newFormData});
        }

        render() {
            let {formData} = this.state;
            let {title = defaultTitle} = this.props;
            return (<DocumentTitle title={title}>
                    <ModalForm title={title} returnRoute={returnRoute}
                     onSave={_.partial(handleSave, formData)}
                     formData={formData}>

                    <FormFields formMetadata={formMetadataFn()}
                     formData={formData}
                     handleChange={this.handleChange}/>
                    </ModalForm>
                    </DocumentTitle>
                   );
        }
    };
    return UserForm;
}
