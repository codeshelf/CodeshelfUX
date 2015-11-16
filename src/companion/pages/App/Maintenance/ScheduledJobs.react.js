import  React from "react";
import Icon from 'react-fa';
import _ from "lodash";
import DocumentTitle from "react-document-title";
import ListManagement from "components/common/list/ListManagement";
import {getFacilityContext} from "data/csapi";
import exposeRouter from 'components/common/exposerouter';
import ConfirmAction from 'components/common/ConfirmAction';
import {RouteHandler} from "react-router";
import {Button} from 'react-bootstrap';
import {fromJS, Map, List} from "immutable";
import {types, keyColumn, properties} from "data/types/ScheduledJob";

const title = "Scheduled Jobs";
const addRoute = "scheduledjobadd";
const editRoute = "scheduledjobedit";
const allTypes = fromJS(types);
const typeLabelMap = allTypes.reduce((map, option) => {
    return map.set(option.get("value"), option.get("label"));
}, Map());
function toAvailableTypes(list, allTypes) {
    let currentTypes = fromJS(list).map((pt) => pt.get("type"));
    let availableTypes = allTypes.filter((t) => !currentTypes.includes(t.get("value")));
    return availableTypes;
}
class Type extends React.Component {
    render() {
        var formData = this.props.rowData;
        var type = formData.get("type");
        return (<span data-type={type}>{typeLabelMap.get(type)}</span>);
    }

}


function editRouteFactory(row) {
    return {
        to: editRoute,
        params: {type: row.get("type")}
    };
}


function createRowActionComponent(onActionComplete) {
    class ScheduledJobActions extends React.Component {

        trigger(type) {
            return getFacilityContext().triggerSchedule(type).then(() => {
                onActionComplete();
            });
        }

        cancel(type) {
            return getFacilityContext().cancelJob(type).then(() => {
                onActionComplete();
            });
        }

        delete(rowData) {
            let type = rowData.get("type");
            return getFacilityContext().deleteJob(type).then(() => {
                onActionComplete();
            });
        }

        render() {
            var {rowData}  = this.props;
                let type = rowData.get("type");
            var C = ListManagement.toEditButton(editRouteFactory);
            return (
            <div sytle={{whiteSpace: "nowrap"}}>
                    <C rowData={rowData} />
                    <Button bsStyle="primary" style={{marginLeft: "0.5em"}} onClick={this.trigger.bind(this, type)} title="Trigger"><Icon name="bolt"/></Button>
                    <Button bsStyle="primary" style={{marginLeft: "0.5em"}} onClick={this.cancel.bind(this, type)} title="Stop Run"><Icon name="hand-stop-o"/></Button>
                    <ConfirmAction
                        onConfirm={this.delete.bind(this, rowData)}
                        id="delete"
                        style={{marginLeft: "0.5em"}}
                        confirmLabel="Delete"
                        confirmInProgressLabel="Deleting"
                        instructions={`Click 'Delete' to remove ${type} job`}
                        title="Delete">
                        <Icon name="trash" />
                    </ConfirmAction>
                </div>);
        }

    }
    return ScheduledJobActions;
}

class ScheduledJobs extends React.Component{

    constructor(props) {
        super(props);
        this.state = {
        };
        this.rowActionComponent = createRowActionComponent(this.handleActionComplete.bind(this));
        this.columnMetadata = ListManagement.toColumnMetadataFromProperties(properties);
    }

    findSchedule(props) {
        let selectedScheduleType = this.props.router.getCurrentParams().type;
        if (selectedScheduleType) {
            let {scheduledJobs} = this.state;
            this.setState({"scheduledJob": scheduledJobs.find((j) => j.get("type") === selectedScheduleType)});
        }
    }

    handleActionComplete() {
        getFacilityContext().getScheduledJobs().then((jobs) => {
            this.setState({"scheduledJobs": fromJS(jobs)});
        });
    }

    componentWillMount() {
        this.handleActionComplete();
        this.findSchedule(this.props);
    }

    componentWillReceiveProps(nextProps) {
        this.findSchedule(nextProps);
    }

    render() {
        let {scheduledJobs: list = List(), scheduledJob: selected} = this.state;

        let {rowActionComponent, columnMetadata} = this;
        let availableTypes = toAvailableTypes(list, allTypes);
        let addButtonRoute = (availableTypes.count() <= 0) ? null : addRoute;
        let lastRoute = this.props.router.getCurrentRoutes().slice(-1)[0];
        return (<DocumentTitle title={title}>
                    <div>
                        <ListManagement
                            results={list}
                            keyColumn={keyColumn}
                            columnMetadata={columnMetadata}
                            rowActionComponent={rowActionComponent}
                            addButtonRoute={addButtonRoute} />
                        {(lastRoute.name === addRoute || lastRoute.name == editRoute)
                          ?
                          <RouteHandler scheduledJob={selected}
                              availableTypes={availableTypes}
                              onUpdate={this.handleActionComplete.bind(this)}
                              onAdd={this.handleActionComplete.bind(this)}
                              returnRoute="maintenance"/>
                          : null}
                    </div>
                </DocumentTitle>
               );
    }
};

ScheduledJobs.propTypes = {
    router: React.PropTypes.func
};

export default exposeRouter(ScheduledJobs);
