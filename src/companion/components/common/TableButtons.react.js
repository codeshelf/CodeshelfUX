import  React from "react";
import Icon from 'react-fa';
import {LinkContainer} from 'react-router-bootstrap';
import {NavItem, MenuItem, Button, ListGroupItem} from 'react-bootstrap';

function wrapLink(Component) {
  return (props) => {
    return (<LinkContainer {...props}>
            <Component {...props}>
            {props.children}
            </Component>
            </LinkContainer>);
  };
}

const ButtonLink = wrapLink(Button);
export function EditButtonLink(props) {
  return (
      <ButtonLink className="edit" title="Edit" bsStyle="primary" {...props}>
        <Icon name="edit" />
      </ButtonLink>);

  return wrapLink()
}

export function AddButtonLink(props) {
  return (
      <ButtonLink className="add" title="Add" bsStyle="primary" {...props}>
        <Icon name="plus" />
      </ButtonLink>);
}
