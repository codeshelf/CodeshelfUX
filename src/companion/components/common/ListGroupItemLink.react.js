import React from 'react';
import {Link} from 'react-router';
import PureComponent from 'components/common/PureComponent';

export default class ListGroupItemLink extends PureComponent {
    render() {
        return (<Link to={this.props.to}>
                    {this.props.children}
                </Link>);
    }
};
