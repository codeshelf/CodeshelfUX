import React, {Component} from 'react';
import {Button} from 'react-bootstrap';

export class Actions extends Component {
  render() {
    const {domainId, acCartAction} = this.props;
    return (
        <Button onClick={(e) => {acCartAction(domainId, "thisone");}}>Do</Button>
    );
  }
}
