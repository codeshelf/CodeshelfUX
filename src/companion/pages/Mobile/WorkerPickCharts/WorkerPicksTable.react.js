import {Component} from 'react';
import {Panel, Button, ListGroup} from 'react-bootstrap';
import Icon from 'react-fa';
import {WidthWrapper} from "./WidthWrapper.react.js";
import ReactFauxDOM from 'react-faux-dom';
import {Map, Record} from "immutable";
import {ListGroupItemLink} from '../../links';

export class WorkerPicksTable extends Component {

  render() {
    const {whatIsLoading, whatIsLoaded, filter, desktop, view} = this.props;
    if (whatIsLoading !== null || whatIsLoaded === null) {
      return null;
    } else {
      //return <div>{this.props.data && JSON.stringify(this.props.data[1])}</div>;
      const WorkerHistogramFilter = Record(Map(filter).set("id", null).toJS());
      return (
        <Panel header="Worker Picks">
          <WidthWrapper>
          {(width) => (
            <div>
              {desktop &&
                <Button bsStyle="link" onClick={() => this.props.acToggleView()}>
                  Change view
                </Button>}
              {view === 'graph'
               ? (<ListGroup>
                  {
                    this.props.data[1].map((oneWorkerData) => {
                      const workerId = oneWorkerData.worker.domainId;
                      const workerName = oneWorkerData.worker.name;
                      const eventBins = oneWorkerData.events.bins.map(({value}) => value);
                      const totalEvents = oneWorkerData.events.total;
                      const style = {
                        width: width-85,
                        height:20,
                        margin:0
                      };
                      const chart = this.printChart(ReactFauxDOM.createElement('svg'),
                                                    eventBins, style);
                      const filterWithId = WorkerHistogramFilter(filter).set("id", workerId);
                      const to = desktop ? 'worker': 'workers';
                      // temporarly disable links
                      return (
                          <div>
                            <ListGroupItemLink
                                style={{display: "flex", alignItems: "center"}}
                                to={`${to}/${encodeURIComponent(workerId)}/productivity`}
                                onClick={() => this.props.acSetProductivityFilter(workerId,
                                                                                  filterWithId)}
                                shouldHaveFacility={true}>
                              <div style={{display: "flex", flexWrap: "wrap"}}>
                                <div style={{textAlign: "left", width: "100%", flexShrink: "0"}}>
                                  <div>{workerName}</div>
                                </div>
                                <div style={{display: "flex", alignItems: "center"}}>
                                  <div style={{}}>{totalEvents}</div>
                                  {chart.toReact()}
                                </div>
                              </div>
                              <Icon name="chevron-right" className="pull-right"
                                    style={{marginTop: "-.25em"}}/>
                            </ListGroupItemLink>
                          </div>
                      );
                    })
                  }
                </ListGroup>)
               : <WorkerPicksTable></WorkerPicksTable>}
              </div>)}
          </WidthWrapper>
        </Panel>
      );
    }
  }
}
