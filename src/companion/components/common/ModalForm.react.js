import React from "react";
import Icon from "react-fa";
import {Modal, Button} from 'react-bootstrap';
import exposeRouter from 'components/common/exposerouter';

class ModalForm extends React.Component{

    constructor(props) {
        super(props);
        this.state = {
            "savePending" : false
        };
    }

    handleClose() {
        let routeName = this.props.returnRoute;
        this.setState({"savePending": false});
        let params = this.props.router.getCurrentParams();
        this.props.router.transitionTo(routeName, params);
    }

    handleSave(e) {
        e.preventDefault();
        this.setState({"savePending": true});
        this.props.onSave().then(() => {
            this.handleClose();
        });
}


    render() {
        var {title, formData} = this.props;
        var modalTitle = formData ? `Edit ${title}` : "Not Found"
;        return (
                <Modal className="modal-header" title={modalTitle} onRequestHide={this.handleClose.bind(this)}>
                    { formData ? this.renderForm(formData) : this.renderNotFound()}
                </Modal>
            );
    }

    renderNotFound() {
        return (<div className="modal-body">
                   Not Found
                </div>);
    }

    renderForm(formData) {
        return (<form onSubmit={this.handleSave.bind(this)}>
                    <div className='modal-body'>
                    {
                        this.props.children
                    }
                    </div>
                    <div className='modal-footer'>
                        <Button onClick={this.handleClose.bind(this)}>Cancel</Button>
                        <Button bsStyle="primary" type="submit">{
                            this.renderSaveButtonContent()
                        }</Button>
                    </div>
                </form>);
    }

    renderSaveButtonContent() {
        if (this.state.savePending) {
            return (<span><Icon name="spinner" spin/> Saving...</span>);
        }
        else {
            return "Save";
        }
    }


};

export default exposeRouter(ModalForm);
