import React from 'react';
import {IBox, IBoxTitleBar, IBoxTitleText, IBoxSection} from "components/common/IBox";
import PickerEventsChart from './PickerEventsChart';
import PickRateChart from './PickRateChart';
import moment from 'moment';
import DayOfWeekFilter from 'components/common/DayOfWeekFilter';

import _ from "lodash";
import {getFacilityContext} from "data/csapi";

const priorDayStart = DayOfWeekFilter.priorDayStart;
const priorDayEnd = DayOfWeekFilter.priorDayEnd;

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
            "startTimestamp" : priorDayStart(0),
            "endTimestamp" : priorDayEnd(0),
            "pickRates" : []
        };
    },
    handleChange: function(daysBack) {
        this.setState({startTimestamp: priorDayStart(daysBack),
                       endTimestamp: priorDayEnd(daysBack)}, () => {
                           this.updateViews(this.state);
                       });
    },

    getPickRates: (startTimestamp, endTimestamp) => {
        return getFacilityContext().getPickRates(startTimestamp, endTimestamp);
    },

    updateViews: function(state) {
        let {startTimestamp, endTimestamp} = state;
        this.getPickRates(startTimestamp, endTimestamp).then((data) => {
            let d3Data = toD3Data(startTimestamp, endTimestamp, data);
            this.setState({"pickRates": d3Data});
        });
    },

    componentWillMount: function() {
        this.updateViews(this.state);
    },

    render: function() {
        var {startTimestamp, endTimestamp, pickRates} = this.state;
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
                           pickRates={pickRates} />
                   </IBoxSection>
                {/*
                   <IBoxSection>
                       <PickerEventsChart style={{width: '100%', height: '300px'}}
                           apiContext={apiContext}
                           startTimestamp={startTimestamp}
                           endTimestamp={endTimestamp}/>
                   </IBoxSection>
                  */}
                </IBox>
        );
    }
});


module.exports = PickerEventsIBox;
