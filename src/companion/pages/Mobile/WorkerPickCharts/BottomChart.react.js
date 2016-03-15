import {Component} from 'react';
import {Panel, Button, ListGroup} from 'react-bootstrap';
import Icon from 'react-fa';
import {WidthWrapper} from "./WidthWrapper.react.js";
import d3 from "d3";
import moment from 'moment';
import ReactFauxDOM from 'react-faux-dom';
import {Map, Record} from "immutable";
import {ListGroupItemLink} from '../../links';
import ListView from "components/common/list/ListView";
import ListManagement from "components/common/list/ListManagement";

export class BottomChart extends Component {

  printChart(node, bins, style) {
    const showBottomLables = this.props.desktop;
    const rangeTo = showBottomLables ? 10 : 0;
    const {height, width, margin} = style;
    const barWidth = width/bins.length;

    // may be used later
    /*const xRange = d3.scale.linear()
        .domain([0, bins.length])
        .range([margin, width - margin])*/
    const yRange = d3.scale.linear()
                           .range([height - 2 * margin, rangeTo])
                           .domain([0,d3.max(bins, (d) => d)])
    const svg = d3.select(node)
      .attr("width", width)
      .attr("height", height + 10);

    let bar = svg.selectAll(".bottom-bar")
        .data(bins)
      .enter().append("g")
        .attr("class", "bottom-bar")
        .attr("transform", (d, i) =>
              "translate(" + i * barWidth + "," + (yRange(d) + rangeTo) + ")")

    bar.append("rect")
          .attr("width", (width - 2 * margin)/bins.length)
          .attr("height", (d) => ((height -  2 * margin) - yRange(d)))
          .attr("fill", "grey");

    if (showBottomLables) {
      bar.append("text")
            .attr("dy", "0.75em")
            .attr("y", -15)
            .attr("x", barWidth/2)
            .attr("text-anchor", "middle")
            .text((d) => d !== 0 ? d : null);
    }

    return node;
  }


  render() {

    const {whatIsLoading, whatIsLoaded, filter, desktop, view} = this.props;
    if (whatIsLoading !== null || whatIsLoaded === null) {
      return null;
    } else {
      //return <div>{this.props.data && JSON.stringify(this.props.data[1])}</div>;
      const WorkerHistogramFilter = Record(Map(filter).set("id", null)
                                                      .toJS()
                                           );

      const columns = ['id'].concat(this.props.data[0]
                                              .bins
                                              .map((bin, index) =>
                                                    index.toString()));
      const results = this.props.data[1].map((obj) => {
        const events = obj.events.bins;
        const result = {
          id: obj.worker.domainId,
        };
        events.map((event, index) => {
          result[index] = event.value;
        })
        return result;
      });
      const columnsMetaData = ListView.toColumnMetadata([{
            columnName: "id",
            displayName: "ID"
        }].concat(this.props.data[0].bins.map((bin, index) => {
          const startTime = moment.utc(bin.start).format('dd HH:mm');
          const endTime = moment.utc(bin.start)
                                .add('minutes', filter.interval.asMinutes())
                                .format('dd HH:mm');
          return {
            columnName: index.toString(),
            displayName: startTime + " - " + endTime,
          }
        })));
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
                      // temporarly disable links
                      const to = desktop ? 'worker' : 'workers';

                      return (
                        <div>
                          <ListGroupItemLink
                              style={{display: "flex", alignItems: "center"}}
                              to={`${to}/${encodeURIComponent(workerId)}/productivity`}
                              onClick={() => this.props.acSetProductivityFilter(
                                          workerId, filterWithId
                                      )}
                              shouldHaveFacility={true}>
                            <div style={{display: "flex",
                                         flexWrap: "wrap"}}>
                              <div style={{textAlign: "left",
                                           width: "100%",
                                           flexShrink: "0"}}>
                                <div>{workerName}</div>
                              </div>
                              <div style={{display: "flex", alignItems: "center"}}>
                                <div style={{}}>{totalEvents}</div>
                                {chart.toReact()}
                              </div>
                            </div>
                            <Icon name="chevron-right"
                                  className="pull-right"
                                  style={{marginTop: "-.25em"}}/>
                          </ListGroupItemLink>
                        </div>
                      );
                    })
                  }
                </ListGroup>)
               : <ListManagement
                      allowExport={true}
                      columns={columns}
                      columnMetadata={columnsMetaData}
                      results={results}/>}
              </div>)}
          </WidthWrapper>
        </Panel>
      );
    }
  }
}
