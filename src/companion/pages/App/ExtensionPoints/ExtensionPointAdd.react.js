import  React from "react";
import ModalForm from "components/common/ModalForm";
import {Select, ErrorDisplay} from "components/common/Form";
import {fromJS, List} from "immutable";
import {getFacilityContext} from "data/csapi";

export default class ExtensionPointAdd extends React.Component{

    constructor(props) {
        super(props);
        this.state = {};
    }

    handleSave() {
        let node = React.findDOMNode(this.refs.type);
        let select = node.getElementsByTagName("select")[0];
        let value = select.options[select.selectedIndex].value;
        return getFacilityContext().addExtensionPoint({type: value}).then((newExtensionPoint) => {
            return this.props.onExtensionPointAdd(newExtensionPoint);
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
        let {errorMessage} = this.state;
        let {availableTypes} = this.props;
            return (<ModalForm title="Add Extension Point" formData={{}} returnRoute="extensionpoints" onSave={this.handleSave.bind(this)}>
                    <ErrorDisplay message={errorMessage} />
                    <Select ref="type" options={availableTypes.toJS()}/>
                </ModalForm>);
    }
};
