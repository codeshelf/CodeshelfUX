import React from 'react';
import {IBox, IBoxTitleBar, IBoxTitleText, IBoxSection} from "components/common/IBox";
import PickRateChart from './PickRateChart';
import PickRateTable from "./PickRateTable";
import moment from 'moment';
import DayOfWeekFilter from 'components/common/DayOfWeekFilter';

import _ from "lodash";
import {getFacilityContext} from "data/csapi";
import {fetchWorkers} from 'data/workers/actions';
import {getWorkersByBadgeId, toWorkerName} from 'data/workers/store';


const priorDayInterval = (daysBack) => {
    let interval = DayOfWeekFilter.priorDayInterval(daysBack);
        interval.start = moment(interval.start); //.hour(6); //6am
        interval.end = moment(interval.end); //.hour(20); //8pm
    return interval;
};

function toD3Data(startTimestamp, endTimestamp, apiData) {
    var hoursOfOperation = _.range(
        moment(startTimestamp).hour(),
        moment(endTimestamp).hour()+1);

    var yProperty = "picks"; //or "quantity";
    return _.chain(apiData)
        .groupBy("workerId")
        .transform((result, workerHourlyRates, key) => {
            let transformed =  _.map(workerHourlyRates, (v) => {
                let utcHour = v.hour;
                let localHour = moment(startTimestamp).utc().hour(utcHour).local().hour();

                return {
                    key: v.workerId,
                    x: localHour,
                    y: v[yProperty],
                    quantity: v.quantity,
                    picks: v.picks
                };
            });

            let missingValues = _.chain(hoursOfOperation)
                .difference(_.pluck(transformed, "x"))
                .map((v) => {
                    return {
                        key: key,
                        x: v,
                        y: 0,
                        quantity: 0,
                        picks: 0
                    };
                }).value();

            let all = _.chain(transformed).concat(missingValues).sortBy("x").value();
            result[key] = {
                key: key,
                values: all
            };
        })
        .values()
        .value();
}


var PickerEventsIBox = React.createClass({
    getInitialState: function() {
        return {
            "interval": priorDayInterval(0),
            "pickRates" : []
        };
    },
    handleChange: function(daysBack) {
        this.setState({interval: priorDayInterval(daysBack)}, () => {
                           this.updateViews(this.state);
                       });
    },

    getPickRates: (startTimestamp, endTimestamp) => {
        return getFacilityContext().getPickRates(startTimestamp.toISOString(), endTimestamp.toISOString());
    },

    updateViews: function(state) {
        let {start, end} = state.interval;
        let workersByBadgeId = getWorkersByBadgeId();
        this.getPickRates(start,  end).then((data) => {
            let d3Data = toD3Data(start, end, data);
            let withWorkerNames = d3Data.map((keyData) => {
                let domainId = keyData.key;
                if (domainId === "null") {
                    domainId = "";
                }
                let worker = workersByBadgeId.get(domainId);
                let name = toWorkerName(worker, domainId);

                keyData.key = name;
                return keyData;
            });
            this.setState({"pickRates": withWorkerNames});
        });
    },

    componentWillMount: function() {
        fetchWorkers({limit: 5000});
        this.updateViews(this.state);
    },

    render: function() {
        var {interval, pickRates} = this.state;
        return (<IBox>
                   <IBoxTitleBar>
                     <IBoxTitleText>
                         Pick Summary
                     </IBoxTitleText>
                   </IBoxTitleBar>
                   <IBoxSection>
                       <DayOfWeekFilter numDays={4} onChange={this.handleChange}/>
                   </IBoxSection>
                   <IBoxSection>
                       <PickRateChart style={{width: '100%', height: '300px'}}
                           startTimestamp={interval.start}
                           endTimestamp={interval.end}
                           pickRates={pickRates} />
                   </IBoxSection>
                   <IBoxSection>
                       <PickRateTable style={{width: '100%', height: '300px'}}
                           startTimestamp={interval.start}
                           endTimestamp={interval.end}
                           pickRates={pickRates} />
                   </IBoxSection>
                </IBox>
        );
    }
});


module.exports = PickerEventsIBox;
