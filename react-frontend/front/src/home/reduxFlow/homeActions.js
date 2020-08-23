import { postRequest , getRequest , putParamRequest, postLoginRequest , deleteRequest} from '../../common/restAxiosApi';
import * as ActionTypes from './actionTypes';


export const getDrawerDetails = async (dispatch, param) => {
	dispatch({ type: ActionTypes.REQUEST_DRAWER_DETAILS });
	const responseData = await getRequest(`/members/member/getAll?branchId=${param}`);
	dispatch({ type: ActionTypes.RECEIVE_DRAWER_DETAILS, responseData });
	return responseData;
}; 


export const updateSwitchChange = async (dispatch, param) => {
	dispatch({ type: ActionTypes.REQUEST_SWITCH_CHANGE });
	const responseData = await putParamRequest(`/member_attendances/member/attendancelog?memberId=${param.memberId}&logType=${param.logType}`, param);
	dispatch({ type: ActionTypes.RECEIVE_SWITCH_CHANGE, responseData });
}; 

export const checkUserLogin = async (dispatch, credentials) => {
	dispatch({ type: ActionTypes.REQUEST_USER_LOGIN});
	const responseData = await postLoginRequest(`/Users/login`, credentials);
	dispatch({ type: ActionTypes.RECEIVE_USER_LOGIN, responseData });
	return responseData.data;
}; 

export const userLogout = async (dispatch, accesstoken) => {
	dispatch({ type: ActionTypes.REQUEST_USER_LOGOUT});
	await deleteRequest(`/Users/${accesstoken.userId}/accessTokens`);
	let responseData = {data:{}};
	dispatch({ type: ActionTypes.RECEIVE_USER_LOGIN, responseData });
	return responseData.data;
};

export const getTrainerInquiryDetails = async(dispatch,param)=>{
	dispatch({type:ActionTypes.REQUEST_TRAINER_INQUIRY_CHANGE});
	const responseData = await postLoginRequest(`/trainer_enquiries`,param)
	dispatch({ type: ActionTypes.RECEIVE_TRAINER_INQUIRY_CHANGE, responseData });
	return responseData;
};

export const getMemberInquiryDetails = async(dispatch,param)=>{
	dispatch({type:ActionTypes.REQUEST_MEMBER_INQUIRY_CHANGE});
	const responseData = await postLoginRequest(`/member_enquiries`,param)
	dispatch({ type: ActionTypes.RECEIVE_MEMBER_INQUIRY_CHANGE, responseData });
	return responseData;
};