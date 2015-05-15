import React from 'react';
import {ButtonGroup, Button} from 'react-bootstrap';
import {IBox, IBoxTitleBar, IBoxTitleText, IBoxSection} from "components/common/IBox";
import PickerEventsChart from './PickerEventsChart';
import PickRateChart from './PickRateChart';
import moment from 'moment';
import DayOfWeekFilter from './DayOfWeekFilter';

var PickerEventsIBox = React.createClass({
    getInitialState: function() {
        return {
            "startTimestamp" : "today",
            "endTimestamp" : "today"
        };
    },
    handleChange: function(dayOfWeek) {
        this.setState({startTimestamp: dayOfWeek,
                       endTimestamp: dayOfWeek});
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
                       <PickerEventsChart style={{width: '100%', height: '300px'}}
                                                   apiContext={apiContext}
                                                   startTimestamp={startTimestamp}
                                                   endTimestamp={endTimestamp}/>
                   </IBoxSection>
                {/*
                   <IBoxSection>

                       <PickRateChart style={{width: '100%', height: '300px'}}
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
