import {LinkContainer} from 'react-router-bootstrap';
import {Link as rrLink} from 'react-router';
import {NavItem, MenuItem, Button, ListGroupItem} from 'react-bootstrap';
import {connect} from 'react-redux';
import {encodeContextToURL} from '../pages/Mobile/common/contextEncode.js';


function mapState(state) {
  return {
    selected: state.facility && state.facility.selected
  }
}

function includeContext(Component) {

  class IncludeContext extends React.Component {
    render() {
      if (this.props.params) {
        console.warn("old style Link detected");
      }
      const {selected, shouldHaveFacility} = this.props;
      if (!selected && this.props.shouldHaveFacility) {
        // no links will be renderd without facility
        return null;
      }
      else if (!selected && !this.props.shouldHaveFacility) {
        let {to, ...rest} = this.props;
        const basePath= location.hash.indexOf('#/mobile') === 0 ? '/mobile' : '';
        if (to.indexOf("/") != 0) {
          to=`${basePath}/${this.props.to}`;
        }
        return (<Component {...rest} to={to} />);
      }
      else {
        const {to, ...rest} = this.props;
        let basePath=`/facilities/${encodeContextToURL(selected)}`;
        // little hacky for now, to be fixed when moving common thing one level higher
        if (location.hash.indexOf('#/mobile') === 0) {
          basePath = '/mobile' + basePath;
        }
        let newTo = to;
        if (to.indexOf("/") != 0) {
          newTo=`${basePath}/${this.props.to}`;
        }
        return (<Component {...rest} to={newTo} />);
      }
    }
  }

  return connect(mapState)(IncludeContext);
}

function wrapLink(Component) {
  return (props) => {
    return (<LinkContainer {...props}>
                <Component {...props}>
                  {props.children}
                </Component>
            </LinkContainer>);
  }
}

export const NavItemLink = includeContext(wrapLink(NavItem));
export const MenuItemLink = includeContext(wrapLink(MenuItem));
export const ButtonLink = includeContext(wrapLink(Button));
export const ListGroupItemLink = includeContext(wrapLink(ListGroupItem));
export const Link = includeContext(rrLink);
