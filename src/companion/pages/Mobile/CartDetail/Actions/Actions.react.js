import React, {Component} from 'react';
import {Button} from 'react-bootstrap';

export class Actions extends Component {
  render() {
    const {id, acCartAction} = this.props;
    return (
        <Button bsStyle="primary" onClick={(e) => {acCartAction(id, "thisone");}}>Do</Button>
    );
  }
}
