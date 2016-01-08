import React, {Component} from 'react';
import {Panel, Tabs, Tab, Row, Col, Button, ListGroup, ListGroupItem, Badge} from 'react-bootstrap';
import Icon from 'react-fa';
import {WidthWrapper} from "./WidthWrapper.react.js";

import { NavItemLink, MenuItemLink, ButtonLink, ListGroupItemLink} from '../links';
import { Sparklines, SparklinesBars, SparklinesReferenceLine} from 'react-sparklines';

export class BottomChart extends Component {

  render() {
    const {whatIsLoading, whatIsLoaded} = this.props;
    if (whatIsLoading !== null || whatIsLoaded === null) {
      return null;
    } else {
      //return <div>{this.props.data && JSON.stringify(this.props.data[1])}</div>;
      return (
        <Panel header="Worker Picks">
          <WidthWrapper>{(width) => (
            <ListGroup>
              {
                this.props.data[1].map((oneWorkerData) => {
                  const workerId = oneWorkerData.worker.domainId;
                  const eventBins = oneWorkerData.events.bins.map(({value}) => value);
                  const totalEvents = oneWorkerData.events.total;
                  return (
                    <ListGroupItemLink to="mobile-worker-datail" params={{id: workerId}}>
                      <span style={{marginRight: "0.5em"}}>{totalEvents}</span>
                      <Sparklines data={eventBins} limit={24} min={0} width={width-80} height={20} margin={0} >
                        <SparklinesBars />
                        {/*<SparklinesReferenceLine type="custom" value={6.6}/>*/}
                      </Sparklines>
                      <Icon name="chevron-right" className="pull-right" style={{marginTop: "0.5em"}}/>
                    </ListGroupItemLink>
                  );
                })
              }
            </ListGroup>
          )}</WidthWrapper>
        </Panel>
      );
    }
  }
}
