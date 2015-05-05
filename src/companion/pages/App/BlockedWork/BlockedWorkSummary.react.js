import PureComponent from 'components/common/PureComponent';
import React from 'react';
import immutable from 'immutable';
import {ListGroup, Badge} from 'react-bootstrap';
import ListGroupItemLink from 'components/common/ListGroupItemLink.react';


export default class BlockedWorkSummary extends PureComponent {

  render() {
    return (
        <ListGroup>
            {
                this.props.summaries.map((summary, i) => {
                    return <ListGroupItemLink
                    key={summary.get("type")}
                    to={summary.get("type")} >
                        {summary.get("description")}
                        <Badge>{summary.get("total")}</Badge>
                        </ListGroupItemLink>;

                })
            }
        </ListGroup>
    );
  }

};

// Note only static methods can be defined in a class, no object props.
// https://github.com/babel/babel/issues/57#issuecomment-58834201
BlockedWorkSummary.propTypes = {
  summaries: React.PropTypes.instanceOf(immutable.List)
};
