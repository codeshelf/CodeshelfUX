import React from "react";
import ReactDOM from 'react-dom';
import bardcode from "bardcode";

export class Barcode extends React.Component {
  componentDidMount() {
    const {value, width, height} = this.props;
    var node = ReactDOM.findDOMNode(this);
    var g = node.getContext("2d");
    g.fillStyle = "white";
    g.fillRect(0, 0, width, height);
    bardcode.drawBarcode(g, value, {
      width: (width - 2),
      quietZoneSize: 0
    });
  }

  render() {
    return (<canvas className="barcode" width={this.props.width} height={this.props.height}></canvas>);
  }
}
