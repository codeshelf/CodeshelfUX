import  React from 'react';
import Immutable from 'immutable';
import exposeRouter from 'components/common/exposerouter';
import ModalForm from "components/common/ModalForm";
import ExtensionPointForm from "./ExtensionPointForm.react.js";
import {getFacilityContext} from "data/csapi";

class ExtensionPointDisplay extends React.Component {

    constructor() {
        super();
        //TODO local state hack
        this.state = {
            "savePending" : false
        };

    }
    componentWillMount() {
        this.findSelectedExtensionPointForm(this.props);
    }
    componentWillReceiveProps(newProps) {
        this.findSelectedExtensionPointForm(newProps);
    }

    findSelectedExtensionPointForm(props) {
        var extensionPointId = props.router.getCurrentParams().extensionPointId;
        var extensionPoints = Immutable.fromJS(props.extensionPoints);
        var extensionPoint = extensionPoints.find((extensionPoint) => extensionPoint.get("persistentId") === extensionPointId);
        this.setState({"extensionPoint": extensionPoint});
    }

    handleSave() {
        let extensionPoint = this.refs.form.getExtensionPoint();
        return getFacilityContext().updateExtensionPoint(extensionPoint.toJS()).then((updateExtensionPoint) => {

        } );
    }

    render() {
        var {extensionPoint: formData} = this.state;
        return (<ModalForm title="Extension Point" formData={formData} returnRoute="extensionpoints" onSave={this.handleSave.bind(this)}>
                   <ExtensionPointForm ref="form" formData={formData} />
                </ModalForm>);
    }
};

ExtensionPointDisplay.propTypes = {
    formMetadata: React.PropTypes.array,
    router: React.PropTypes.func
};

export default exposeRouter(ExtensionPointDisplay);
