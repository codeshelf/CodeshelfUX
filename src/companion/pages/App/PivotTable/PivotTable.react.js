import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import Immutable from 'immutable';
import classnames from 'classnames';
import Icon from "react-fa";


export default class PivotTable extends Component {
  
  constructor(props) {
    super(props);
    this.data = {
      scheme: {'province': {'agebin': { 'party': {'gender': 'count'}}}},
      data: {'Alberta' : 
              {'30': 
                {'Bloc Quebecois' :
                  {'Male' : 0,
                   'Female': 0},
                 'Conservative' :
                  {'Male' : 5,
                  'Female': 1}
                },
                '20':
                {'Bloc Quebecois' :
                  {'Male' : 0,
                   'Female': 0},
                 'Conservative' :
                  {'Male' : 5,
                  'Female': 1}
                },
              }
          }
        }
    this.topParams = ['province', 'age', 'party'];
    this.sideParams = ['gender'];
  }

  render() {
    const {topParams, sideParams, data} = this.props;
    return (
      <table>
        <TopRows {...this.props} data={this.data.data} topParams={this.topParams} sideParams={this.sideParams}/>
      </table>
    )
  }
}

class TopRows extends Component {

  render() {
    let {topParams, sideParams, data} = this.props;
    const topRows = [];
    const rows = [];

    let index = 0;
    for (let param in topParams) {
      const tmpVal = [];
      const newObj = {};
      let num = 0;
      for (let key in data) {
        const tmp = data[key];
        for (let key2 in tmp) {
          newObj[key2 + "%" + num] = tmp[key2]; // for 'uniqueness'
          num++;
        }
        const spacing = index !== topParams.length - 1 ? Object.keys(data[key]).length : 1;
        tmpVal.push({value: key.split('%')[0], colspacing: spacing}); // parse just real key
      }
      rows.push(tmpVal);
      data = newObj;
      index++;
    }
    console.info(topRows, rows);
    return (
      <div>
      { topParams.map((param, index) => { 
        return (
          <tr>
            { index === 0 && <th colSpan={sideParams.length} rowSpan={topParams.lenght}></th>}
            { index === topParams.length - 1 && sideParams.map((param) => <th>{param}</th>)}
            { index === topParams.length - 1 && <th rowSpan={sideParams.length} colSpan={topParams.lenght}></th>)} 
            <th>{param}</th>
            { rows[index].map((obj) => {return (<th colSpan={obj['colspacing']}>{obj['value']}</th>)}
              )}
          </tr>
        )})

    }</div>)
  }
}
