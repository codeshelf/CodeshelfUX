import React, {Component} from 'react';

export class FieldRenderer extends Component {
  render() {
    const {description, value, formater} = this.props;
    return (
      <div>
        {description} - {!formater? value : formater(value)}
      </div>
    );
  }
}