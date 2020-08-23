import React , { Component } from "react";
import { Layout } from 'antd';
import '../css/layout.css';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
 

const { Content } = Layout;

class MainContent extends Component {

    render(){
        return(
        <Content
            style={{
            margin: '24px 16px 0px 16px',
            padding: 4,
            background: '#fff',
            minHeight: 480,
            maxHeight:'100%',
            }}
        >
        {this.props.childElement}
        </Content>
        )
    }
}

export default withRouter(connect(null)(MainContent));
