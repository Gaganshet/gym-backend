import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from "react-redux";
import { createStore } from "redux";
import MainReducer from './mainReducer';
import Navigator from './navigator'
import MainLayout from './layout/mainLayout'
import "./less/customize-theme.less"

const store = createStore(MainReducer);

ReactDOM.render(
    <Provider store={store}>
      <Navigator/>
   </Provider>
    ,document.getElementById('app')
);