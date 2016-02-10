import React from 'react';
import {RouteHandler} from "react-router";
import exposeRouter from 'components/common/exposerouter';
import _ from 'lodash';
import {Map, List, fromJS} from 'immutable';
import {getAPIContext} from 'data/csapi';
import {SingleCellIBox, IBoxSection} from 'components/common/IBox';
import {SingleCellLayout, Row, Col} from 'components/common/pagelayout';
import {Button, List as BSList} from 'components/common/bootstrap';
import {Form, Input, Checkbox, ErrorDisplay, getRefInputValue} from 'components/common/Form';
import Icon from 'react-fa';
import {Table} from 'components/common/Table';
import ParameterSetConfiguration from "./ParameterSetConfiguration";
import ConfirmAction from "components/common/ConfirmAction";

function changeState(name, value, callback) {
    let obj = new Object();
    obj[name] = value;
    this.setState(obj, callback);
}


class DataObjectPurge extends React.Component{

    constructor(props) {
        super(props);
        this.changeState = changeState.bind(this);
        this.state = {schedule: {cronExpression: ""}};
    }

    findSchedule(type) {
        getAPIContext().findSchedule(type).then((schedule) => {
            this.setState({schedule: schedule});
        });
    }

    handleSubmit(type, schedule, e) {
        e.preventDefault();
        return getAPIContext().updateSchedule(type, schedule).then((newSchedule) => {
            this.setState({schedule: schedule});
        }).catch((error) => {
            console.error(error);
        });

    }

        handleCronExpressionChange(e) {
                this.setState({schedule: {cronExpression: e.target.value}});
    }

    componentWillMount() {
        this.loadSummary();
        this.findSchedule("DatabasePurge");
    }

    componentWillReceiveProps() {
        this.loadSummary();
    }

    loadSummary() {
        return getAPIContext().getDataSummary().then((summaries) => {
            this.changeState("dataSummary", summaries != null && summaries.join('\n'));
        });
    }

    triggerPurge() {
        return getAPIContext().triggerSchedule("DatabasePurge").then(function() {
            return this.loadSummary();
        }.bind(this));
    }

    cancelPurge() {
        return getAPIContext().cancelJob("DatabasePurge").then(function() {
            return this.loadSummary();
        }.bind(this));
    }

    render() {
        let {parameterType, configuration = {}, onConfigurationUpdate, onSaveSchedule} = this.props;
        let {schedule} = this.state;
        let {dataSummary = "Loading Summary"} = this.state;
        let {parameterSet = {}} = configuration;
        let {purgeAfterDays} = parameterSet;
        return (<SingleCellIBox title="Database Object Purge">
                    <ParameterSetConfiguration parameterType={parameterType} configuration={configuration} onUpdate={onConfigurationUpdate}/>
                       <Row>
                           <Col md={8}><pre>{dataSummary}</pre></Col>
                           <Col md={4}>
                               <Row>
                                   <Col sm={12} md={6}>
                                       <Form onSubmit={this.handleSubmit.bind(this, "DatabasePurge", schedule)}>
                                               <Input ref="schedule" label="Schedule" value={schedule.cronExpression} onChange={this.handleCronExpressionChange.bind(this)} /><Button type="submit" bsStyle="primary" ><Icon name="save"/></Button>
                                       </Form>
                                   </Col>
                               </Row>
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
                                <Col sm={12} md={6}>
                                    <ConfirmAction
                                        id="cancelPurge"
                                        style={{width: "100%", marginTop: "0.5em"}}
                                        onConfirm={this.cancelPurge.bind(this)}
                                        confirmLabel="Cancel Purge"
                                        confirmInProgressLabel="Cancelling"
                                        instructions="Do you want to cancel data purge">

                                        Cancel Run
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
