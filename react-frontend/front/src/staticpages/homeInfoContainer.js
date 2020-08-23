import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { Row, Col, Card, Button, Carousel, Menu, Icon } from 'antd';
import '../css/dashboard.css';
import '../css/carousel.css';
import AdminLogin from '../home/container/userLogin.js';

const styles={
	candidate: {
		color: 'whitesmoke',
		top: 20,
		position:'relative'
	},
	testCategory: {
		marginTop:30,
		marginRight:10
	}
}

const { Meta } = Card;

class HomeInfoContainer extends Component {
	
	
	constructor(props){
	  super(props);
		this.state = {
				current:'behaviour'
    }
  }
  
	handleCategoryMenuClick = (e) => {
		this.setState({ current: e.key });
	}
  
  render() {
    
    const { current } = this.state;
    
    return(
      <React.Fragment>
      <Row style = {{background:'black'}} >
        <Col span={3}>
          <h3 style = {{marginTop:15 ,marginBottom : 15 , color:'white' , marginLeft:15}} className= "logo_full"></h3>
        </Col>
        <Col span={21}>
          <AdminLogin/>
        </Col>
         
      </Row>
      <div  style={{ background: 'rgb(86, 96, 99)' , padding: 39 }} >
        <Carousel effect="fade" autoplay={true} dots={true}>
          <div>
            <h3 className={"candidates"} >
              <div className="candidate-text" >
              <h1 style={styles.candidate}>Looking For A Perfect Time To Start Your Workout ??</h1>
                <p style={{ color: "blanchedalmond" }} ><br/>When You Want To Succeed As Bad As You Want To Breathe,<br/>Then You Will Be Successful.Why Wait? <br/>Lets Start Today.</p>
              </div>
            </h3>
          </div>
          <div>
	          <h3 className={"exam"} >
	            <div className="candidate-text">
              <h1 style={styles.candidate}>Looking for a Right Gym ??</h1>
	              <p style={{ color: "blanchedalmond" }}><br/>The Real Workout Starts When You Want To Stop . We Help You To Transform </p>
	            </div>
	          </h3>
          </div>
        </Carousel>
        <br/>
        <Row>
        <Col span={8} >
        <Card size = "small" title={<h1 className="top-title" >ABOUT THE GYM</h1>} bordered={true} 
        style={{ height: 350, background: '#ECECEC', marginRight: 15 }}>
        <h2 className="second-header">Get Fit Today</h2>
        <p className="gym-Detail" >24*7 Fitness studio has been changing lives, since we were established in 
        2012. We believe that fitness is not a hobby, but a way of life. Whether you excercise everyday or 
        you've never stepped into gym before, 24*7 Fitness studio can help shape the new you.
        We want to be your next workout partner.</p>
        </Card>
        </Col>

        <Col span={8} >
        <Card size = "small" title={<h1 className="top-title" >OUR PHILOSOPHY</h1>} bordered={true}
        style={{ height: 350, background: '#ECECEC', marginRight: 15 }}>
        <h2 className="second-header">Join Our Fitness Community</h2>
        <p className="gym-Detail" >Everyone knows that exercise is good for you.But at 24*7 Fitness Studio, we make it fun 
        and we'll help you find a fitness routine that works for your lifestyle and personal goals.
        We want you to leave feeling better than ever. Showing up can be the hardest part.Let us take care of the rest.</p>
        </Card>
        </Col>

        <Col span={8} > 
        <Card size = "small" title={<h1 className="top-title" >GET IN TOUCH</h1>} bordered={true}
        style={{ height: 350, background: '#ECECEC' , marginRight: 15 }}>
        <h2 className="getInTouch-style">studiofitness24*7@gmail.com</h2>
        <p  className="gymInTouch-Detail">Join us today!</p>
        </Card>
        </Col>

        </Row>
      </div>
      </React.Fragment>
    );
  }
}

function mapStateToProps(state) {
  return {
  };
}

export default withRouter(connect(mapStateToProps)(HomeInfoContainer));