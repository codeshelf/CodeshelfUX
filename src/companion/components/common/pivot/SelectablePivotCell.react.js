/* global module, require, React */
/*jshint eqnull: true*/

'use strict';
import React from 'react';
import _ from 'lodash';
import classNames from 'classnames';
import {extractDimensions, matchDimensions} from "./celldimensions";

export default function selectableCell(Component, selectedFunc) {

    return class SelectableCell extends React.Component {
        selectable(props) {
            let {cell} = props;
            let dimensions = extractDimensions(cell);

            let selected = selectedFunc();
            if (!_.isEmpty(selected)) {
                //compare if all the selectedDimensions match the cell dimensions
                let result = _.reduce(selected, (foundAll, selectedDim) => {
                    let matchSelected = matchDimensions.bind(null, selectedDim);

                    //short circuits match call if already false
                    let result = foundAll && !!_.find(dimensions, matchSelected);
                    return result;
                }, true);
                return result;
            } else {
                return false;
            }
        }

        render() {
            var classes = classNames(this.props.cell.cssclass, {
                selected: this.selectable(this.props)
            });
            this.props.cell.cssclass = classes;
            return <Component {...this.props} />
        }
    };
}
