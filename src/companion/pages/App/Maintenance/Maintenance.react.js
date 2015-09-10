import React from 'react';
import DocumentTitle from 'react-document-title';
import _ from 'lodash';
import {Map, List, fromJS} from 'immutable';
import {getFacilityContext} from 'data/csapi';
import {IBox, IBoxBody} from 'components/common/IBox';
import {PageGrid, Row, Col} from 'components/common/pagelayout';
import {Modal} from 'react-bootstrap';
import {Button, List as BSList} from 'components/common/bootstrap';
import {Input, Checkbox, ErrorDisplay} from 'components/common/Form';
import Icon from 'react-fa';
import {Table} from 'components/common/Table';
import Dropzone from 'react-dropzone';


function changeState(name, value, callback) {
    let obj = new Object();
    obj[name] = value;
    this.setState(obj, callback);
}

class ConfirmAction extends React.Component {

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
        let {id, confirmLabel, confirmInProgressLabel,  instructions, children, style} = this.props;
        let {confirm, failure, inprogress} = this.state;
        return (<div>
                    <Button id={id} style={style} type="button" bsStyle="primary"
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
                </div>);
    }
}

export default class Maintenance extends React.Component{

    constructor() {
        super();
        this.state = {daysOld: 5};
        this.changeState = changeState.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    componentDidMount() {
        this.loadSummary(this.state.daysOld);
    }

    handleChange(e) {
        this.changeState("daysOld", e.target.value);
    }

    handleSubmit(e) {
        e && e.preventDefault();

        return this.loadSummary(this.state.daysOld);
    }

    loadSummary(daysOld) {
        return getFacilityContext().getDataSummary(daysOld).then((summaries) => {
            this.changeState("dataSummary", summaries != null && summaries.join('\n'));
        });
    }

    cleanWorkInstructions(daysOld) {
        return getFacilityContext().deleteWIData(daysOld).then(() => {
            return this.loadSummary(daysOld);
        }.bind(this));
    }

    cleanOrders(daysOld) {
        return getFacilityContext().deleteOrderData(daysOld).then(() => {
            return this.loadSummary(daysOld);
        }.bind(this));
    }

    cleanContainers(daysOld) {
        return getFacilityContext().deleteContainerData(daysOld).then(() => {
            return this.loadSummary(daysOld);
        }.bind(this));
    }


    render() {
        let {daysOld, dataSummary = "Loading Summary"} = this.state;
            return (<DocumentTitle title="Maintenance">
                        <PageGrid>
                            <Row>
                                <Col sm={12} md={6}>
                <IBox>
                    <IBoxBody>
                        <Row>
                                <Col sm={12} md={2}>
                                <form onSubmit={this.handleSubmit}>
                                    <Input type="number"
                                        label="Days Old"
                                        name="daysOld"
                                        value={daysOld}
                                        min="1"
                                        onChange={this.handleChange}
                                        onBlur={(e) => {
                                            if (e.target.checkValidity()) {
                                                    this.handleSubmit();
                                            } else {
                                                //e.target.focus();
                                            }
                                        }.bind(this)} />
                                </form>
                            </Col>
                        </Row>
                        <Row>
                                <Col sm={12}><pre>{dataSummary}</pre></Col>
                        </Row>
                        <Row>
                            <Col sm={12} md={3}>
                                <ConfirmAction
                                    id="cleanWIs"
                                    style={{width: "100%", marginTop: "0.5em"}}
                                    onConfirm={this.cleanWorkInstructions.bind(this, daysOld)}
                                    confirmLabel="Clean WIs"
                                    confirmInProgressLabel="Cleaning"
                                    instructions={`Do you want to clean work instructions older than ${daysOld} day(s)?`}>
                                        Clean WIs
                                </ConfirmAction>
                            </Col>
                        </Row>
                        <Row>
                                <Col sm={12} md={3}>
                                <ConfirmAction
                                    id="cleanOrders"
                                    style={{width: "100%", marginTop: "0.5em"}}
                                    onConfirm={this.cleanOrders.bind(this, daysOld)}
                                    confirmLabel="Clean Orders"
                                    confirmInProgressLabel="Cleaning"
                                    instructions={`Do you want to clean orders older than ${daysOld} day(s)?`}>
                                       Clean Orders
                               </ConfirmAction>
                            </Col>
                        </Row>
                    <Row>
                        <Col sm={12} md={3}>
                            <ConfirmAction
                                  id="cleanContainers"
                                  style={{width: "100%", marginTop: "0.5em"}}
                                  onConfirm={this.cleanContainers.bind(this, daysOld)}
                                  confirmLabel="Clean Containers"
                                  confirmInProgressLabel="Cleaning"
                                  instructions={`Do you want to clean containers older than ${daysOld} day(s)?`}>
                                  Clean Containers
                            </ConfirmAction>
                        </Col>
                    </Row>

                        </IBoxBody>
                </IBox>
                </Col>
                </Row>
                </PageGrid>
                </DocumentTitle>
               );
    }
};


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
