import {LinkContainer} from 'react-router-bootstrap';
import {Link as rrLink} from 'react-router';
import {NavItem, MenuItem, Button, ListGroupItem} from 'react-bootstrap';
import {connect} from 'react-redux';
import {encodeContextToURL} from './common/contextEncode.js';


function mapState(state) {
  return {
    selected: state.facility.selected
  }
}

function wrapFacility(Component) {

  class WrapFacility extends React.Component {
    render() {
      if (this.props.params) {
        console.warn("old style Link detected");
      }
      if (!this.props.selected.selectedFacility) {
        // no links will be renderd without facility
        return null;
      } else {
        const {to, ...rest} = this.props;
        let basePath=`/facilities/${encodeContextToURL(this.props.selected)}`;
        // little hacky for now, to be fixed when moving common thing one level higher
        if (location.hash.indexOf('#/mobile') === 0) {
          basePath = '/mobile' + basePath
        }
        let newTo = to;
        if (to.indexOf("/") != 0) {
          newTo=`${basePath}/${this.props.to}`;
        }
        return (<Component {...rest} to={newTo} />);
      }
    }
  }

  return connect(mapState)(WrapFacility);
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

export const NavItemLink = wrapFacility(wrapLink(NavItem));
export const MenuItemLink = wrapFacility(wrapLink(MenuItem));
export const ButtonLink = wrapFacility(wrapLink(Button));
export const ListGroupItemLink = wrapFacility(wrapLink(ListGroupItem));
export const Link = wrapFacility(rrLink);
