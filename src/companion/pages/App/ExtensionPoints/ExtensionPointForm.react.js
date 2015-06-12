import  React from 'react';
import {Input, Checkbox, TextArea} from "components/common/Form";
import Immutable from 'immutable';
import {ExtensionPoint} from "data/types";

export default class ExtensionPointForm extends React.Component {

    constructor(props) {
        super(props);
        //TODO local state hack
        this.state = {
            formData: props.formData
        };

    }

    handleChange(field, e) {
        let {formData} = this.state;
        var value = null;
        if (field === "active") {
            value = (e.target.checked);
        } else {
            value = e.target.value;
        }
        let newFormData = formData.set(field, value);
        this.setState({formData: newFormData});
    }

    getExtensionPoint() {
        return this.state.formData;
    }

    render() {
        let {formData} = this.state;
        var title = formData ? "Edit Worker" : "Not Found";
        return (
                <div>
                    <Input type="text" readonly={true} label={ExtensionPoint.toLabel("type")} name="type" value={formData.get("type")} />
                <Checkbox label={ExtensionPoint.toLabel("active")} name="active" value={formData.get("active")} onChange={this.handleChange.bind(this, "active")}/>
                <TextArea label={ExtensionPoint.toLabel("script")} name="script" value={formData.get("script")} rows="10" onChange={this.handleChange.bind(this, "script")}/>
                </div>
            );
    }

}
