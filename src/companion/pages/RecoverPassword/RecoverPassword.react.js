import  React from "react";
import DocumentTitle from "react-document-title";
import {FormPageLayout, Row, Col} from 'components/common/pagelayout';
import FormFields from "components/common/FormFields";
import {Form, SubmitButton} from "components/common/Form";
import {recoverPassword} from 'data/csapi';
import {Map} from "immutable";
import exposeRouter from 'components/common/exposerouter';

const formMetadata = [
    {name: "username",
    label: "Email"}
];
const title = "Forgot Password";

export default class RecoverPassword extends React.Component{

    constructor(props) {
        super(props);
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.state = {
            formData: Map()
        }
    }

    handleChange(field, value) {
        let newFormData = this.state.formData.set(field.name, value);
        this.setState({formData: newFormData});
    }

    handleSubmit(e) {
        e.preventDefault();
        return recoverPassword(this.state.formData.get("username"))
            .then(() => {
                this.props.router.transitionTo("recoversuccess");
            });
    }

    render() {
        let {formData} = this.state;
        return (<FormPageLayout title={title}>
                    <Form id="recoverpassword-form" className="p-t-15" role="form" onSubmit={this.handleSubmit}>
                        <FormFields ref="fields" formMetadata={formMetadata} formData={formData} handleChange={this.handleChange}/>
                        <SubmitButton label={title} />
                    </Form>
        </FormPageLayout>
    );
    }
};
export default exposeRouter(RecoverPassword);
