import  React from 'react';
import {fromJS} from 'immutable';
import ModalForm from "components/common/ModalForm";
import ExtensionPointForm from "./ExtensionPointForm.react.js";
import {getFacilityContext} from "data/csapi";

export default class ExtensionPointEdit extends React.Component {

    constructor() {
        super();
        //TODO local state hack
        this.state = {
            "savePending" : false
        };
    }

    handleSave() {
        let extensionPoint = this.refs.form.getExtensionPoint();
        return getFacilityContext().updateExtensionPoint(extensionPoint.toJS()).then((updatedExtensionPoint) => {
            return this.props.onExtensionPointUpdate(fromJS(updatedExtensionPoint));
        });
    }

    render() {
        var formData = this.props.extensionPoint;
        var {returnRoute = "extensionpoints"} = this.props;
            return (<ModalForm title="Edit Extension Point" formData={formData} returnRoute={returnRoute} onSave={this.handleSave.bind(this)}>
                    <ExtensionPointForm ref="form" formData={formData} />
                </ModalForm>);
    }
};

ExtensionPointEdit.propTypes = {
    extensionPoint: React.PropTypes.object.isRequired
};
