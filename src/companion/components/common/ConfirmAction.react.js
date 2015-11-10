import React from 'react';
import _ from 'lodash';
import {Map, List, fromJS} from 'immutable';
import {Modal} from 'react-bootstrap';
import {Button} from 'components/common/bootstrap';
import {Input, Checkbox, ErrorDisplay} from 'components/common/Form';
import Icon from 'react-fa';

export default class ConfirmAction extends React.Component {

    constructor() {
        super();
        this.state = {confirm: false,
                      failure: null,
                      inprogress: false
                     };
        this.handleConfirm = this.handleConfirm.bind(this);
        this.closeConfirm = this.closeConfirm.bind(this);
        this.openConfirm = this.openConfirm.bind(this);
    }

    handleConfirm() {
        this.setState({inprogress: true});
        this.props.onConfirm()
            .then(() => {
                this.closeConfirm();
            }, (e) => {
                this.setState({failure: "Failed: " + e});
            })
            .finally(() => {
                this.setState({inprogress: false});
            });
    }

    openConfirm() {
        this.setState({confirm: true,
                       inprogress: false,
                       failure: ""});
    }

    closeConfirm() {
        this.setState({confirm: false,
                       inprogress: false,
                       failure: ""});
    }

    render() {
            let {id, style, title,  confirmLabel, confirmInProgressLabel, instructions, children} = this.props;
        let {confirm, failure, inprogress} = this.state;
        return (<span>
                    <Button {...{id, style, title}} type="button" bsStyle="primary"
                            onClick={this.openConfirm}>
                        {children}
                    </Button>
                    <ConfirmModal
                        show={confirm}
                        title={(inprogress) ? confirmInProgressLabel : confirmLabel}
                        confirmLabel={
                            (inprogress)
                                ? <span>{confirmInProgressLabel} <Icon name="spinner" spin /></span>
                                : <span>{confirmLabel}</span>
                        }
                        onConfirm={this.handleConfirm}
                            onHide={this.closeConfirm}>
                        <ErrorDisplay message={failure} />
                        <div>{instructions}</div>
                    </ConfirmModal>
                </span>);
    }
}


class ConfirmModal extends React.Component {
    render() {
        let {confirmLabel, title, children, onConfirm, onHide} = this.props;
            return (<Modal {...this.props}>
                    <Modal.Header><h5>{title}</h5></Modal.Header>
    <Modal.Body>{children}</Modal.Body>
    <Modal.Footer>
    <Button onClick={onConfirm}>{confirmLabel}</Button>
    <Button bsStyle="primary" onClick={onHide}>Cancel</Button>
                    </Modal.Footer>
                    </Modal>);
    }
}
