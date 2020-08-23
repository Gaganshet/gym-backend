import * as ACTION_TYPES from './actionTypes';
import { getRequest } from '../../common/restAxiosApi';
import * as ActionTypes from './actionTypes';
//const SPRING_SERVER = "http://localhost:5050";


export const getToggleChange = async (dispatch, data) => {
	dispatch({ type: ActionTypes.RECEIVE_TOGGLE_CHANGE, data });
};

export const getSideMenuChange = async (dispatch, data) => {
	dispatch({ type: ActionTypes.RECEIVE_SIDEMENU_CHANGE, data });
};

export const checkUserToken = async (dispatch) => {
	dispatch({ type: ActionTypes.REQUEST_USER_ACCESSTOKEN});
	const userData = await getRequest(`/Users/findOne?filter=%7B%22username%22%3A%22Admin%22%7D`);
	const responseData = await getRequest(`/Users/${userData.data.id}/accessTokens`);
	dispatch({ type: ActionTypes.RECEIVE_USER_ACCESSTOKEN, responseData });
	return responseData.data;
}; 
