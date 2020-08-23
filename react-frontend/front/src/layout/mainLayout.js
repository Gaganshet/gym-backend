import { Layout } from 'antd';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import Sidemenu from './sidemenu';
import MainHeader from './mainHeader';
import MainContent from './mainContent';
import '../css/layout.css';


const { Footer} = Layout;
class MainLayout extends Component {
	 constructor(props){
		    super(props);
		    	this.state = {
            
		    	};
	 }

  render() {
    return (
    <Layout>
    <Sidemenu/>
    <Layout>
    <MainHeader/>
    <MainContent childElement = {this.props.children}/>
    <Footer style={{ textAlign: 'center' }}>24x7 FITNESS STUDIO</Footer>
    </Layout>
    </Layout>
    
    );
  }
}

export default withRouter(connect(null)(MainLayout));
