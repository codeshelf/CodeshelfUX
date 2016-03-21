import React, {Component} from 'react';
import {Link} from '../../links.js';
import {Button} from 'react-bootstrap';
import Icon from 'react-fa';


function renderSingleField(value, description, formatter) {
  const stringValue = (value) ? value.toString() : value;
  const renderedValue = (!formatter ) ? stringValue :  formatter(value);
  return (

    [
        <dt key={description} >{description}</dt>,
        <dd key={description + "-v"} >{renderedValue}</dd>
                                                                                  ]
    );
}

function renderMultiField(field, itemData, description, formatter) {
  // multi field
  if (!formatter) throw "Missing formatter for multifield " + field;
  const values = {};
  field.split("+").forEach((oneField) => values[oneField] = itemData[oneField]);
  return renderSingleField(values, description, formatter);
}

export function renderField(field, itemData, fieldDescriptions, fieldFormatters) {
  if (field.indexOf("+") == -1) {
    // normal field
    return renderSingleField(itemData[field], fieldDescriptions[field], fieldFormatters[field]);
  } else {
    // multi field
    const formatter = fieldFormatters[field];
    const description = fieldDescriptions[field];
    return renderMultiField(field, itemData, description, formatter);
  }
}

export function workerIdFormatter(workerId) {
  if (!workerId) return workerId;
  return (
      <Link to={`worker/${encodeURIComponent(workerId)}`} shouldHaveFacility={true}>
        {workerId}
      </Link>
  );
}

export function workerNameFormatter({workerId, workerName}) {
  if (!workerId) return <span>{workerName}</span>;
  return (
    <Link to={`worker/${encodeURIComponent(workerId)}`} onClick={(e) => e.stopPropagation()} shouldHaveFacility={true}>
        {workerName}
    </Link>
);
}

export function deviceFormatter({deviceName, deviceGuid}) {
  const shortGuid = deviceGuid && parseInt(deviceGuid, 16).toString(16).toUpperCase();
  return (<span>{`${deviceName}/0x${shortGuid}`}</span>);
}

export function deviceLinkFormatter({deviceName, deviceGuid}) {
    if (!deviceName) return deviceFormatter({deviceName, deviceGuid});
    return (<Link to={`carts/${deviceName}`} shouldHaveFacility={true}>
        {deviceFormatter({deviceName, deviceGuid})}
    </Link>);

}

export function orderLinkFormatter(orderId) {
  if (!orderId) return orderId;
  return (
      <Link to={`orders/${orderId}`} shouldHaveFacility={true}>
      {orderId}
    </Link>
  );
}
