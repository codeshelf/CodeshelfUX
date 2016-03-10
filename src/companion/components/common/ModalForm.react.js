import React from "react";
import Icon from "react-fa";
import {Modal, Button} from 'react-bootstrap';
import {Form, SubmitButton} from 'components/common/Form';

import exposeRouter, {toURL} from 'components/common/exposerouter';

class ModalForm extends React.Component{

    constructor(props) {
        super(props);
        this.state = {
            "show": true
        };

        this.handleClose = this.handleClose.bind(this);
        this.handleSave = this.handleSave.bind(this);

    }

    handleClose() {
        this.setState({"show": false});
        //Transition away, so make sure unmount tears down the modal
        this.props.router.push(this.props.returnRoute);
    }

    handleSave(e) {
        e.preventDefault();

        return this.props.onSave().then(() => {
            if (!this.props.actionError) {
                this.handleClose();
            }
        })
        .catch((e) => {
            this.forceUpdate();
        }) ;
    }

    componentWillUnmount() {
        //always teardown modal before transitioning away
        if (this.props.actionError) {
            this.props.acUnsetError();
        }
        this.handleClose();
    }

    render() {
        const {title, formData, actionError} = this.props;
        let {show} = this.state;
        const modalTitle = formData ? title : "Not Found";

        const errorStyle = {
            color: '#8D1414'
        };
        let errorMessage = "";
        if (actionError && actionError === 500) {
            errorMessage = "An error occurred on the server contact support and try again.";

            return (
                <Modal ref="modal" 
                       show={show} 
                       title={modalTitle} 
                       onHide={this.handleClose}>
                    <Modal.Header>
                        <h5>{modalTitle}</h5>
                        <h5 style={errorStyle}>{errorMessage}</h5>
                    </Modal.Header>
                    <Modal.Footer>
                        <Button  id="cancel" onClick={this.handleClose}>Cancel</Button>
                    </Modal.Footer>
                </Modal>
            );
        }
        if (actionError && actionError === 400) {
            errorMessage = "Invalid input please correct the form.";
        }
        return (
                <Modal ref="modal" show={show} title={modalTitle} onHide={this.handleClose}>
                    <Modal.Header>
                        <h5>{modalTitle}</h5>
                        <h5 style={errorStyle}>{errorMessage}</h5>
                    </Modal.Header>
                    { formData ? this.renderForm(formData, this.handleSave, this.handleClose ) : this.renderNotFound()}
                </Modal>
            );
    }

    renderNotFound() {
        return ( <Modal.Body>
                   Not Found
                 </Modal.Body>
               );
    }

        renderForm(formData, onSave, onHide) {
            return (<Form onSubmit={onSave}>
                        <Modal.Body>
                        {
                            this.props.children
                        }
                        </Modal.Body>
                        <Modal.Footer>
                            <Button  id="cancel" onClick={onHide}>Cancel</Button>
                            <SubmitButton label="Save"></SubmitButton>
                        </Modal.Footer>
                    </Form>);
    }
};

export default exposeRouter(ModalForm);
