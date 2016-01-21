import React, {Component} from 'react';

export function renderField(description, value, formatter) {
  return (
    [
        <dt key={description} >{description}</dt>,
        <dd key={description + "-v"} >{!formatter? value : formatter(value)}</dd>
                                                                                  ]
    );
}
