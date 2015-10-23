import React from "react";
import Icon from "react-fa";
import {Modal, Button} from 'react-bootstrap';
import {Form, SubmitButton} from 'components/common/Form';

import exposeRouter from 'components/common/exposerouter';

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
        let routeName = this.props.returnRoute;
        let params = this.props.router.getCurrentParams();
        this.props.router.transitionTo(routeName, params);
    }

    handleSave(e) {
        e.preventDefault();
        return this.props.onSave().then(() => {
            this.handleClose();
        })
        .catch((e) => {
            this.forceUpdate();
        }) ;
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
