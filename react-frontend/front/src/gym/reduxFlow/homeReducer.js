import { combineReducers } from 'redux-immutable';
import Immutable, { List as immutableList, Map as immutableMap } from 'immutable';
import * as ActionTypes from './actionTypes';

function getPackageDetails(state = immutableList(), action) {
  switch (action.type) {
    case ActionTypes.RECEIVE_PACKAGE_DETAILS:
      return Immutable.fromJS(action.Reponsedata.data);
    default:
      return state;
  }
}

function getBranchDetails(state = immutableList(), action) {
  switch (action.type) {
    case ActionTypes.RECEIVE_BRANCH_DETAILS:
      return Immutable.fromJS(action.Reponsedata.data);
    default:
      return state;
  }
}

function getSubscriptionDetails(state = immutableList(), action) {
  switch (action.type) {
    case ActionTypes.RECEIVE_SUBSCRIPTION_DETAILS:
      return Immutable.fromJS(action.responseData.data);
    default:
      return state;
  }
}

function updateIsInterested(state = immutableList(), action) {
  switch (action.type) {
    case ActionTypes.RECEIVE_ISINTEREST_CHANGE:
      return Immutable.fromJS(action.responseData.data);
    default:
      return state;
  }
}

function getSingleMember(state = immutableList(), action) {
  switch (action.type) {
    case ActionTypes.RECEIVE_SINGLE_MEMBER:
      return Immutable.fromJS(action.responseData.data);
    default:
      return state;
  }
}

function updateMemberRegistration(state = immutableList(), action) {
  switch (action.type) {
    case ActionTypes.RECEIVE_MEMBER_UPDATE:
      return Immutable.fromJS(action.responseData.data);
    default:
      return state;
  }
}

function updateIsNotified(state = immutableList(), action) {
  switch (action.type) {
    case ActionTypes.RECEIVE_ISNOTIFIED_CHANGE:
      return Immutable.fromJS(action.responseData.data);
    default:
      return state;
  }
}

function updateSubscriberRemarks(state = immutableList(), action) {
  switch (action.type) {
    case ActionTypes.RECEIVE_REMARKS_CHANGE:
      return Immutable.fromJS(action.responseData.data);
    default:
      return state;
  }
}

function getEnquiryDetails(state = immutableList(), action) {
  switch (action.type) {
    case ActionTypes.RECEIVE_ENQUIRY_DETAILS:
      return Immutable.fromJS(action.responseData.data);
    default:
      return state;
  }
}

function updateIsInterestedForEnquiry(state = immutableList(), action) {
  switch (action.type) {
    case ActionTypes.RECEIVE_ISINTEREST_ENQUIRY_CHANGE:
      return Immutable.fromJS(action.responseData.data);
    default:
      return state;
  }
}

function updateIsNotifiedForEnquiry(state = immutableList(), action) {
  switch (action.type) {
    case ActionTypes.RECEIVE_ISNOTIFIED_ENQUIRY_CHANGE:
      return Immutable.fromJS(action.responseData.data);
    default:
      return state;
  }
}

function updateRemarksForEnquiry(state = immutableList(), action) {
  switch (action.type) {
    case ActionTypes.RECEIVE_REMARKS_ENQUIRY_CHANGE:
      return Immutable.fromJS(action.responseData.data);
    default:
      return state;
  }
}

export default combineReducers({
  getPackageDetails,
  getSubscriptionDetails,
  updateIsInterested,
  getSingleMember,
  updateMemberRegistration,
  updateIsNotified,
  updateSubscriberRemarks,
  getEnquiryDetails,
  updateIsInterestedForEnquiry,
  updateIsNotifiedForEnquiry,
  updateRemarksForEnquiry,
  getBranchDetails
});
