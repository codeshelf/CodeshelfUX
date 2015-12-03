import React from "react";

export default class RelativeTimeDisplay extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            intervalToken: null
        };
    }

    componentDidMount(){
        let token = setInterval(() => {
            this.forceUpdate();
        }, 1000 * 30);
        this.setState({intervalToken: token});
    }

    componentWillUnmount() {
        if (this.state.intervalToken) {
            clearInterval(this.state.intervalToken);
        }
    }

    render() {
        var time = this.props.time;
        return <span title={time.local().format()}>{time.local().fromNow()}</span>
    }
}
RelativeTimeDisplay.displayName = "RelativeTimeDisplay";
