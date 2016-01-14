import React from 'react';
import Router from 'react-router';
import routes from './routes';

//patch immutable to be compatible with destructuring https://github.com/vacuumlabs/babel-plugin-extensible-destructuring
import {Iterable} from 'immutable';

Iterable.prototype[Symbol.for('get')] = function(value) {return this.get(value); };

require("expose?cli!./scripting/index.js");

// Never render to body. Everybody updates it.
// https://medium.com/@dan_abramov/two-weird-tricks-that-fix-react-7cf9bbdef375
const app = document.getElementById('app');

//Use hash urls
Router.run(routes, (Handler) => {
  React.render(<Handler />, app);
});
