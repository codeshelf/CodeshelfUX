import * as actions from './actions';
import {Range, Record} from 'immutable';
import {getRandomString} from '../../lib/getrandomstring';
import {newTodoCursor, todosCursor} from '../state';
import {register} from '../dispatcher';

// Isomorphic store has to be state-less.

const Facility = Record({
  id: '',
  name: ''
});

export const dispatchToken = register(({action, data}) => {

  let todo;

  switch (action) {
    case actions.updatedFacilities:
      facilitiesCursor(todos => todos.clear());
      break;

    case actions.addHundredTodos:
      todosCursor(todos => {
        return todos.withMutations(list => {
          Range(0, 100).forEach(i => {
            const id = getRandomString();
            list.push(new TodoItem({
              id: id,
              title: `Item #${id}`
            }).toMap());
          });
        });
      });
      break;
  }

});

export function getSelectedFacility() {
  return newSelectedFacilityCursor();
};
