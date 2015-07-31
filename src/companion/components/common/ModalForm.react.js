import React from "react";
import Icon from "react-fa";
import {Modal, Button} from 'react-bootstrap';
import exposeRouter from 'components/common/exposerouter';

class ModalForm extends React.Component{

    constructor(props) {
        super(props);
        this.state = {
            "savePending" : false,
            "show": true
        };

        this.handleClose = this.handleClose.bind(this);
        this.handleSave = this.handleSave.bind(this);

    }

    handleClose() {
        this.setState({"savePending": false,
               "show": false});
        //Transition away, so make sure unmount tears down the modal
        let routeName = this.props.returnRoute;
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

    componentWillUnmount() {
        //always teardown modal before transitioning away
        this.refs.modal.onHide();
    }

    render() {
        var {title, formData} = this.props;
        let {show} = this.state;
        var modalTitle = formData ? title : "Not Found"
;        return (
                <Modal ref="modal" show={show} title={modalTitle} onHide={this.handleClose}>
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
