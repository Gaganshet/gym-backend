import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { Form, Input, Icon, Button , Modal , message as AntMessage, DatePicker , Select , Row, Col } from 'antd';
const  { RangePicker } = DatePicker;
import { getSingleMember , getPackageDetails , updateMemberRegistration , getSubscriptionDetails } from '../reduxFlow/homeActions';
import moment from 'moment';

const dateFormat = 'YYYY/MM/DD';
const FormItem = Form.Item;
const styles = {
    iconStyle:{
      color: 'rgba(0,0,0,.25)'
    },
    rememberBox:{
      color:'red'
    }
}

const { TextArea } = Input;

class RegistrationUpdateModal extends React.Component {
  constructor(props){
    super(props);
    this.state = {
        loading: false,
        visible: false,
        previousPackage : '',
        previousStDate : '',
        previousEdDate:''
    }
  }

  componentDidMount = async () => {
    this.props.onRef(this);
  }

  componentWillUnmount(){
    this.props.onRef(undefined);
  }

  parentMethod = async (row) => {
    const { dispatch , form } = this.props;
    await getPackageDetails(dispatch).catch(this.handleError);
    const responseData = await getSingleMember(dispatch , row.memberId);
    this.setState({ visible : row.openChildModal , previousPackage : responseData[0].packageId ,
       previousStDate : responseData[0].startOfSubscription , previousEdDate: responseData[0].endOfSubscription});
    form.setFieldsValue({
      name:responseData[0].memberName,
      number:responseData[0].phoneNumber,
      amount:responseData[0].amountPaid,
      company:responseData[0].memberProfiles.company,
      occupation:responseData[0].memberProfiles.occupation,
      packageId:responseData[0].packageId,
      address:responseData[0].memberProfiles.contactAddress
    });
  } 

  showModal = () => {
    const { form } = this.props;
    this.setState({ modalType : 'add' });
    form.resetFields();
    this.setState({
      visible: true,
    });
  }

  handleSubmit = (e) => {
    const { form , dispatch , singleMemberDetail } = this.props;
    e.preventDefault();
    this.props.form.validateFieldsAndScroll(async(err, values) => {
      if (!err) {
        this.setState({ loading: true });
        if (!isNaN(values.number) && !isNaN(values.amount)) {
        values.memberId = singleMemberDetail[0].id;
        const responseData = await updateMemberRegistration(dispatch,values).catch(this.handleError);
        const { message , status } = responseData.data
         if(status == 200){
          //form.resetFields();
          AntMessage.success(`${values.name} ${message}`);
         }else{
           this.handleError(responseData.data);
         }
         this.setState({ loading: false });
      } else {
        if(isNaN(values.number)){
          AntMessage.error(`Invalid phone number type`);
        }else{
          AntMessage.error(`Invalid Amount`);
        }
        this.setState({ loading: false });
      } 
      }
    });
  }

  handleOk = async(e) => {
   
    AntMessage.success(`Thanks for Sharing your Valuable Information.`);
    form.resetFields();
  }

  handleCancel = async(e) => {
    const { form } = this.props; 
    this.setState({ visible: false });
    this.props.changeChild();
    form.resetFields();
  }

  handleChange = (value) => {
    console.log(`selected ${value}`);
  }

    handleError = (err) => {
      AntMessage.error(`${err.message}`);
      this.setState({ loading: false });
    }


  render() {

    const tailFormItemLayout = {
        wrapperCol: {
          xs: {
            span: 24,
            offset: 0,
          },
          sm: {
            span: 16,
            offset: 8,
          },
        },
    };

    const { getFieldDecorator } = this.props.form;
    const { visible , previousPackage , previousStDate , previousEdDate} = this.state;
    const Option = Select.Option;
    const { packageDetails } = this.props;

    return ( 
        <div>
        <Modal
        title="Member Details - Update"
        style={{ top: 20 }}
        visible={visible}
        onOk={this.handleOk}
        onCancel={this.handleCancel}
        centered
        footer={null}
        >
        <Form onSubmit={this.handleSubmit}>
        <Row gutter={16}>
        <Col className="gutter-row" span={11}>
        <div className="gutter-box">

        <Form.Item label="Name">
          {getFieldDecorator('name', {
            rules: [{ required: true, message: 'Please input your name!' }],
          })(<Input  placeholder="Please input your name!" />
          )}
          </Form.Item>

          <Form.Item label="Phone Number">
          {getFieldDecorator('number', {
            rules: [{ required: true, message: 'Please input your number!' }],
          })(<Input maxLength = {10} placeholder="Please input your number!" />
          )}
          </Form.Item>

          <Form.Item label="Amount Paid">
          {getFieldDecorator('amount', {
            rules: [{ required: true, message: 'Please input your amount!' }],
          })(<Input placeholder="Please input your amount!" />
          )}
          </Form.Item>

        </div>
        </Col>
        <Col className="gutter-row" span={13}>
        <div className="gutter-box">

        <Form.Item label="Company">
          {getFieldDecorator('company', {
            rules: [{ required: false, message: 'Please input your company!' }],
          })(<Input  placeholder="Please input your company!" />
          )}
          </Form.Item>

          <Form.Item label="Occupation">
          {getFieldDecorator('occupation', {
            rules: [{ required: false, message: 'Please input your occupation!' }],
          })(<Input  placeholder="Please input your occupation!" />
          )}
          </Form.Item>

          <Form.Item label="Package">
          {getFieldDecorator('packageId', {
            initialValue: [previousPackage] || [],
            rules: [{ required: true, message: 'Please input your package!'}],
          })(
            <Select style={{ width: '70%' }}  placeholder="Select a package" onChange={this.handleChange}>
          {packageDetails.map( packageDetail => <Option  value={packageDetail.id}>{packageDetail.package_name}</Option> )}
          </Select>)}
          </Form.Item>

        </div>
        </Col>
        </Row>
        <Form.Item label="Subscription Duration">
          {getFieldDecorator('subscription', {
            initialValue: [moment(previousStDate), moment(previousEdDate)] || [],
            rules: [{ required: true, message: 'Please input your subscription!' , }],
          })( <RangePicker
          />
          )}
          </Form.Item>
        
        <Form.Item label="Address">
          {getFieldDecorator('address', {
            rules: [{ required: true, message: 'Please input your address!' }],
          })(<TextArea rows={4}  placeholder="Please input your address!" />
          )}
        </Form.Item>

        <Form.Item {...tailFormItemLayout}>
        <Button type="primary" htmlType="submit">Submit</Button>
        </Form.Item>
        </Form>
        </Modal>
        </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    singleMemberDetail: state.get('gym').get('getSingleMember').toJS(),
    packageDetails: state.get('gym').get('getPackageDetails').toJS()
  };
}

const WrappedRegistrationUpdateModal = Form.create()(RegistrationUpdateModal);
export default withRouter(connect(mapStateToProps)(WrappedRegistrationUpdateModal));