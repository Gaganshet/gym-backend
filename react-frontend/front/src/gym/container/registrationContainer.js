import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { Form, Button, Input, Select, Checkbox ,  message as AntMessage , Tooltip , Row , Col , DatePicker , Spin  } from 'antd';
import { saveMemberRegistration , getPackageDetails, getBranchDetails } from '../reduxFlow/homeActions';
import { checkUserToken } from '../../layout/reduxFlow/layoutActions';
const { Option } = Select;
const { MonthPicker, RangePicker } = DatePicker;
const styles={
    select:{
      width: 400,
      border: '2px solid',
      borderColor: 'royalblue',
      borderRadius: 6,
      marginRight: 5,
      marginBottom: 5,
      marginTop:5
    },
    button:{
      width:100
    }
};
const formItemLayout = {
    labelCol: {
      xs: { span: 24 },
      sm: { span: 5 },
    },
    wrapperCol: {
      xs: { span: 24 },
      sm: { span: 12 },
    },
  };
const tootTipSave = (
    <div>
      <p>Please fill above information to register !!!</p>
    </div>
  );
  
  class RegistrationContainer extends Component{
    constructor(props){
        super(props);
        this.state = {
            disableCheckbox:true,
            disableRegister :true,
            loading:false,
            number : false,
            dateValue: [],
            checkBoxValue : false
        }
        this.tokenCheck();
      }

      tokenCheck = async () => {
        const { dispatch , history} = this.props;
        await checkUserToken(dispatch);
        const { userToken } = this.props;
        userToken.length == 0 ? history.push('/home'):'';
       }

    componentDidMount = async () => {
      const { dispatch } = this.props;
      await getPackageDetails(dispatch).catch(this.handleError);
      await getBranchDetails(dispatch).catch(this.handleError);
     }
  
    handleSubmit = (e) => {
      const { form, dispatch } = this.props;
      e.preventDefault();
      this.props.form.validateFieldsAndScroll(async (err, values) => {
        if (!err) {
          this.setState({ loading: true });
          if (!isNaN(values.number) && !isNaN(values.amount)) {
            const responseData = await saveMemberRegistration(dispatch, values).catch(this.handleError);
            const { message, status } = responseData.data
            if (status == 200) {
              form.resetFields();
              this.setState({ disableRegister : true , checkBoxValue : false});
              AntMessage.success(`${values.name} --> has been successfully registered as Member`);
            } else {
              this.handleError(responseData.data);
            }
            this.setState({ loading: false });
          } else {
            if(isNaN(values.number)){
              AntMessage.error(`Invalid Phone Number Type.`);
            }else{
              AntMessage.error(`Invalid Amount`);
            }
            this.setState({ loading: false });
          }
        }
      });
    };
  
    handleConfirmBlur = e => {
      const { value } = e.target;
      this.setState({ confirmDirty: this.state.confirmDirty || !!value });
    };
  
    compareToFirstPassword = (rule, value, callback) => {
      const { form } = this.props;
      if (value && value !== form.getFieldValue('password')) {
        callback('Two passwords that you enter is inconsistent!');
      } else {
        callback();
      }
    };
  
    validateToNextPassword = (rule, value, callback) => {
      const { form } = this.props;
      if (value && this.state.confirmDirty) {
        form.validateFields(['confirm'], { force: true });
      }
      callback();
    };

    disableRegister = (event) => {
        if(event.target.checked){
          this.setState({ disableRegister : false , checkBoxValue : true});
        }else {
          this.setState({ disableRegister : true , checkBoxValue : false});
        }
      }
      
      handleError = (err) => {
        AntMessage.error(`${err.message}`);
        this.setState({ loading: false });
      }

      onChange = (event) => {
        this.setState({ switchType: event });
        const { form } = this.props;
        let formValues = form.getFieldsValue();
    }

      handleInputType = (value) => {
        const {form} = this.props;
        if(isNaN(value)){
        }
      };

      calculateAge = (dateMoment, dateValue) => {
        let year = Number(dateValue.substr(6, 4));
        let month = Number(dateValue.substr(3, 2))-1 ;
        let day = Number(dateValue.substr(0, 2));
        let today = new Date();
        let age = today.getFullYear() - year;
        if (today.getMonth() < month || (today.getMonth() == month && today.getDate() < day)) {
          age--;
        }
        this.props.form.setFieldsValue({'age':age});
        return age;
      }
      
      inputAge = (e) => {
        const ageValue = this.calculateAge();
        this.setState({ageOfSubscriber : ageValue});
      }
      
    render() {
        const { getFieldDecorator } = this.props.form;
        const { loading , number , disableRegister , checkBoxValue } = this.state;
        const { packageDetails, branchDetails } = this.props;
  
      return (  
        <Spin spinning={loading} >
        <Form style={{ marginLeft: 20 , marginTop : 50 }} layout="vertical"  onSubmit={this.handleSubmit} >
        <Row gutter={[48, 8]}>
        <Col span={8}>

        <Row>
        <Form.Item label="Branch Name">
        {getFieldDecorator('branchId', {
          rules: [{ required: true, message: 'Please select your branch!' }],
        })(
        <Select style={{ width: '70%' }}  placeholder="Select a branch" onChange={this.handleChange}>
        {branchDetails.map( branchDetail => <Option value={branchDetail.id}>{branchDetail.branch_name}</Option> )}
        </Select>
        )}
        </Form.Item>
        </Row>
        
          <Form.Item label="Name">
          {getFieldDecorator('name', {
            rules: [{ required: true, message: 'Please input your name!' }],
          })(<Input style={{ width: '70%' }}  placeholder="Please input your name!" />
          )}
          </Form.Item>

          <Form.Item label="Phone Number">
          {getFieldDecorator('number', {
            rules: [{ required:  true , message: 'Please input your number!' }],
          })(<Input maxLength = {10} style={{ width: '70%' }} onChange = {this.handleInputType}  placeholder="Please input your number!" />
          )}
          </Form.Item>

          <Form.Item label="E-mail">
          {getFieldDecorator('mailId', {
            rules: [
              {
                type: 'email',
                message: 'The input is not valid E-mail!',
              },
              {
                required: true,
                message: 'Please input your E-mail!',
              },
            ],
          })(<Input style={{ width: '70%' }} placeholder="Please input your E-mail!" />)}
          </Form.Item>

          <Form.Item label="Date of Birth">
          {getFieldDecorator('dob', {
            rules: [{ required: true }],
          })(<DatePicker style={{ width: '70%' }} format='DD/MM/YYYY' onChange = {this.calculateAge}/>
          )}
          </Form.Item>

          </Col>

          <Col span={8}>

          <Form.Item label="Age">
          {getFieldDecorator('age', {
            rules: [{ required: true, message: 'Please input your age!' }],
          })(<Input style={{ width: '70%', fontWeight:800}} disabled ></Input>
          )}
          </Form.Item>

          <Form.Item label="Gender">
          {getFieldDecorator('gender', {
            rules: [{ required: true, message: 'Please select your gender!' }],
          })(<Select style={{ width: '70%' }}  placeholder="Select a gender" onChange={this.handleChange}>
             <Option value="male">Male</Option>
             <Option value="female">Female</Option>
             </Select>
          )}
          </Form.Item>

          <Form.Item label="Company">
          {getFieldDecorator('company', {
            rules: [{ required: false, message: 'Please input your company!' }],
          })(<Input style={{ width: '70%' }}  placeholder="Please input your company!" />
          )}
          </Form.Item>

          <Form.Item label="Occupation">
          {getFieldDecorator('occupation', {
            rules: [{ required: false, message: 'Please input your occupation!' }],
          })(<Input style={{ width: '70%' }}  placeholder="Please input your occupation!" />
          )}
          </Form.Item>
          </Col>

          <Col span={8}>

          <Form.Item label="Package">
          {getFieldDecorator('packageId', {
            rules: [{ required: true, message: 'Please input your package!' }],
          })(
          <Select style={{ width: '70%' }}  placeholder="Select a package" onChange={this.handleChange}>
          {packageDetails.map( packageDetail => <Option value={packageDetail.id}>{packageDetail.package_name}</Option> )}
          </Select>
          )}
          </Form.Item>

          <Form.Item label="Subscription Duration">
          {getFieldDecorator('subscription', {
            rules: [{ required: true, message: 'Please input your subscription!' }],
          })( <RangePicker style={{ width: '70%' }}
            format='DD/MM/YYYY'/>
          )}
          </Form.Item>
  
          <Form.Item label="Amount Paid">
          {getFieldDecorator('amount', {
            rules: [{ required: true, message: 'Please input your amount!' }],
          })(<Input style={{ width: '70%' }}  placeholder="Please input your amount!" />
          )}
          </Form.Item>

          <Form.Item label="Address">
          {getFieldDecorator('address', {
            rules: [{ required: true, message: 'Please input your address!' }],
          })(<Input style={{ width: '70%' , height : 70 }}  placeholder="Please input your address!" />
          )}
          </Form.Item>

          </Col>
          </Row>
          <Row gutter={[48, 8]} >
          <Form.Item  style={{ left : '40%' }}>
          {getFieldDecorator('agreement', {
          })(
          <Checkbox  checked={checkBoxValue} onChange = {this.disableRegister}>
           I Confirm the above Information
          </Checkbox>,
          )}
          </Form.Item>
          <Form.Item  style={{ left : '43%' }}>
          <Button disabled = { disableRegister} style={styles.button} type="primary" htmlType="submit">
           Register
          </Button> 
          </Form.Item>
          </Row>
        </Form>
        </Spin>
      );
    }
  }

  function mapStateToProps(state) {
    return {
      packageDetails: state.get('gym').get('getPackageDetails').toJS(),
      branchDetails: state.get('gym').get('getBranchDetails').toJS(),
      userToken: state.get('layout').get('checkUserToken').toJS(),
    };
  }

const WrappedRegistrationContainer = Form.create()(RegistrationContainer);
export default withRouter(connect(mapStateToProps)(WrappedRegistrationContainer));
