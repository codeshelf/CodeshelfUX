import React, {Component} from 'react';
import HistogramChart from '../../WorkerPickCharts/HistogramChart.react';


export class Productivity extends Component {

  render() {
    return (
        <HistogramChart
          expanded={false}
          limit={12}
          interval={this.props.chartFilter.interval}
          pickRates={this.props.chartData[1]}
          chartStyle={{
            height: width/2.5,
            width: width,
            barWidth: 60,
            margins: {
              top: 20,
              right: 20,
              bottom: 20,
              left: 50,
            },
          }}
        />
    );
  }
}