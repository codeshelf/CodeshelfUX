import React from 'react';
import {Row, Col} from 'components/common/pagelayout';
import {IBox, IBoxTitleBar, IBoxTitleText, IBoxSection} from "components/common/IBox";
import {MultiSelect} from 'components/common/Form';

import PickRateTable from "./PickRateTable";
import EventSearch from "./EventSearch";
import moment from 'moment';
import DayOfWeekFilter from 'components/common/DayOfWeekFilter';

import _ from "lodash";
import {getAPIContext} from "data/csapi";
import {fetchWorkers} from 'data/workers/actions';
import {getWorkersByBadgeId, toWorkerName} from 'data/workers/store';
import WorkerPickCharts from '../../Mobile/WorkerPickCharts/WorkerPickCharts.react'

function toD3Data(createdInterval, apiData) {
    var hoursOfOperation = _.range(
      moment(createdInterval.start).hour(),
      moment(createdInterval.end).hour()+1);

    var yProperty = "picks"; //or "quantity";
    return _.chain(apiData)
        .groupBy("workerId")
        .transform((result, workerHourlyRates, key) => {
            let transformed =  _.map(workerHourlyRates, (v) => {
                let utcHour = v.hour;
                  let localHour = moment(createdInterval.start).utc().hour(utcHour).local().hour();

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
          "pickRates" : [],
          "interval" : {}
        };
    },

    handleSubmit: function(filter) {
      let createdInterval = filter.get("createdInterval");
      let params = filter.merge({
          createdInterval: createdInterval.toQueryParameterValue()
      }).toJS();
      this.setState({interval: createdInterval});
      return getAPIContext().getPickRates(params).then((data) => {
        let workersByBadgeId = getWorkersByBadgeId();
        let d3Data = toD3Data(createdInterval, data);
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
        return withWorkerNames;
      });
    },

    componentWillMount: function() {
        fetchWorkers({limit: 5000});
    },

    render: function() {
        var {interval, pickRates} = this.state;
        return (<IBox>
                   <IBoxSection>
                       <WorkerPickCharts
                            {...this.props}
                            desktop={true}
                            expand={false}/>
                   </IBoxSection>
                </IBox>
        );
    }
});


module.exports = PickerEventsIBox;
