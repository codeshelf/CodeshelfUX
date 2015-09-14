import React from "react";
import {SingleCellIBox, IBoxSection} from 'components/common/IBox';
import {Form, SubmitButton, SuccessDisplay, ErrorDisplay, Input} from 'components/common/Form';

export default class UploadForm extends React.Component{

    constructor(props) {
        super(props);
        this.state = {errorMessage: null};
    }

    handleSubmit(e) {
        e.preventDefault();
        var input = React.findDOMNode(this.refs.fileInput);
        let file = input.getElementsByTagName("input")[0].files[0];
        this.setState({errorMessage: null});
        this.setState({successMessage: null});
        return this.props.onImportSubmit(file).then(((data) => {
                this.setState({errorMessage: null});
            this.setState({successMessage: "File Imported"});
            return data;
        }), (e) => {
                this.setState({errorMessage: e.message});
                this.setState({successMessage: null});
            return e;
        });
    }

    render() {
        let {eventKey, label, onImportSubmit} = this.props;
        let {successMessage, errorMessage} = this.state;
        return (
            <SingleCellIBox title={label + " Import"}>
                <Form onSubmit={this.handleSubmit.bind(this)}>
                    <SuccessDisplay message={successMessage} />
                    <ErrorDisplay message={errorMessage} />
                    <Input ref="fileInput"
                           type='file'
                           label={label + " File"}
                           help={label + " files to import"}
                           required={true} />

                        <SubmitButton label="Import" />
                </Form>
            </SingleCellIBox>);
    }
}
