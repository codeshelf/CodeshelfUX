var React = require('react');
import {DropdownButton, MenuItem} from 'react-bootstrap';
var _ = require('lodash');
import Icon from 'react-fa';

var SummaryFilter = React.createClass({
    render: function() {
        var filterNames = _.compact(this.props.filters);
        var onChangeHandler = this.props.onChange;
            return (<div className="panel-controls">
                      <ul>
                          <li>
                              <DropdownButton data-toggle={true} navItem={true} pullRight={true} noCaret={true} title={<Icon name="filter"  />}>
                                    {
                                        filterNames.map(function(filterName) {
                                            return (
                                                    <MenuItem eventKey={filterName}
                                                     key={filterName}
                                                     onClick={onChangeHandler.bind(null, filterName)}>
                                                    {filterName}
                                                </MenuItem>);
                                        })
                                    }
                              </DropdownButton>
                          </li>
                      </ul>
                    </div>);
    }
});

module.exports = SummaryFilter;
