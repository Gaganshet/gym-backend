import { postRequest, getRequest, putParamRequest, putRequest } from '../../common/restAxiosApi';
import * as ActionTypes from './actionTypes';

export const saveMemberRegistration = async (dispatch, values) => {
	dispatch({ type: ActionTypes.REQUEST_MEMBER_REGISTRATION });
	const data = await postRequest('/members/member/register', values);
	return data;
};

export const getPackageDetails = async (dispatch, values) => {
	dispatch({ type: ActionTypes.REQUEST_PACKAGE_DETAILS });
	const Reponsedata = await getRequest('/package_details', values);
	dispatch({ type: ActionTypes.RECEIVE_PACKAGE_DETAILS, Reponsedata });
};

export const getBranchDetails = async (dispatch, values) => {
  dispatch({ type: ActionTypes.REQUEST_BRANCH_DETAILS });
  const Reponsedata = await getRequest('/gym_branches/branches/load', values);
  dispatch({ type: ActionTypes.RECEIVE_BRANCH_DETAILS, Reponsedata });
  return Reponsedata;
};

export const getSingleMember = async (dispatch, values) => {
	dispatch({ type: ActionTypes.REQUEST_SINGLE_MEMBER });
	const responseData = await getRequest(`/members/membersearch/idorname?idOrName=${values}`, values);
	await dispatch({ type: ActionTypes.RECEIVE_SINGLE_MEMBER, responseData });
	return responseData.data;
};

export const updateMemberRegistration = async (dispatch, values) => {
	dispatch({ type: ActionTypes.REQUEST_MEMBER_REGISTRATION });
	const responseData = await putParamRequest(`/members/update/member`, values);
	await dispatch({ type: ActionTypes.RECEIVE_MEMBER_REGISTRATION, responseData });
	return responseData;
}

export const getSubscriptionDetails = async (dispatch, values) => {
	dispatch({ type: ActionTypes.REQUEST_SUBSCRIPTION_DETAILS });
	 const responseData = await getRequest(`/gym_branches/branch/getmembers?branchId=${values}`);
	dispatch({ type: ActionTypes.RECEIVE_SUBSCRIPTION_DETAILS, responseData });
	return responseData;
};

export const updateIsInterested = async (dispatch, param) => {
	dispatch({ type: ActionTypes.REQUEST_ISINTEREST_CHANGE });
	const responseData = await putParamRequest(`/members/update/isinterested?memberId=${param.memberId}&isInterested=${param.isInterested}`);
	return responseData;
};

export const updateIsNotified = async (dispatch, param) => {
	dispatch({ type: ActionTypes.REQUEST_ISNOTIFIED_CHANGE });
	const responseData = await putParamRequest(`/members/update/lastnotified?memberId=${param.memberId}&isInterested=${param.isNotified}`);
	dispatch({ type: ActionTypes.RECEIVE_ISINTEREST_CHANGE, responseData});
};

export const updateSubscriberRemarks = async (dispatch, param) => {
	dispatch({ type: ActionTypes.REQUEST_REMARKS_CHANGE });
	const responseData = await putParamRequest(`/members/update/remarks?memberId=${param.memberId}&remarks=${param.remarks}`);
	dispatch({ type: ActionTypes.RECEIVE_REMARKS_CHANGE, responseData});
};

export const getEnquiryDetails = async (dispatch, values) => {
  dispatch({ type: ActionTypes.REQUEST_ENQUIRY_DETAILS });
  const responseData = await getRequest(`/member_enquiries/branch/getmembers?branchId=${values}`, values);
  dispatch({ type: ActionTypes.RECEIVE_ENQUIRY_DETAILS, responseData });
  return responseData;
};

export const updateIsInterestedForEnquiry = async (dispatch, param) => {
  dispatch({ type: ActionTypes.REQUEST_ISINTEREST_ENQUIRY_CHANGE });
  const responseData = await putParamRequest(`/member_enquiries/update/isinterested?enquiryId=${param.enquiryId}&isInterested=${param.isInterested}`);
  return responseData;
};

export const updateIsNotifiedForEnquiry = async (dispatch, param) => {
  dispatch({ type: ActionTypes.REQUEST_ISNOTIFIED_ENQUIRY_CHANGE });
  const responseData = await putParamRequest(`/member_enquiries/update/lastnotified?enquiryId=${param.enquiryId}&isInterested=${param.isNotified}`);
  dispatch({ type: ActionTypes.RECEIVE_ISNOTIFIED_ENQUIRY_CHANGE, responseData});
};

export const updateRemarksForEnquiry = async (dispatch, param) => {
  dispatch({ type: ActionTypes.REQUEST_REMARKS_ENQUIRY_CHANGE });
  const responseData = await putParamRequest(`/member_enquiries/update/remarks?enquiryId=${param.enquiryId}&remarks=${param.remarks}`);
  dispatch({ type: ActionTypes.RECEIVE_REMARKS_ENQUIRY_CHANGE, responseData});
};