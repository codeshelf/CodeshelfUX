import React from 'react';
import DocumentTitle from 'react-document-title';

export default class WorkResults extends React.Component {

  render() {

/*
    // This is composite component. It load its data from store, and passes them
    // through props, so NewTodo and TodoList can leverage PureComponent.
    const newTodo = getNewTodo();
    const todos = getTodos();
*/
    return (
      <DocumentTitle title="Work Results">
            <p>WorkResults</p>
      </DocumentTitle>
    );
  }

}
