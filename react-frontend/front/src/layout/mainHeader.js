import React , { Component } from "react";
import { Layout , Icon, Row , Col } from 'antd';
import {getToggleChange} from './reduxFlow/layoutActions';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import '../css/layout.css';
import AttendanceDrawer from '../home/container/attendanceDrawer.js';
import InquiryForm from '../home/container/inquiry';


const { Header } = Layout;

class MainHeader extends Component {
    constructor(props){
      super(props);
      this.state = {
        collapsed: false,
    };
}

    componentDidMount = async() =>{
      const {dispatch} = this.props;
      const { collapsed } = this.state;
      let data = collapsed;
      await getToggleChange(dispatch,data);
    }

    toggle = async() => {
      const {dispatch} = this.props;
      const { collapsed } = this.state;
      let data = !collapsed;
      this.setState({collapsed:!collapsed})
      await getToggleChange(dispatch,data);
    };

    render(){
      const { sideMenuText } = this.props;
        return(
          <Header style={{ background: "#545454", color: "#ffffff", padding: 0 }}>
            <Row >
              <Col span={1}>
                <Icon
                  className="trigger"
                  type={this.state.collapsed ? 'menu-unfold' : 'menu-fold'}
                  onClick={this.toggle}
                />
              </Col>
              <Col span={4}>
                <h1 style={{ color: "#ffffff" }}> {sideMenuText == '' ? "Registration" : sideMenuText} </h1>
              </Col>

              <Col span={19}>
                <Row gutter={[48, 8]}>
                  <Col span={10} >
                    <InquiryForm />
                  </Col>
                  <Col span={14} >
                    <AttendanceDrawer />
                  </Col>
                </Row>
              </Col>
            </Row>

          </Header>
        )
    }
}

function mapStateToProps(state) {
	return {
		sideMenuText: state.get('layout').get('getSideMenuChange')
	};
}

export default withRouter(connect(mapStateToProps)(MainHeader));
