import React, {Component} from 'react';
import Icon from 'react-fa';
//const { FaIcon, FaStack } = require('react-fa-icon');

export class IBox extends Component {

  componentDidMount() {
    this.prevAdditionalLoad = false;
    this.additionalLoad = false;
  }

  componentWillReceiveProps(newProps) {
    if (newProps.loading) {
      this.prevAdditionalLoad = this.additionalLoad;
      this.additionalLoad = true;
    }
  }

  render() {
    // put the data into reload function and call it on click
    const {reloadFunction, data, loading} = this.props;
    return (
      <div style={{position: "relative"}}>
        { loading && this.prevAdditionalLoad && this.additionalLoad &&
        <div style={{
          animation: "fadein 0.3s",
          zIndex: "9998",
          position: "absolute",
          backgroundColor: "rgba(0,0,0, 0.5)",
          top: 0,
          bottom: 0,
          left: 0,
          right: 0,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          color: "white"}}>
          <div>Loading...</div>
        </div> }
        <div style={{float: "right", zIndex: "9999", position: "relative"}}>
        { loading
          ? <Icon name="circle-o-notch" spin />
          : <a onClick={() => reloadFunction(data)}><Icon name="circle-o-notch"/></a>}
        </div>
        { this.props.children }
      </div>
    )
  }
}
