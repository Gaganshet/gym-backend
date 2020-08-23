import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { Form, Icon, Input, Button, Checkbox, Modal, message as AntMessage, Spin } from 'antd';
import '../../css/dashboard.css'
import { checkUserLogin } from '../reduxFlow/homeActions';

class UserLoginForm extends Component {
  
  state = {
  loading: false,
  open : false
  }

  handleModal = () => {
    this.setState({ open: true });
  }

  closeLogin = () => {
    this.setState({ open: false });
  }
	
	
  handleSubmit = async (e) => {
    e.preventDefault();
    let isValid = false;
    const { form } = this.props;
    form.validateFields((err) =>  isValid = !err);
    if(!isValid){
      return;
    } 
    await this.loginUser().catch(this.handleError);
  }

  loginUser =async (e) => {
    this.setState({ loading: true });
    const { form, dispatch , history } = this.props;
    const param = form.getFieldsValue();
    const responseData =  await checkUserLogin(dispatch ,param );
    history.push('/register');
    AntMessage.success(`Login Success`);
  }
  
  handleError = (err) => {
    AntMessage.error(`Invalid Credentials. Please Check username & password`);
    this.setState({ loading: false });
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    const { loading , open } = this.state;
    const { userLogin } = this.props;
    
    return (
      <div>
      <Button style = {{ left:'80%' , marginTop:15 ,marginBottom : 15}} type="primary" htmlType="submit" onClick = {this.handleModal} icon ='login'>Login</Button>
      <Modal
        title="24/7 - Admin Login"
        visible={open}
        centered
        footer={null}
        maskClosable={false}
        width={350}
        onCancel={this.closeLogin}
      >
      <Spin spinning={loading} >
        <Form onSubmit={this.handleSubmit} className="login-form">
          <Form.Item>
            {getFieldDecorator('username', {
              rules: [{ required: true, message: 'Please input your username!' }],
            })(
              <Input
                prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
                placeholder="Username"
              />,
            )}
          </Form.Item>
          <Form.Item>
            {getFieldDecorator('password', {
              rules: [{ required: true, message: 'Please input your Password!' }],
            })(
              <Input
                prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
                type="password"
                placeholder="Password"
              />,
            )}
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" className="login-form-button">
              Log in
            </Button>
          </Form.Item>
        </Form>
        </Spin>
      </Modal>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    userLogin: state.get('home').get('checkUserLogin').toJS()
  };
}

const WrappedNormalLoginForm = Form.create()(UserLoginForm);
export default withRouter(connect(mapStateToProps)(WrappedNormalLoginForm));