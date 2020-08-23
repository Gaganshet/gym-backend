import { combineReducers } from 'redux-immutable';
import Immutable, { List as immutableList, Map as immutableMap } from 'immutable';
import * as ActionTypes from './actionTypes';

function getDrawerDetails(state = immutableList(), action) {
  switch (action.type) {
    case ActionTypes.RECEIVE_DRAWER_DETAILS:
      return Immutable.fromJS(action.responseData.data);
    default:
      return state;
  }
}

function updateSwitchChange(state = immutableList(), action) {
  switch (action.type) {
    case ActionTypes.RECEIVE_SWITCH_CHANGE:
      return Immutable.fromJS(action.responseData.data);
    default:
      return state;
  }
}

function checkUserLogin(state = immutableMap(), action) {
  switch (action.type) {
    case ActionTypes.RECEIVE_USER_LOGIN:
      return Immutable.fromJS(action.responseData.data);
    default:
      return state;
  }
}

function getTrainerInquiryDetails(state=immutableList(),action){
  switch (action.type) {
    case ActionTypes.RECEIVE_TRAINER_INQUIRY_CHANGE:
      return Immutable.fromJS(action.responseData.data);
    default:
      return state;
  }
}

function getMemberInquiryDetails(state=immutableList(),action){
  switch (action.type) {
    case ActionTypes.RECEIVE_Member_INQUIRY_CHANGE:
      return Immutable.fromJS(action.responseData.data);
    default:
      return state;
  }
}

export default combineReducers({
  getDrawerDetails,
  updateSwitchChange,
  checkUserLogin,
  getTrainerInquiryDetails,
  getMemberInquiryDetails
});
