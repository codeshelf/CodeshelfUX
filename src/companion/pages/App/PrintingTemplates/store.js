import {Map, Record, fromJS, List} from 'immutable';
import {getFacilityContextFromState} from "../../Facility/get";

export const NEWID = "new";
const GET_TEMPLATES = 'GET_TEMPLATES';
const UPDATE_TEMPLATE = 'UPDATE_TEMPLATE';
const ADD_TEMPLATE = 'ADD_TEMPLATE';
const LOADING_STARTED = 'LOADING_STARTED';
const LOADING_OK = 'LOADING_OK';
const LOADING_ERROR = 'LOADING_ERROR';
const STORE_TEMPLATE_FORM = 'STORE_TEMPLATE_FORM';
const UPDATE_TEMPLATE_FORM = 'UPDATE_TEMPLATE_FORM';

const initState = new (Record({
  templates: new Map({
    data: [],
    error: null,
    loading: null,
  }),
  addTemplate: new Map({
    loading: null,
    error: null,
  }),
  updateTemplate: new Map({
    data: null,
    loading: null,
    error: null,
  }),
  selectedTemplateForm: null,
  table: {
    columns: ["name", "active"],
    sortSpecs: {"name": {order: "asc"}}
  },
}));

export function printingTemplatesReducer(state = initState, action) {
  switch (action.type) {
    case GET_TEMPLATES: {
      switch (action.status) {
        case LOADING_STARTED: {
          return state.mergeIn(['templates'], new Map({
            data: [],
            loading: true,
            error: null,
          }));
        }
        case LOADING_OK: {
          return state.mergeIn(['templates'], new Map({
            data: action.data.results,
            loading: null,
            error: null,
          }));
        }
        case LOADING_ERROR: {
          return state.mergeIn(['templates'], new Map({
            data: [],
            loading: null,
            error: action.data,
          }));
        }
      }
    }
    case UPDATE_TEMPLATE: {
      switch (action.status) {
        case LOADING_STARTED: {
          return state.mergeIn(['updateTemplate'], new Map({
            data: null,
            loading: true,
            error: null,
          }));
        }
        case LOADING_OK: {
          const data = state.workers.get('data');
          const newData = data.map((template) => {
            console.info(template.persistentId, action.data.persistentId)
            if (template.persistentId == action.data.persistentId) {
              return action.data;
            }
            return template;
          })
          return state.merge({
            updateTemplate: {
              data: action.data,
              loading: null,
              error: null,
            },
            templates: {...state.templates, data: newData}
          });
        }
        case LOADING_ERROR: {
          return state.mergeIn(['updateTemplate'], new Map({
            data: null,
            loading: null,
            error: action.data,
          }));
        }
      }
    }
    case ADD_TEMPLATE: {
      switch (action.status) {
        case LOADING_STARTED: {
          return state.mergeIn(['addTemplate'], new Map({
            loading: true,
            error: null,
          }));
        }
        case LOADING_OK: {
          const data = state.templates.get('data');
          data.push(action.data);
          return state.merge({ 
          addTemplate: {
            loading: null,
            error: null,
          },
          templates: {...state.templates, data}
          });
        }
        case LOADING_ERROR: {
          return state.mergeIn(['addTemplate'], new Map({
            loading: null,
            error: action.data,
          }));
        }
      }
    }
    case STORE_TEMPLATE_FORM: {
      return state.set('selectedTemplateForm', action.templateForm);
    }
    case UPDATE_TEMPLATE_FORM: {
      return state.setIn(['selectedTemplateForm', action.fieldName], action.value);
    }
    default: return state;
  }
}

function setStatus(type, status, data) {
  return {
    type,
    status,
    data
  };
}

export function acStoreTemplateForm(templateForm) {
  return {
    type: STORE_TEMPLATE_FORM,
    templateForm,
  }
}

export function acGetTemplates({limit}) {
  return (dispatch, getState) => {
    dispatch(setStatus(GET_TEMPLATES, LOADING_STARTED));

    const facilityContext = getFacilityContextFromState(getState());
    if (!facilityContext) {
      dispatch(getError(`Want to get templates but no facility context is provided`));
      return;
    }

    //facilityContext.getTemplates().then((data) => {
      //console.log(`data from getTemplates`, data);
      dispatch(setStatus(GET_TEMPLATES, LOADING_OK, []));
    // }).catch((e) => {
    //   console.log(`error from getting templates`, e);
    //   dispatch(setStatus(GET_TEMPLATES, LOADING_ERROR, e));
    // });
  }
}

export function acUpdateSelectedTemplate(fieldName, value) {
  return {
    type: UPDATE_TEMPLATE_FORM,
    fieldName,
    value,
  }
}

export function acUpdateTemplate(selectedTemplateForm) {
  return (dispatch, getState) => {
    dispatch(setStatus(UPDATE_TEMPLATE, LOADING_STARTED));

    const facilityContext = getFacilityContextFromState(getState());
    if (!facilityContext) {
      dispatch(getError(`Want to update worker but no facility context is provided`));
      return;
    }

    return facilityContext.updateTemplate(selectedTemplateForm.toJS()).then((data) => {
      console.log(`data from updateTemplate`, data);
      dispatch(setStatus(UPDATE_TEMPLATE, LOADING_OK, data));
    }).catch((e) => {
      console.log(`error from updating template`, e);
      dispatch(setStatus(UPDATE_TEMPLATE, LOADING_ERROR, e));
    });
  }
}

export function acAddTemplate(selectedTemplateForm) {
  return (dispatch, getState) => {
    dispatch(setStatus(ADD_TEMPLATE, LOADING_STARTED));

    const facilityContext = getFacilityContextFromState(getState());
    if (!facilityContext) {
      dispatch(getError(`Want to update template but no facility context is provided`));
      return;
    }

    return facilityContext.addTemplate(selectedTemplateForm.toJS()).then((data) => {
      console.log(`data from updateTemplate`, data);
      dispatch(setStatus(ADD_TEMPLATE, LOADING_OK, data));
    }).catch((e) => {
      console.log(`error from updating template`, e);
      dispatch(setStatus(ADD_TEMPLATE, LOADING_ERROR, e));
    });
  }
}
