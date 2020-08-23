import { combineReducers } from 'redux-immutable';
import homeReducer from './home/reduxFlow/homeReducer';
import layoutReducer from './layout/reduxFlow/layoutReducer';
import gymReducer from './gym/reduxFlow/homeReducer';

export default combineReducers({
    home:homeReducer,
    layout:layoutReducer,
    gym:gymReducer
});