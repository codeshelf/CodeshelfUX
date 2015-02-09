var React = require('react');

var SummaryFilter = React.createClass({
    render: function() {
        var filterNames = this.props.filters;
        var selectHandler = this.props.selectedFilter;
            return (<div className="ibox-tools">
                <a aria-expanded="false" className="dropdown-toggle" data-toggle="dropdown" href="#">
                    <i className="fa fa-wrench"></i>
                </a>
                <ul className="dropdown-menu dropdown-menu-right dropdown-user ">
                    {
                        filterNames.map(function(filterName) {
                            return (<li key={filterName}><a href="#" data-filtername={filterName} onClick={selectHandler.bind(null, filterName)}>{filterName}</a> </li>);
                        })
                    }
                </ul>
            </div>);
    }
});

module.exports = SummaryFilter;
