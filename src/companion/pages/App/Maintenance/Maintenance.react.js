import React from 'react';
import exposeRouter, {toURL} from 'components/common/exposerouter';
import {Tabs, Tab} from 'react-bootstrap';
import {SingleCellLayout, PageGrid, Row, Col} from 'components/common/pagelayout';
import {SingleCellIBox, IBoxSection} from 'components/common/IBox';
import DataObjectPurge from "./DataObjectPurge";
import DataObjectNotificationThreshold from "./DataObjectNotificationThreshold";
import EdiNotificationThreshold from "./EdiNotificationThreshold";
import {getFacilityContext} from 'data/csapi';
import ParameterSetConfiguration from "./ParameterSetConfiguration.react.js";
import DailyMetrics from "./DailyMetrics.react.js";
import ScheduledJobs from "./ScheduledJobs.react.js";
import Promise from "bluebird";
import {fromJS} from "immutable";


class MaintenaceTabContent extends React.Component {
    render() {
        const {title} = this.props;
        return (
            <PageGrid>
                <Row>
                    <Col sm={12}>
                        <SingleCellIBox title={title}>
                            {this.props.children}
                        </SingleCellIBox>
                    </Col>
                </Row>
            </PageGrid>
        );
    }
}

class Maintenance extends React.Component{

    constructor() {
        super();
        this.state = {

        };
    }

    findExtensionPoint(props) {

        let selectedParameterType = this.props.params.parameterType;
        if (selectedParameterType) {
            let configuration = this.state[selectedParameterType];
            let extensionPoint = (configuration) ? configuration.extensionPoint : null;
            return extensionPoint;
        }
    }

    handleConfigurationUpdate(props) {
        let parameterSetTypes = ["ParameterEdiFreeSpaceHealthCheck", "ParameterSetDataPurge", "ParameterSetDataQuantityHealthCheck"];
        return Promise.reduce(parameterSetTypes, (configs, type) => {
            return getFacilityContext().getHealthCheckConfiguration(type).then((config) => {
                configs[type] = config;
                return configs;
            });
        }, {}).then((finalConfigs) => {
            this.setState(finalConfigs);
        });
    }


    componentWillMount() {
        this.handleConfigurationUpdate(this.props);
    }

    componentWillReceiveProps(nextProps) {
        this.handleConfigurationUpdate(nextProps);
    }

    render() {
        let {state: appState} = this.props;
        let extensionPoint = this.findExtensionPoint(this.props);
        let {
             ParameterSetDataPurge,
             ParameterSetDataQuantityHealthCheck} = this.state;
        const returnRoute = toURL(this.props, "maintenance");
        return (
                <SingleCellLayout title="Maintenance">
                    <Tabs className="nav-tabs-simple" defaultActiveKey="jobs">
                        <Tab eventKey="jobs" title="Jobs">
                            <SingleCellIBox>
                              <ScheduledJobs {...this.props}/>
                            </SingleCellIBox>
                        </Tab>
                        <Tab eventKey="database" title="Database">
                            <PageGrid>
                                <Row>
                                    <Col sm={12}>
                                        <SingleCellIBox title="Data Quantity Health Check">
                                            <ParameterSetConfiguration
                                             parameterType="ParameterSetDataQuantityHealthCheck"
                                             configuration={ParameterSetDataQuantityHealthCheck}
                                             onUpdate={this.handleConfigurationUpdate.bind(this)}
                                             />
                                        </SingleCellIBox>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col sm={12}>
                                        <DataObjectPurge
                                            parameterType="ParameterSetDataPurge"
                                            configuration={ParameterSetDataPurge}
                                            onConfigurationUpdate={this.handleConfigurationUpdate.bind(this)}

                                         />
                                    </Col>
                                </Row>
                            </PageGrid>
                        </Tab>
                        <Tab eventKey="edi" title="EDI">
                            <PageGrid>
                                <Row>
                                    <Col sm={12}>
                                        <SingleCellIBox title="Edi Free Space Health Check">
                                            <ParameterSetConfiguration
                                                parameterType="ParameterEdiFreeSpaceHealthCheck"
                                                configuration={this.state.ParameterEdiFreeSpaceHealthCheck}
                                                onUpdate={this.handleConfigurationUpdate.bind(this)}
                                             />
                                            </SingleCellIBox>
                                    </Col>
                                </Row>
                            </PageGrid>
                        </Tab>
                        <Tab eventKey="daily" title="Daily">
                            <MaintenaceTabContent title="Daily Metrics" >
                                <DailyMetrics appState={appState}/>
                            </MaintenaceTabContent>
                        </Tab>
                    </Tabs>
                    {extensionPoint && React.cloneElement(this.props.children,
                      {extensionPoint:fromJS(extensionPoint),
                       onExtensionPointUpdate:this.handleConfigurationUpdate.bind(this),
                       returnRoute })}
                </SingleCellLayout>
               );
    }
};
Maintenance.propTypes = {
    router: React.PropTypes.object.isRequired
};
export default exposeRouter(Maintenance);
