/*eslint strict:0 */
import React from 'react';
import { DragDropContext } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import 'bootstrap/less/bootstrap.less';
import 'pages/less/pages.less';
require('pdfjs-dist/build/pdf.combined');
require('assets/css/app.styl');

require('imports?this=>window!assets/plugins/modernizr.custom.js');
require("imports?classie=assets/plugins/classie/classie.js!pages/js/pages.js");
import {Iterable} from 'immutable';

Iterable.prototype[Symbol.for('get')] = function(value) {return this.get(value); };

class Root extends React.Component {

    componentDidMount() {

      window.onerror = (errorMsg, url, lineNumber, columnNumber, error) => {
        if (error instanceof URIError) {
          console.error("Error occured: " + errorMsg, error);//or any message
          window.location = "/";
        }
        return false;
      };
   }

   render() {
     return (this.props.children);

   }
};
export default DragDropContext(HTML5Backend)(Root);
