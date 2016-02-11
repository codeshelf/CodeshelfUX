import  React from "react";
import Icon from 'react-fa';
import _ from "lodash";
import DocumentTitle from "react-document-title";
import ListManagement from "components/common/list/ListManagement";
import {getFacilityContext} from "data/csapi";
import exposeRouter, {toURL} from 'components/common/exposerouter';
import ConfirmAction from 'components/common/ConfirmAction';
import {Button} from 'react-bootstrap';
import {fromJS, Map, List} from "immutable";
import {types, keyColumn, properties} from "data/types/ScheduledJob";
import DateDisplay from "components/common/DateDisplay";

const title = "Scheduled Jobs";
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




function createRowActionComponent(onActionComplete, props) {
  debugger;
  function editRouteFactory(row) {
    return {
      to:  toURL(props, 'maintenance/scheduledjobs/' + row.get("type"))
    };
  }


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
            let usingDefaults = rowData.get("usingDefaults");
            var C = ListManagement.toEditButton(editRouteFactory);
            return (
            <div sytle={{whiteSpace: "nowrap"}}>
                    <C rowData={rowData} />
                    <Button bsStyle="primary" style={{marginLeft: "0.5em"}} onClick={this.trigger.bind(this, type)} title="Trigger"><Icon name="bolt"/></Button>
                    <Button bsStyle="primary" style={{marginLeft: "0.5em"}} onClick={this.cancel.bind(this, type)} title="Stop Run"><Icon name="hand-stop-o"/></Button>
                    {
                      (!usingDefaults) &&
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
                    }
                </div>);
        }

    }
    return ScheduledJobActions;
}

class DateTimeArray extends React.Component {
    render() {
        let utcOffset = getFacilityContext().facility.utcOffset;
        let {cellData, rowData} = this.props;
        let style = (rowData.get("active")) ? {} : {textDecoration: "line-through"};
        return (<span>
            {
                cellData.map((dt) => {
            return <div key={dt} style={style}><DateDisplay cellData={dt} utcOffset={utcOffset} /></div>;
                })
            }
            </span>);
    }
}

class TypeLabel extends React.Component {
    render() {
        let {cellData} = this.props;
        let label = typeLabelMap.get(cellData);
        return (<span data-type={cellData}>{label}</span>);
    }
}


class ScheduledJobs extends React.Component{

    constructor(props) {
        super(props);
        this.state = {
        };
        this.rowActionComponent = createRowActionComponent(this.handleActionComplete.bind(this), props);
        this.columnMetadata = ListManagement.toColumnMetadataFromProperties(properties);
        this.columnMetadata = ListManagement.setCustomComponent("futureScheduled", DateTimeArray, this.columnMetadata);
        this.columnMetadata = ListManagement.setCustomComponent("type", TypeLabel, this.columnMetadata);
    }

    findSchedule(props) {
        let selectedScheduleType = props.params.type;
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
        let timeZoneDisplay = getFacilityContext().facility.timeZoneDisplay;

        let {scheduledJobs: list = List(), scheduledJob: selected} = this.state;

        let {rowActionComponent, columnMetadata} = this;
        let availableTypes = toAvailableTypes(list, allTypes);
        let addButtonRoute = (availableTypes.count() <= 0) ? null : toURL(this.props, 'maintenance/scheduledjobs/new');
        return (<DocumentTitle title={title}>
                   <div>
                       <div>TimeZone: {timeZoneDisplay}</div>
                        <ListManagement
                            results={list}
                            keyColumn={keyColumn}
                            columnMetadata={columnMetadata}
                            rowActionComponent={rowActionComponent}
                            addButtonRoute={addButtonRoute} />
                        {this.props.children &&
                          React.cloneElement(this.props.children, {scheduledJob: selected,
                                                                  availableTypes: availableTypes,
                                                                  onUpdate: this.handleActionComplete.bind(this),
                                                                  onAdd: this.handleActionComplete.bind(this),
                                                                  returnRoute: toURL(this.props, '../../maintenance') })
                        }
                    </div>
                </DocumentTitle>
               );
    }
};

ScheduledJobs.propTypes = {
    router: React.PropTypes.object.isRequired
};

export default exposeRouter(ScheduledJobs);
