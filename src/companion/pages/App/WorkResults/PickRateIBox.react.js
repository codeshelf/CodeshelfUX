var React = require('react');
var {IBox, IBoxTitleBar, IBoxTitleText, IBoxSection} = require("components/common/IBox");
var PickRateChart = require('./PickRateChart');


var PickerRatesIBox = React.createClass({
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
        return (<IBox>
                   <IBoxTitleBar>
                     <IBoxTitleText>
                         Pick Rates
                     </IBoxTitleText>
                   </IBoxTitleBar>
                   <IBoxSection>
                       <PickRateChart style={{width: '100%', height: '300px'}}
                                                   apiContext={apiContext}
                                                   startTimestamp={startTimestamp}
                                                   endTimestamp={endTimestamp}/>
                   </IBoxSection>
                </IBox>
        );
    }
});


module.exports = PickerRatesIBox;
