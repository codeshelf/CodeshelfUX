import React, {Component} from 'react';
import Icon from 'react-fa';
import {Button} from "react-bootstrap";
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
          backgroundColor: "rgba(255,255,255, 0.80)",
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
        <div style={{float: "right", position: "relative"}}>
          <Button
              bsStyle="link"
              onClick={() => reloadFunction(data)}
              disabled={loading}>
            <Icon name="refresh" spin={loading} />
          </Button>
        </div>
        { this.props.children }
      </div>
    )
  }
}
