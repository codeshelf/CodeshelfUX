import  React from 'react';
import Immutable from 'immutable';
import exposeRouter from 'components/common/exposerouter';
import ModalForm from "components/common/ModalForm";
import ExtensionPointForm from "./ExtensionPointForm.react.js";
import {getFacilityContext} from "data/csapi";

class ExtensionPointEdit extends React.Component {

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
        let {extensionPoints} = props;
        var extensionPoint = extensionPoints.cursor().deref().find((extensionPoint) => extensionPoint.get("persistentId") === extensionPointId);
        this.setState({"extensionPoint": extensionPoint});
    }

    handleSave() {
        let extensionPoint = this.refs.form.getExtensionPoint();
        return getFacilityContext().updateExtensionPoint(extensionPoint.toJS()).then((updateExtensionPoint) => {
            let newExtensionPoint = Immutable.fromJS(updateExtensionPoint);
            let {extensionPoints} = this.props;
            extensionPoints.cursor().update((pts) => {
                let index = pts.findIndex((p) => p.get("persistentId") === updateExtensionPoint.persistentId);
                return pts.set(index, newExtensionPoint);
            });
        } );
    }

    render() {
        var {extensionPoint: formData} = this.state;
            return (<ModalForm title="Edit Extension Point" formData={formData} returnRoute="extensionpoints" onSave={this.handleSave.bind(this)}>
                   <ExtensionPointForm ref="form" formData={formData} />
                </ModalForm>);
    }
};

ExtensionPointEdit.propTypes = {
    formMetadata: React.PropTypes.array,
    router: React.PropTypes.func
};

export default exposeRouter(ExtensionPointEdit);
