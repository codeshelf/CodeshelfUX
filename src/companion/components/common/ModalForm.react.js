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

        this.handleClose = this.handleClose.bind(this);
        this.handleSave = this.handleSave.bind(this);

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
            var {title, formData, show} = this.props;
        var modalTitle = formData ? title : "Not Found"
;        return (
                <Modal show={show} title={modalTitle} onHide={this.handleClose}>
                    <Modal.Header><h5>{modalTitle}</h5></Modal.Header>
                    { formData ? this.renderForm(formData, this.renderSaveButtonContent(), this.handleSave, this.handleClose ) : this.renderNotFound()}
                </Modal>
            );
    }

    renderNotFound() {
        return ( <Modal.Body>
                   Not Found
                 </Modal.Body>
               );
    }

        renderForm(formData, label, onSave, onHide) {
            return (<form onSubmit={onSave}>
                        <Modal.Body>
                        {
                            this.props.children
                        }
                        </Modal.Body>
                        <Modal.Footer>
                            <Button  onClick={onHide}>Cancel</Button>
                            <Button type="submit" bsStyle="primary" >{label}</Button>
                        </Modal.Footer>
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
