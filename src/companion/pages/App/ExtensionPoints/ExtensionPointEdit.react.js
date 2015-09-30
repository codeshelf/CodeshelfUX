import  React from 'react';
import Immutable from 'immutable';

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
        return this.props.onExtensionPointUpdate(extensionPoint);
    }

    render() {
        var formData = this.props.extensionPoint;
        return (<ModalForm title="Edit Extension Point" formData={formData} returnRoute="extensionpoints" onSave={this.handleSave.bind(this)}>
                    <ExtensionPointForm ref="form" formData={formData} />
                </ModalForm>);
    }
};

ExtensionPointEdit.propTypes = {
    extensionPoint: React.PropTypes.object.isRequired
};
