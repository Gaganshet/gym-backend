import React, { Component } from 'react';
import { Router , Route , Switch, Redirect  } from "react-router-dom";
import { createHashHistory} from 'history';
import MainLayout from './layout/mainLayout';
import RegistrationContainer from './gym/container/registrationContainer';
import HomeInfoContainer from './staticpages/homeInfoContainer';
import SubscriptionExpiryContainer from './gym/subscriptionExpiryContainer';
import EnquiryViewContainer from './gym/enquiryViewContainer';
import TableViewContainer from './gym/tableViewContainer';


const history = createHashHistory();

 class Navigator extends Component {
    render () {
        return (
          <Router history = {history} > 
          <Switch>
          <Route exact path="/" render={() => (<Redirect to="/home" />)} />
          <Route path="/home" component={HomeInfoContainer} />
          <MainLayout> 
          <Route path="/register" component={RegistrationContainer} />
          <Route path="/validator" component={ SubscriptionExpiryContainer } /> 
          <Route path="/enquiry" component={ EnquiryViewContainer } />  
          <Route path = '/table' component = { TableViewContainer }/>    
          </MainLayout>          
          </Switch>
          </Router>
        )
    }
}


export default Navigator;
