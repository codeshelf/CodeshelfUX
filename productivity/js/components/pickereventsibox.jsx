var React = require('react');
var {ButtonGroup, Button} = require('react-bootstrap');
var {IBox, IBoxTitleBar, IBoxTitleText, IBoxSection} = require("components/ibox");
var PickerEventsChart = require('components/pickereventschart');

var ButtonFilter = React.createClass({
    render: function() {
        var {onClick, currentFilter, value} = this.props;
        var wrapperCallback = function() {
            onClick(value);
        };
        return (<Button bsStyle="primary"
                        onClick={wrapperCallback}
                        active={currentFilter == value}>
                    {this.props.children}
                </Button>);
    }

});

var PickerEventsIBox = React.createClass({
    getInitialState: function() {
        return {
            "startTimestamp" : "today",
            "endTimestamp" : "today"
        };
    },
    setStartTimestamp: function(startTimestamp) {
        this.setState({startTimestamp: startTimestamp});
    },
    render: function() {
        var {startTimestamp, endTimestamp} = this.state;
        var {apiContext} = this.props;
        var TODAY = "today";
        var ONEHOUR = "1 hour ago";
        var FOURHOURS = "4 hours ago";
        var ONEWEEK = "1 week ago";
        var buttonFilterProps = {
            onClick: this.setStartTimestamp,
            currentFilter:startTimestamp
        };
        return (<IBox>
                   <IBoxTitleBar>
                     <IBoxTitleText>
                         Pick Events
                     </IBoxTitleText>
                   </IBoxTitleBar>
                   <IBoxSection>
                       <ButtonGroup>
                           <ButtonFilter {...buttonFilterProps} value={TODAY}>Today</ButtonFilter>
                           <ButtonFilter {...buttonFilterProps} value={FOURHOURS}>Last 4 Hours</ButtonFilter>
                           <ButtonFilter {...buttonFilterProps}  value={ONEHOUR}>Last Hour</ButtonFilter>
                       </ButtonGroup>
                   </IBoxSection>
                   <IBoxSection>
                       <PickerEventsChart style={{width: '100%', height: '300px'}}
                                                   apiContext={apiContext}
                                                   startTimestamp={startTimestamp}
                                                   endTimestamp={endTimestamp}/>
                       <PickerEventsChart style={{width: '100%', height: '100px'}}
                                                   apiContext={apiContext}
                                                   startTimestamp="1 week ago"
                                                   endTimestamp={TODAY}/>
                   </IBoxSection>
                </IBox>
        );
    }
});


module.exports = PickerEventsIBox;
