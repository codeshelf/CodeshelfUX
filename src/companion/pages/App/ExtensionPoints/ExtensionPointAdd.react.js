import  React from "react";
import ModalForm from "components/common/ModalForm";
import {Select} from "components/common/Form";
import {fromJS, List} from "immutable";
import {getFacilityContext} from "data/csapi";

export default class ExtensionPointAdd extends React.Component{

    constructor(props) {
        super(props);
    }

    handleSave() {
        let node = React.findDOMNode(this.refs.type);
        let select = node.getElementsByTagName("select")[0];
        let value = select.options[select.selectedIndex].value;
        return getFacilityContext().addExtensionPoint({type: value}).then((newExtensionPoint) => {
            this.props.extensionPoints.cursor().update((list) =>{
                return list.push(fromJS(newExtensionPoint));
            });
        });
    }


    render() {

        let {availableTypes} = this.props;
        return (<ModalForm title="Add Extension Point" formData={{}} returnRoute="extensionpoints" onSave={this.handleSave.bind(this)}>
                    <Select ref="type" options={availableTypes.toJS()}/>
                </ModalForm>);
    }
};
