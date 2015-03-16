var React = require('react');
var _ = require('lodash');

var SummaryFilter = React.createClass({
    render: function() {
        var filterNames = _.compact(this.props.filters);
        var onChangeHandler = this.props.onChange;
            return (<div className="ibox-tools">
                <a aria-expanded="false" className="dropdown-toggle" data-toggle="dropdown" href="#">
                    <i className="fa fa-filter"></i>
                </a>
                <ul className="dropdown-menu dropdown-menu-right dropdown-user ">
                    {
                        filterNames.map(function(filterName) {
                            return (<li key={filterName}><a href="#" data-filtername={filterName} onClick={onChangeHandler.bind(null, filterName)}>{filterName}</a> </li>);
                        })
                    }
                </ul>
            </div>);
    }
});

module.exports = SummaryFilter;
