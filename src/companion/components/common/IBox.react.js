var React = require("react");
var pluralize = require("lib/pluralize");
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
        return (<h5 style={{float:"none"}}>{this.props.children}</h5>);
    });

var IBoxTitleTools = RClass(function() {
    return (
        <div className="ibox-tools dropdown">
            <a onclick="{showhide();}"> <i className="fa fa-chevron-up"></i></a>
            <a className="dropdown-toggle" href>
            <i className="fa fa-wrench"></i>
            </a>
            <a onclick="closebox()"><i className="fa fa-times"></i></a>
        </div>);
    });

var IBoxTitleBar = RClass(function() {
    return (<div className="ibox-title text-center">
            {this.props.children}
        </div>);
    });

var IBoxSection = RClass(function() {
    return (<div className="ibox-content text-center">
                {this.props.children}
            </div>);
    });

var IBox = RClass(function() {
    return (<div className="ibox float-e-margins">
                {this.props.children}
            </div>);
});

module.exports = {
    IBox: IBox,
    IBoxData: IBoxData,
    IBoxTitleBar: IBoxTitleBar,
    IBoxTitleText: IBoxTitleText,
    IBoxTitleTools: IBoxTitleTools,
    IBoxSection: IBoxSection
};
