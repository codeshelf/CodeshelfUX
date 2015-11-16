import  React from 'react';
import FormFields from "components/common/FormFields";
import {ErrorDisplay} from "components/common/Form";
import Immutable from 'immutable';
import {toLabel} from "data/types/ScheduledJob";
import Text from "data/types/Text";

const formMetadata = [
        {name: "type",
         label: toLabel("type"),
         readOnly: true},
        {name: "active",
         label: toLabel("active"),
         type: Boolean
        },
        {name: "cronExpression",
         label: toLabel("cronExpression")
        }
];

export default class ScheduledJobForm extends React.Component {

    constructor(props) {
        super(props);
        //TODO local state hack should be done differently
        this.state = {
            formData: props.formData
        };

    }

    handleChange(field, value) {
        let {formData} = this.state;
        let newFormData = formData.set(field.name, value);
        this.setState({formData: newFormData});
    }

    getFormData() {
        return this.state.formData;
    }

    render() {
        let {errorMessage} = this.props;
        let {formData} = this.state;
        return (
            <div>
                <ErrorDisplay message={errorMessage} />
                <FormFields formMetadata={formMetadata} formData={formData} handleChange={this.handleChange.bind(this)} />

            </div>
            );
    }

}
