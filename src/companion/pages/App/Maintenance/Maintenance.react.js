import React from 'react';
import {RouteHandler} from "react-router";
import exposeRouter from 'components/common/exposerouter';
import {Tabs, Tab} from 'react-bootstrap';
import DocumentTitle from 'react-document-title';
import {SingleCellLayout, PageGrid, Row, Col} from 'components/common/pagelayout';
import {SingleCellIBox, IBoxSection} from 'components/common/IBox';
import DataObjectPurge from "./DataObjectPurge";
import DataObjectNotificationThreshold from "./DataObjectNotificationThreshold";
import EdiNotificationThreshold from "./EdiNotificationThreshold";
import {getFacilityContext} from 'data/csapi';
import ParameterSetConfiguration from "./ParameterSetConfiguration.react.js";
import DailyMetrics from "./DailyMetrics.react.js";

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
        this.state = {};
    }

    findExtensionPoint(props) {

        let selectedParameterType = this.props.router.getCurrentParams().parameterType;
        if (selectedParameterType) {
            let configuration = this.state[selectedParameterType];
            let extensionPoint = configuration.extensionPoint;
            this.setState({extensionPoint: extensionPoint});
        }
    }

    handleConfigurationUpdate() {
        let parameterSetTypes = ["ParameterEdiFreeSpaceHealthCheck", "ParameterSetDataPurge", "ParameterSetDataQuantityHealthCheck"];
        return Promise.reduce(parameterSetTypes, (configs, type) => {
            return getFacilityContext().getHealthCheckConfiguration(type).then((config) => {
                configs[type] = config;
                return configs;
            });
        }, {}).then((finalConfigs) => {
            this.setState(finalConfigs, () => {
                this.findExtensionPoint(this.props);
            });
        });
    }

    componentWillMount() {
        this.handleConfigurationUpdate();
    }

    componentWillReceiveProps(nextProps) {
        this.handleConfigurationUpdate();
    }

    render() {
        let {state: appState} = this.props;
        let {extensionPoint} = this.state;
        return (<DocumentTitle title="Maintenance">
                <SingleCellLayout>
                    <Tabs className="nav-tabs-simple" defaultActiveKey="database">
                        <Tab eventKey="database" title="Database">
                            <PageGrid>
                                <Row>
                                    <Col sm={12}>
                                        <SingleCellIBox title="Data Quantity Health Check">
                                            <ParameterSetConfiguration
                                             parameterType="ParameterSetDataQuantityHealthCheck"
                                             configuration={this.state.ParameterSetDataQuantityHealthCheck}
                                                onUpdate={this.handleConfigurationUpdate.bind(this)}
                                             />
                                        </SingleCellIBox>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col sm={12}>
                                        <DataObjectPurge
                                            parameterType="ParameterSetDataPurge"
                                            configuration={this.state.ParameterSetDataPurge}
                                            onConfigurationUpdate={this.handleConfigurationUpdate.bind(this)}/>
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
                    {(extensionPoint) ? <RouteHandler extensionPoint={fromJS(extensionPoint)} onExtensionPointUpdate={this.handleConfigurationUpdate.bind(this)} returnRoute="maintenance"/> : null}

                </SingleCellLayout>
                </DocumentTitle>
               );
    }
};
Maintenance.propTypes = {
    router: React.PropTypes.func
};
export default exposeRouter(Maintenance);
