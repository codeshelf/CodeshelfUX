import React from 'react';

// Higher order component exposing router.
// https://medium.com/@dan_abramov/mixins-are-dead-long-live-higher-order-components-94a0d2f9e750
export default function exposeRouter(Component) {

  class ExposeRouter extends React.Component {
    render() {
      const {router} = this.context;
      return <Component {...this.props} router={router} />;
    }
  }

  ExposeRouter.contextTypes = {
    router: React.PropTypes.object.isRequired
  };

  return ExposeRouter;

}
