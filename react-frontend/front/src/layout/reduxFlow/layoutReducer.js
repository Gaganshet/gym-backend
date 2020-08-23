import { combineReducers } from 'redux-immutable';
import Immutable, { List as immutableList, Map as immutableMap } from 'immutable';
import * as ActionTypes from './actionTypes';

function getToggleChange(state = immutableMap(), action) {
  switch (action.type) {
    case ActionTypes.RECEIVE_TOGGLE_CHANGE:
      return Immutable.fromJS(action.data);
    default:
      return state;
  }
}

function getSideMenuChange(state = immutableMap(), action) {
  switch (action.type) {
    case ActionTypes.RECEIVE_SIDEMENU_CHANGE:
      return Immutable.fromJS(action.data);
    default:
      return state;
  }
}

function checkUserToken(state = immutableList(), action) {
  switch (action.type) {
    case ActionTypes.RECEIVE_USER_ACCESSTOKEN:
      return Immutable.fromJS(action.responseData.data);
    default:
      return state;
  }
}


export default combineReducers({
  getToggleChange,
  getSideMenuChange,
  checkUserToken
});
