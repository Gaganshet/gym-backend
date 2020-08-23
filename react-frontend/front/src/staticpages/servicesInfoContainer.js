import React, { Component } from 'react';
import  PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { Row, Col, Card, Button, Layout } from 'antd';
import '../css/dashboard.css';
import AdminLogin from '../home/container/userLogin.js';
import AttendanceDrawer from '../home/container/attendanceDrawer.js';

const styles={
    greenButton:{
      color:'green', border:'green'
    }
}

class ServicesInfoContainer extends Component {
  render() {
    return(
    <React.Fragment>
    <Row style = {{background:'black'}} >
      <Col span={16}>
        <h3 style = {{marginTop:15 ,marginBottom : 15 , color:'white' , marginLeft:15}}>24/7 Gym Buddy</h3>
      </Col>
      <Col span={4}>
        <AdminLogin/>
      </Col>
      <Col span={4}>
        <AttendanceDrawer/>
      </Col>  
    </Row>
    <Layout className={"body_content"} ><div  style={{ background: 'transparent', padding: 20 }} >
        <Row gutter={12} style={{ margin:30 }}>
          <Col span={10}>
            <div className="left-content" >
                <div className="top-title">35+ Clients take tests with us</div>
                <div className="title">We provide extensive customer support of 24/7 round the clock</div>
            </div>
          </Col>
          <Col span={14}>
            <div className="right-content" >
            <div className="text font_size_16">Our Mission is to place the right candidate at the right spot</div>
                <div className="text font_size_16">Each test undergoes a thorough validation process to ensure that it accurately measures the desired skill or competency. Tests are periodically reviewed and updated to ensure relevance to the topic.</div>
            </div>
          </Col>
        </Row>
        
        <Row gutter={16} style={{ marginBottom:20 }}>
          <Col span={12}  >
            <Card title={<Button type="danger" size="large" icon="bank" style={styles.greenButton}>COST EFFICIENT</Button>}
              style={{ backgroundColor: 'ivory', borderRadius:50 }}
              bordered={false}>
              <div className="text">
                Always very important to know what candidates are familiar before hiring them.Our flexible pricing table makes our tests sustainable for businesses of any size.
              </div>
            </Card>
          </Col>
          <Col span={12}>
            <Card title={<Button type="danger" size="large" icon="user-add"style={styles.greenButton} >ASSESS 50+ SKILLS</Button>}
              style={{ backgroundColor: 'ivory', borderRadius:50 }}
              bordered={false}>
              <div className="text">
                <p>Our tests cover a range of various topics, including those that may be outside your area of expertise. Clear results give you the confidence to make hiring decisions.
                </p>
              </div>
            </Card>
          </Col>
        </Row>
        
        <Row gutter={16}>
          <Col span={12}>
            <Card title={<Button type="danger" size="large" icon="dashboard" style={styles.greenButton}>WE VALUE YOUR TIME</Button>}
              style={{ backgroundColor: 'ivory', borderRadius:50 }}
              bordered={false}>
              <div className="text">
                <p>Spend less time searching for top candidates and more time adding business value.Make a call to schedule a test or puchace our exciting package 
                </p>
              </div>
            </Card>
          </Col>
          <Col span={12}>
            <Card title={<Button type="danger" size="large" icon="lock" style={styles.greenButton}>MAINTAIN CONFIDENTIALITY</Button>}
              style={{ backgroundColor: 'ivory', borderRadius:50 }}
              bordered={false}>
              <div className="text">
                <p>Our tests are always secured and your datas are very important to us and thus maintained in highly secured Amazon web server
                </p>
              </div>
            </Card>
          </Col>
        </Row>
     </div>
     </Layout>
     </React.Fragment>
     );
  }
}

function mapStateToProps(state) {
  return {
  };
}

export default withRouter(connect(mapStateToProps)(ServicesInfoContainer));
