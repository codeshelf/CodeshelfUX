var React = require("react");
var pluralize = require("lib/pluralize");
import classNames from "classnames";

function RClass(renderFunction, otherMethods) {
    return React.createClass({
        render: renderFunction
    });
}



export class IBoxData extends React.Component {

    render() {
        var label = pluralize(this.props.dataValue, this.props.dataLabelSingular, this.props.dataLabel);
        return (<h1>
                 {this.props.dataValue} {label}
            </h1>);
    }
};

var IBoxTitleText = RClass(function() {
    /* Note that we are turning off float when no tools but when there are tools we will need to let it float left */
        return (<div className="panel-title">{this.props.children}</div>);
    });

var IBoxTitleBar = RClass(function() {
    return (<div className="panel-heading">
            {this.props.children}
            </div>);
    });

var IBoxSection = RClass(function() {
    return (<div className="ibox-content text-center">
                {this.props.children}
            </div>);
    });

class IBoxBody extends React.Component {
    render() {
       return (<div className="panel-body">
            {this.props.children}
        </div>);
    }
}

var IBox = RClass(function() {
    let classes = classNames("panel", "panel-default", this.props.className);
    let {style} = this.props;
    return (<div data-pages="portlet" className={classes} style={style}>
                {this.props.children}
            </div>);
});

class IBoxControls extends React.Component {
    render() {
        let {onRefresh} = this.props;
        return (
            <div className="panel-controls">
                <ul>
                    <li><a href="#" className="portlet-refresh text-black" data-toggle="refresh"
                            onClick={onRefresh}
                         ><i className="portlet-icon portlet-icon-refresh" title="Refresh"></i></a>
                    </li>
                </ul>
            </div>);
    }
}

export class SingleCellIBox extends React.Component {

    constructor(props) {
        super(props);
        this.refresh = this.refresh.bind(this);
        this.state = {
            "refreshPending" : false
        };

    }

    //called externally
    refresh() {
        this.setState({"refreshPending": true});
        this.props.onRefresh().then(() => this.setState({"refreshPending": false}));
    }

    render() {
        let {title, style, onRefresh} = this.props;
        let {refreshPending} = this.state;
        let progressStyle = {display: (refreshPending) ? "block" : "none"};
        return (
                <IBox style={style}>
                    <IBoxTitleBar>
                        <IBoxTitleText>
                            {title}
                        </IBoxTitleText>
                        {(onRefresh) ?
                            <IBoxControls onRefresh={this.refresh} /> : null
                        }
                    </IBoxTitleBar>
                    <IBoxBody>
                        {this.props.children}
                    </IBoxBody>
                    <div className="portlet-progress" style={progressStyle}>
                        <div className="progress-circle-indeterminate progress-circle-master"></div>
                    </div>
                </IBox>
        );
    }
}


module.exports = {
    IBox: IBox,
    IBoxData: IBoxData,
    IBoxTitleBar: IBoxTitleBar,
    IBoxTitleText: IBoxTitleText,
    IBoxSection: IBoxSection,
    IBoxBody: IBoxBody,
    SingleCellIBox: SingleCellIBox
};
