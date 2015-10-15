import React from 'react';
import {RouteHandler} from "react-router";
import exposeRouter from 'components/common/exposerouter';
import _ from 'lodash';
import {Map, List, fromJS} from 'immutable';
import {getFacilityContext} from 'data/csapi';
import {SingleCellIBox, IBoxSection} from 'components/common/IBox';
import {SingleCellLayout, Row, Col} from 'components/common/pagelayout';
import {Modal} from 'react-bootstrap';
import {Button, List as BSList} from 'components/common/bootstrap';
import {Input, Checkbox, ErrorDisplay} from 'components/common/Form';
import Icon from 'react-fa';
import {Table} from 'components/common/Table';
import ParameterSetConfiguration from "./ParameterSetConfiguration";


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

class DataObjectPurge extends React.Component{

    constructor() {
        super();
        this.changeState = changeState.bind(this);

        this.state = {};

    }

    componentWillMount() {
        this.loadSummary();
    }

    componentWillReceiveProps() {
        this.loadSummary();
    }

    loadSummary() {
        return getFacilityContext().getDataSummary().then((summaries) => {
            this.changeState("dataSummary", summaries != null && summaries.join('\n'));
        });
    }

    triggerPurge() {
        return getFacilityContext().triggerDataPurge().then(() => {
            return this.loadSummary();
        }.bind(this));
    }

    render() {
            let {configuration = {}, onConfigurationUpdate} = this.props;
        let {dataSummary = "Loading Summary"} = this.state;
        let {parameterSet = {}} = configuration;
        let {purgeAfterDays} = parameterSet;
        return (<SingleCellIBox title="Database Object Purge">
                <ParameterSetConfiguration parameterType="ParameterSetDataPurge" configuration={configuration} onUpdate={onConfigurationUpdate}/>
                       <Row>
                           <Col md={8}><pre>{dataSummary}</pre></Col>
                           <Col md={4}>
                              <Row>
                                <Col sm={12} md={6}>
                                    <ConfirmAction
                                        id="triggerPurge"
                                        style={{width: "100%", marginTop: "0.5em"}}
                                        onConfirm={this.triggerPurge.bind(this)}
                                        confirmLabel="Trigger Purge"
                                        confirmInProgressLabel="Triggering"
                                        instructions={`Do you want to purge data older than ${purgeAfterDays} day(s)?`}>
                                        Trigger Purge
                                    </ConfirmAction>
                                </Col>
                            </Row>
                      </Col>
                   </Row>
                </SingleCellIBox>
               );
    }
};
export default exposeRouter(DataObjectPurge);

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
