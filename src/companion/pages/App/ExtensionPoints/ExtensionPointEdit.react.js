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
        })
        .catch((e) =>{
            if (e.body) {
                    this.setState({errorMessage: e.body.errors[0]});
            } else {
                this.setState({errorMessage: e.message});
            }

            throw e;
        });
    }

    render() {
        var formData = this.props.extensionPoint;
        var {returnRoute = "extensionpoints"} = this.props;
        const {errorMessage} = this.state;
        return (<ModalForm title="Edit Extension Point" formData={formData} returnRoute={returnRoute} onSave={this.handleSave.bind(this)}>
                    <ExtensionPointForm ref="form" errorMessage={errorMessage} formData={formData} />
                </ModalForm>);
    }
};

ExtensionPointEdit.propTypes = {
    extensionPoint: React.PropTypes.object.isRequired
};
