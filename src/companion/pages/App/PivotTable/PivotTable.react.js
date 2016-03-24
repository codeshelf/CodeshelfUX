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

    //this.topParams = [];
    //this.sideParams = [];

    this.topParams = ['province', 'age'];
    this.sideParams = ['party', 'gender'];

    //this.topParams = [];
    //this.sideParams = ['province', 'age', 'party', 'gender'];

    //this.topParams = ['province', 'age', 'party', 'gender'];
    //this.sideParams = [];

    //this.topParams = ['age', 'party'];
    //this.sideParams = ['gender'];
    
    //this.topParams = ['gender'];
    //this.sideParams = ['age', 'party'];

    //this.topParams = ['gender'];
    //this.sideParams = ['age', 'party'];

    //this.topParams = ['gender', 'party'];
    //this.sideParams = ['age'];

  this.data2 = {
   columns: ['count', 'province', 'age', 'party', 'gender'], 
   data: [
     [0, 'Alberta', '30', 'Bloc Quebecois', 'Male'],
     [5, 'Alberta', '20', 'Conservative', 'Male'],
     [0, 'Alberta', '30', 'Bloc Quebecois', 'Female'],
   ]
  };
}

  render() {
    const {topParams, sideParams, data} = this.props;

    return (
      <table>
        <TopRows {...this.props} data={this.data.data}
                                 topParams={this.topParams}
                                 sideParams={this.sideParams}/>
        {<SideRows {...this.props} data={this.data2.data}
                                 topParams={this.topParams}
                                 sideParams={this.sideParams}
                                 columns={this.data2.columns}/>}
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
    console.info("rows", rows);
    return (
      <thead>
      { topParams.map((param, index) => { 
        return (
          <tr>
            { index === 0 && <th colSpan={sideParams.length} rowSpan={topParams.lenght}></th>}
            { index === topParams.length - 1 && sideParams.map((param) => <th>{param}</th>)}
            { index === topParams.length - 1 && <th rowSpan={sideParams.length} 
                                                    colSpan={topParams.lenght}></th>} 
            <th>{param}</th>
            { rows[index].map((obj) => {return (<th colSpan={obj['colspacing']}>{obj['value']}</th>)}
              )}
          </tr>
        )})

    }</thead>);
  }
}

class SideRows extends Component {

  constructor(props) {
    super(props);
    this.weight = '%weight%';
    this.position = '%position%';
  }

  // set element Weight in map table
  setWeight(dataMap) {
    let weight = 0;
    
    if (!dataMap.size) {
      dataMap.set(this.weight, 1);
      return 1;
    }

    dataMap.forEach((value, key) => {
      weight += this.setWeight(dataMap.get(key));
    })

    dataMap.set(this.weight, weight);
    return weight;
  }

  // set element position in MapTable
  setPosition(dataMap) {
    let position = 0;

    const posRecursive = (dataMap) => {
      
      // if we have only one item it is weight and
      // therefore we are in the end
      if (dataMap.size <= 1) {
        dataMap.set(this.position, position);
        position++;
        return;
      }

      dataMap.forEach((value, key) => {
        if (key !== this.weight) {
          posRecursive(dataMap.get(key))
        }
      })
    };
    posRecursive(dataMap);
  }

  // get Side bar data in Map Form
  getSideBarMap(data, topParams, sideParams, columns) {
    let dataMap = new Map();

    for (let i = 0; i < data.length; i++) {
      this.getMapRecursive(dataMap, i, 0, data, sideParams, columns);
    }

    return dataMap;
  }

  // get Top Bar data in Map form
  getTopBarMap(data, topParams, sideParams, columns) {
    let dataMap = new Map();

    for (let i = 0; i < data.length; i++) {
      this.getMapRecursive(dataMap, i, 0, data, topParams, columns);
    }

    return dataMap;
  }

  // use by getSideBarMap and getTopBarMap
  getMapRecursive(dataMap, i, j, data, params, columns) {
    if (j < params.length) {
      let key = data[i][columns.indexOf(params[j])];
      if (!dataMap.get(key)) {
        dataMap.set(key, new Map());
      }
      this.getMapRecursive(dataMap.get(key), i, j+1, data, params, columns);
    }
  }

  // get Data for inner table without counting total for now
  getInnerTableData(data, sideBarMap, topBarMap, topParams, sideParams, columns) {
    let innerTable = [];
    let width = 0;
    let height = 0;

    data.forEach((row, i) => {
      let t = topBarMap;
      for (let col = 0; col < topParams.length; col++) {
        t = t.get(data[i][columns.indexOf(topParams[col])]);

      }
      const x = t.get(this.position);
      if (x > width) {
        width = x;
      }

      let s = sideBarMap;
      for (let col = 0; col < sideParams.length; col++) {
        s = s.get(data[i][columns.indexOf(sideParams[col])]);
      }
      const y = s.get(this.position);
      if (y > height) {
        height = y;
      }
      if (!innerTable[y]) {
        innerTable[y] = [];
      }
      innerTable[y][x] = data[i][0];
    })

    width++;
    height++;
    return {innerData: innerTable, width, height};
  }

  // fill sideBarTable which is used to determine rowspan
  fillRowspanTable(sideBarMap, offsets, sideBarTable, i) {
    if (i >= offsets.length) {
      return;
    }
    sideBarMap.forEach((value, key) => {
        if (key != this.weight && key != this.position) {
          if (!sideBarTable[offsets[i]]) {
            sideBarTable[offsets[i]] = [];
        }

        sideBarTable[offsets[i]][i] = {value: sideBarMap.get(key).get(this.weight),
                                       name: key};
        offsets[i] += sideBarMap.get(key).get(this.weight);
        }
      
      if (key != this.weight && key != this.position) {
        this.fillRowspanTable(sideBarMap.get(key), offsets, sideBarTable, i+1)
      }
    })
  }  

  render() {
    let {columns, topParams, sideParams, data} = this.props;

    let sideBarMap = this.getSideBarMap(data, topParams, sideParams, columns);
    let topBarMap = this.getTopBarMap(data, topParams, sideParams, columns);
    let sideBarTable = [];
    console.info('sideBar', sideBarMap);
    console.info('topBar', topBarMap);

    this.setWeight(sideBarMap);
    console.info('changed', sideBarMap);

    this.setPosition(sideBarMap);
    console.info('changed', sideBarMap);

    this.setWeight(topBarMap);
    console.info('changed', topBarMap);

    this.setPosition(topBarMap);
    console.info('changed2', topBarMap);

    const {innerData, width, height} = this.getInnerTableData(data, sideBarMap,
                                                              topBarMap, topParams,
                                                              sideParams, columns);
    console.info('innerData', innerData, width, height);

    let offsets = [];
    for (let i = 0; i < sideParams.length; i++) {
      offsets.push(0);
    }
    this.fillRowspanTable(sideBarMap, offsets, sideBarTable, 0);
    console.info('sideBar', sideBarTable);

    const tableStyle = {
      border: '1px solid black'
    };

    const getRows = () => {
      let ret = '';
      let total = 0;
      const bc = '#A6E6EC';
      const fw = 'bold';
        
      let bottomTotals = [];
      for (let i = 0; i < width; i++) {
        bottomTotals[i] = 0;
      }

      for (let i = 0; i < height; i++) {
        ret += '<tr>';

        let currenTotal = 0;
        for (let j = 0; j < sideParams.length + width; j++) {
          if (j < sideParams.length) {
            if (sideBarTable[i] && sideBarTable[i][j]) {
              let pom = sideBarTable[i][j];
              ret += `<td style='background: ${bc}; font-weight: ${fw}' rowSpan=${pom.value}>${pom.name}</td>`;
            }
          } else {
            let cell = (innerData[i][j-sideParams.length] !== undefined) ?
                       innerData[i][j-sideParams.length] : '';
            
            if (sideParams.length && topParams.length) {
              ret += `<td>${cell}</td>`;
            }

            if (cell != '') {
              currenTotal += cell;
              bottomTotals[j-sideParams.length] += cell;
            }
          }
        }
        total += currenTotal;

        if (sideParams.length) {
          ret += `<td style='font-weight: ${fw}'>${currenTotal}</td>`;
        }

        ret += '</tr>';
      }
      ret += '<tr>';

      ret += `<td style='background: ${bc}; font-weight: ${fw}' colSpan=${sideParams.length}>Totals</td>`;
      if (topParams.length) {
        bottomTotals.forEach((value, key) => {
          ret += `<td style='font-weight: ${fw}'>${value}</td>`;
        });
      }
      ret += `<td style='font-weight: ${fw}'>${total}</td>`;
      ret += '</tr>';
      return <div dangerouslySetInnerHTML={{__html: ret}}></div>;
   }

    return (
      <tbody style={tableStyle}>
      {getRows()}
      </tbody>);
  }
}
