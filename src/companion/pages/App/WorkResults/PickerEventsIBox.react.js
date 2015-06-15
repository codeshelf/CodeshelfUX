import React from 'react';
import {IBox, IBoxTitleBar, IBoxTitleText, IBoxSection} from "components/common/IBox";
import PickerEventsChart from './PickerEventsChart';
import PickRateChart from './PickRateChart';
import moment from 'moment';
import DayOfWeekFilter from 'components/common/DayOfWeekFilter';

const priorDayStart = DayOfWeekFilter.priorDayStart;
const priorDayEnd = DayOfWeekFilter.priorDayEnd;

var PickerEventsIBox = React.createClass({
    getInitialState: function() {
        return {
            "startTimestamp" : priorDayStart(0),
            "endTimestamp" : priorDayEnd(0)
        };
    },
    handleChange: function(daysBack) {
        this.setState({startTimestamp: priorDayStart(daysBack),
                       endTimestamp: priorDayEnd(daysBack)});
    },

    render: function() {
        var {startTimestamp, endTimestamp} = this.state;
        var {apiContext} = this.props;
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
                           startTimestamp={startTimestamp}
                           endTimestamp={endTimestamp}/>
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
