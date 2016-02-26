import {Link as rrLink} from 'react-router';
import {LinkContainer} from 'react-router-bootstrap';
import {NavItem, MenuItem, Button, ListGroupItem} from 'react-bootstrap';
import URI from 'urijs';

function wrapLink(Component) {
  return (props) => {
    return (<LinkContainer {...props}>
                <Component {...props}>
                  {props.children}
                </Component>
            </LinkContainer>);
  };
}

export function toAbsoluteURL(props, pathname) {
  const {location} = props;
  const newUri = new URI(pathname);
  const newURL = newUri.absoluteTo(location.pathname+location.search).toString();
  return newURL;
}

export const NavItemLink = wrapLink(NavItem);
export const MenuItemLink = wrapLink(MenuItem);
export const ButtonLink = wrapLink(Button);
export const ListGroupItemLink = wrapLink(ListGroupItem);
export const Link = rrLink;
