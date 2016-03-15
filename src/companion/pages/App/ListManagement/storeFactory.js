import {Map, Record, fromJS, List, Iterable} from 'immutable';

import {getFacilityContextFromState} from "../../Facility/get";

const defaultMutate = (data) => {
  if (data && Iterable.isIterable(data)) {
    return data.toJS();
  }
  return data;
}

const defaultUpdateItemCond = (item, action) => {
  if (item.id === action.data.id) {
    return action.data;
  }
  return item;
}

const getDefaultListDataFormat = (data) => {
  return data;
}

/*
  getItems: function responsible for retreiving items
  addItem: function responsible for adding single item
  updateItem: function responsible for updating single item 
  useFacility: boolean which reflects if api functions use facilityContext
  mutateGet/Add/Update/Data: functions which mutate data to suitable form for api calls
  getDataFormat: function which return spec data part for getItems section
  updateItemCond: function representing condition for map in updateItem section
*/
export function createStore({storeName,
                            getItems,
                            addItem,
                            updateItem,
                            useFacility = false,
                            getDataFormat = getDefaultListDataFormat,
                            mutateGetData = defaultMutate,
                            mutateAddData = defaultMutate,
                            mutateUpdateData = defaultMutate,
                            updateItemCond = defaultUpdateItemCond,
                            columns,
                            sortSpecs
                            }) {

  const LOADING_STARTED = "LOADING_STARTED";
  const LOADING_OK = "LOADING_OK";
  const LOADING_ERROR = "LOADING_ERROR";

  const GET_ITEMS = "GET_ITEMS";
  const ADD_ITEM = "ADD_ITEM";
  const UPDATE_ITEM = "UPDATE_ITEM";

  const UPDATE_FORM = "UPDATE_FORM";
  const STORE_FORM = "STORE_FORM";
  const UNSET_ERROR = "UNSET_ERROR";

  const initState = new (Record({
    items: new Map({
      data: [],
      error: null,
      loading: null
    }),
    addItem: new Map({
      loading: null,
      error: null
    }),
    updateItem: new Map({
      loading: null,
      error: null,
      data: null
    }),
    itemForm: null,
    table: {
      columns: columns ? columns : [],
      sortSpecs: sortSpecs ? sortSpecs : []
    }
  }));

  const listReducer = (state = initState, action) => {
      let newState = actionReducer(state, action);
      if (!newState) {
        return state;
      } else {
        return newState;
      }
  }

  const actionReducer = (state = initState, action) => {
      switch (action.type) {
        case GET_ITEMS: {
            switch (action.status) {
              case LOADING_STARTED: {
                  return state.mergeIn(['items'], new Map({
                    data: [],
                    loading: true,
                    error: null,
                  }));
              }
              case LOADING_OK: {
                  return state.mergeIn(['items'], new Map({
                    data: getDataFormat(action.data),
                    loading: null,
                    error: null,
                  }));
              }
              case LOADING_ERROR: {
                  return state.mergeIn(['items'], new Map({
                    data: [],
                    loading: null,
                    error: action.data,
                  }));
              }
            }
        }
        case ADD_ITEM: {
            switch (action.status) {
              case LOADING_STARTED: {
                  return state.mergeIn(['addItem'], new Map({
                    loading: true,
                    error: null
                  }));
              }
              case LOADING_OK: {
                  const data = state.items.get('data');
                  data.push(action.data);
                  
                  return state.merge({ 
                    addItem: {
                      loading: null,
                      error: null
                    },
                    items: {...state.items, data}
                  });
              }
              case LOADING_ERROR: {
                  return state.mergeIn(['addItem'], new Map({
                    loading: null,
                    error: action.data,
                  }));
              }
            }
        }
        case UPDATE_ITEM: {
            switch (action.status) {
              case LOADING_STARTED: {
                  return state.mergeIn(['updateItem'], new Map({
                    data: null,
                    loading: true,
                    error: null
                }));
              }
              case LOADING_OK: {
                const data = state.items.get('data');
                const newData = data.map((item) => {
                  return updateItemCond(item, action);
                });
                const newState = state.merge(new (Record({ 
                    updateItem: new Map({
                        data: action.data,
                        loading: null,
                        error: null
                    }),
                    items: state.items.set('data', newData)
                })));
                return newState;
              }
              case LOADING_ERROR: {
                return state.mergeIn(['updateItem'], new Map({
                  data: null,
                  loading: null,
                  error: action.data
                }));
              }
            }
        }
        case STORE_FORM: {
            return state.set('itemForm', action.data);
        }
        case UPDATE_FORM: {
            return state.setIn(['itemForm', action.fieldName], action.value);
        }
        case UNSET_ERROR: {
            return state.setIn(['updateItem', 'error'], null)
                        .setIn(['addItem', 'error'], null);
        }
        default: 
          return state;
      }
  }


  const acLoadItems = (params) => {
    if (useFacility) {
      return acLoadWithFacility(params);
    } else {
      return acLoadWithoutFacility(params);
    }
  }

  const acLoadWithFacility = (params) => {
    return (dispatch, getState) => {
        dispatch(setStatus(GET_ITEMS, LOADING_STARTED));

        const facilityContext = getFacilityContextFromState(getState());
        if (!facilityContext) {
            console.info("Error");
            //dispatch(getError(`Want to get items but no facility context is provided`));
            return;
        }

        let mutData = mutateAddData(params)
        if (!Array.isArray(mutData)) {
          mutData = [mutData];
        }

        facilityContext[getItems](...mutData).then((data) => {
            console.log(`data from getItems`, data);
            dispatch(setStatus(GET_ITEMS, LOADING_OK, data));
        }).catch((e) => {
            console.log(`error from getItems`, e);
            dispatch(setStatus(GET_ITEMS, LOADING_ERROR, e.status));
        });
    }
  }

  const acLoadWithoutFacility = (params) => {
    return (dispatch, getState) => {
        dispatch(setStatus(GET_ITEMS, LOADING_STARTED));

        let mutData = mutateAddData(params)
        if (!Array.isArray(mutData)) {
          mutData = [mutData];
        }

        return getItems(...mutData).then((data) => {
          console.log(`data from getItems`, data);
          dispatch(setStatus(GET_ITEMS, LOADING_OK, data));
        }).catch((e) => {
          console.log(`error from getItems`, e);
          dispatch(setStatus(GET_ITEMS, LOADING_ERROR, e.status));
        });
      }
  }

  const acAddItem = (itemForm) => {
    if (useFacility) {
      return acAddWithFacility(itemForm);
    } else {
      return acAddWithoutFacility(itemForm);
    }
  }

  const acAddWithFacility = (itemForm) => {
    return (dispatch, getState) => {
        dispatch(setStatus(ADD_ITEM, LOADING_STARTED));

        const facilityContext = getFacilityContextFromState(getState());
        if (!facilityContext) {
          dispatch(setStatus(ADD_ITEM, LOADING_ERROR,
                  `Want to update worker but no facility context is provided`));
          return;
        }

        let mutData = mutateAddData(itemForm)
        if (!Array.isArray(mutData)) {
          mutData = [mutData];
        }

        return facilityContext[addItem](...mutData).then((data) => {
          console.log(`data from add item`, data);
          dispatch(setStatus(ADD_ITEM, LOADING_OK, data));
        }).catch((e) => {
          console.log(`error from add item`, e);
          dispatch(setStatus(ADD_ITEM, LOADING_ERROR, e.status));
        });
     }
  }

  const acAddWithoutFacility = (itemForm) => {
    return (dispatch, getState) => {
        dispatch(setStatus(ADD_ITEM, LOADING_STARTED));

        let mutData = mutateAddData(itemForm)
        if (!Array.isArray(mutData)) {
          mutData = [mutData];
        }

        return addItem(...mutData).then((data) => {
           console.log(`data from add item`, data);
           dispatch(setStatus(ADD_ITEM, LOADING_OK, data));
        }).catch((e) => {
           console.log(`error from add item`, e);
           dispatch(setStatus(ADD_ITEM, LOADING_ERROR, e.status));
        });
    }
  }

  const acUpdateItem = (itemForm) => {
    if (useFacility) {
      return acUpdateWithFacility(itemForm);
    } else {
      return acUpdateWithoutFacility(itemForm);
    }
  }

  const acUpdateWithFacility = (itemForm) => {
    return (dispatch, getState) => {
        dispatch(setStatus(UPDATE_ITEM, LOADING_STARTED));

        const facilityContext = getFacilityContextFromState(getState());
        if (!facilityContext) {
            dispatch(setStatus(UPDATE_ITEM, LOADING_ERROR,
                     `Want to update worker but no facility context is provided`));
            return;
        }
        let mutData = mutateUpdateData(itemForm)
        if (!Array.isArray(mutData)) {
          mutData = [mutData];
        }

        return facilityContext[updateItem](...mutData).then((data) => {
            console.log(`data from updateItem`, data);
            dispatch(setStatus(UPDATE_ITEM, LOADING_OK, data));
        }).catch((e) => {
            console.log(`error from updateItem`, e);
            dispatch(setStatus(UPDATE_ITEM, LOADING_ERROR, e.status));
        });
    }
  }

  const acUpdateWithoutFacility = (itemForm) => {
    return (dispatch, getState) => {
      dispatch(setStatus(UPDATE_ITEM, LOADING_STARTED));

      let mutData = mutateUpdateData(itemForm)
      if (!Array.isArray(mutData)) {
        mutData = [mutData];
      }

      return updateItem(...mutData).then((data) => {
        console.log(`data from updateItem`, data);
        dispatch(setStatus(UPDATE_ITEM, LOADING_OK, data));
      }).catch((e) => {
         console.log(`error from updateItem`, e);
         dispatch(setStatus(UPDATE_ITEM, LOADING_ERROR, e.status));
      }); 
    }
  }

  const acUpdateForm = (fieldName, value) => {
    return {
      type: UPDATE_FORM,
      fieldName,
      value
    };
  }

  const acStoreForm = (form) => {
    return {
      type: STORE_FORM,
      data: form
    };
  }

  const acUnsetError = () => {
    return {
      type: UNSET_ERROR
    };
  }

  const setStatus = (type, status, data) => {
    return {
      type,
      status,
      data
    };
  }

  return {
    LOADING_STARTED,
    LOADING_OK,
    LOADING_ERROR,
    GET_ITEMS,
    ADD_ITEM,
    UPDATE_ITEM,
    UPDATE_FORM,
    STORE_FORM,
    UNSET_ERROR,
    acUpdateForm,
    acStoreForm,
    acLoadItems,
    acAddItem,
    acUpdateItem,
    acUnsetError,
    setStatus,
    listReducer
  };

}
