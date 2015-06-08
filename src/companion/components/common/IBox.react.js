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
       return (<div className="panel-pody">
            {this.props.children}
        </div>);
    }
}

var IBox = RClass(function() {
    let classes = classNames("panel", "panel-default", this.props.className);
    return (<div data-pages="portlet" className={classes}>
                {this.props.children}
            </div>);
});

export class SingleCellIBox extends React.Component {
    render() {
        let {title} = this.props;
        return (
                <IBox>
                    <IBoxTitleBar>
                        <IBoxTitleText>
                            {title}
                        </IBoxTitleText>
                    </IBoxTitleBar>
                    <IBoxBody>
                        {this.props.children}
                    </IBoxBody>
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
