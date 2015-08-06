import  React from "react";
import DocumentTitle from "react-document-title";
import ModalForm from "components/common/ModalForm";
import FormFields from "components/common/FormFields";
import {Map} from "immutable";
import {createUser} from "data/csapi";
import _ from "lodash";

export const formMetadata = [
    {name: "username",
     label: "Email",
     required: true},
    {name: "active",
     label: "Active",
     type: Boolean,
     required: true},
    {name: "roles",
     label: "Roles",
     options:[{name: "Admin", label: "Admin"},
              {name: "Companion", label: "Companion"},
             ],
     type: Array,
     required: false}
];

export function toUserModalForm(title, formMetadata, returnRoute) {
    class UserForm extends React.Component{

        constructor(props) {
            super(props);
            this.handleSave = this.handleSave.bind(this);
            this.handleChange = this.handleChange.bind(this);
            this.state = {formData: Map()};
        }

        handleChange(field, value) {
            let newFormData = this.state.formData.set(field.name, value);
            this.setState({formData: newFormData});
        }

        handleSave(formData) {
            return createUser(formData.toJS());
        }

        render() {
            let {formData} = this.state;
            return (<DocumentTitle title={title}>
                    <ModalForm title={title} returnRoute={returnRoute}
                     onSave={_.partial(this.handleSave, formData)}
                     formData={formData}>

                    <FormFields formMetadata={formMetadata}
                     formData={formData}
                     handleChange={this.handleChange}/>
                    </ModalForm>
                    </DocumentTitle>
                   );
        }
    };
    return UserForm;
}
