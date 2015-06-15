import React from 'react';
import {ButtonGroup, Button} from 'react-bootstrap';
import {IBox, IBoxTitleBar, IBoxTitleText, IBoxSection} from "components/common/IBox";
import PickerEventsChart from './PickerEventsChart';
import PickRateChart from './PickRateChart';
import moment from 'moment';
import DayOfWeekFilter from './DayOfWeekFilter';

function priorDay(daysBack) {
    return moment().subtract(daysBack, 'days');
}

var PickerEventsIBox = React.createClass({
    getInitialState: function() {
        return {
            "startTimestamp" : moment().local().startOf('day').toISOString(),
            "endTimestamp" : moment().local().endOf('day').toISOString()
        };
    },
    handleChange: function(daysBack) {
        this.setState({startTimestamp: priorDay(daysBack).local().startOf('day').toISOString(),
                       endTimestamp: priorDay(daysBack).local().endOf('day').toISOString()});
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
                       <ButtonGroup>
                           <DayOfWeekFilter numDays={4} onChange={this.handleChange}/>
                       </ButtonGroup>
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
