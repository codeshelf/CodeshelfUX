import  React from "react";
import DocumentTitle from "react-document-title";
import ModalForm from "components/common/ModalForm";
import FormFields from "./FormFields";
import {Map} from "immutable";
import {createUser} from "data/csapi";
import _ from "lodash";

export default class UserAdd extends React.Component{

    constructor(props) {
        super(props);
        this.formMetadata = [
            {name: "username",
             label: "Email",
             required: true},
            {name: "roles",
             label: "Roles",
                 required: false}];
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
        return (<DocumentTitle title="New User">
                <ModalForm title="Add User" returnRoute="users"
                    onSave={_.partial(this.handleSave, formData)}
                    formData={formData}
                >
                        <FormFields formMetadata={this.formMetadata} formData={formData} handleChange={this.handleChange}/>
                </ModalForm>
                </DocumentTitle>
               );
    }
};
