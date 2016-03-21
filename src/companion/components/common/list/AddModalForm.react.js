import React from "react";
import ReactDOM from 'react-dom';
import ModalForm from "components/common/ModalForm";
import {Select, ErrorDisplay} from "components/common/Form";
import {fromJS, List} from "immutable";
import ImmutablePropTypes from 'react-immutable-proptypes';
import {getFacilityContext} from "data/csapi";

export default class AddModalForm extends React.Component{

    constructor(props) {
        super(props);
        this.state = {};
    }

    handleSave() {
        let node = ReactDOM.findDOMNode(this.refs.type);
        let select = node.getElementsByTagName("select")[0];
        let value = select.options[select.selectedIndex].value;
        return this.props.addAction({type: value}).then((newOne) => {
            return this.props.onAdd(newOne);
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
        let {title, availableTypes, returnRoute} = this.props;
        let {errorMessage} = this.state;
        return (<ModalForm title={title} formData={{}} returnRoute={returnRoute} onSave={this.handleSave.bind(this)}>
                    <ErrorDisplay message={errorMessage} />
                    <Select ref="type" options={availableTypes.toJS()}/>
                </ModalForm>);
    }
};
AddModalForm.propTypes = {
    availableTypes: ImmutablePropTypes.iterable.isRequired,
    returnRoute: React.PropTypes.string.isRequired,
    addAction: React.PropTypes.func.isRequired
};
