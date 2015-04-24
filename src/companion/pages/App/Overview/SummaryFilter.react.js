var React = require('react');
var _ = require('lodash');
import Icon from 'react-fa';

var SummaryFilter = React.createClass({
    render: function() {
        var filterNames = _.compact(this.props.filters);
        var onChangeHandler = this.props.onChange;
            return (<div className="panel-controls">
                      <ul>
                          <li>
                              <div className="dropdown">
                                  <a aria-expanded="false" className="dropdown-toggle" data-toggle="dropdown" href="#" role="button">
                                      <Icon name="filter" />
                                  </a>
                                  <ul className="dropdown-menu pull-right" role="menu">
                                  {
                                      filterNames.map(function(filterName) {
                                         return (<li key={filterName}><a href="#" data-filtername={filterName} onClick={onChangeHandler.bind(null, filterName)}>{filterName}</a> </li>);
                                      })
                                  }
                                  </ul>
                              </div>
                          </li>
                      </ul>
                    </div>);
    }
});

module.exports = SummaryFilter;
