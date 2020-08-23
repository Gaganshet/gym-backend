import { Form, Input, Cascader,InputNumber, Modal, Button, Radio, Row, Col, Select,message as AntMessage } from 'antd';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { getTrainerInquiryDetails , getMemberInquiryDetails } from '../reduxFlow/homeActions';
import { checkUserToken } from '../../layout/reduxFlow/layoutActions';
import {  getPackageDetails, getBranchDetails } from '../../gym/reduxFlow/homeActions';


class TrainerInquiry extends Component {
	constructor(props) {
		super(props);
		this.state = {
				loading: false,
				visible: false,
				inquiryType:'Member'
		},
		this.tokenCheck();
	}

	showModal = () => {
		this.setState({
			visible: true,
		});
	};

	tokenCheck = async() =>{
		const {dispatch} = this.props;
		await checkUserToken(dispatch);
	  }

	handleCancel = () => {
		this.setState({ visible: false });
	};


	changeCombo=(value)=>{
		this.setState({inquiryType: value});
	}

	componentDidMount = async () => {
		const { dispatch } = this.props;
		await getPackageDetails(dispatch).catch(this.handleError);
		await getBranchDetails(dispatch).catch(this.handleError);
	}
	handleSubmit = async (e) => {
		e.preventDefault();
		let isValid = false;
		const { form } = this.props;
		form.validateFields((err) =>  isValid = !err);
		
		const phoneNumber = this.props.form.getFieldValue('phoneNumber');
		if(isNaN(phoneNumber)){
		  AntMessage.error(`Invalid Phone Number Type.`);
		  return;
		}
		
		if(!isValid){
			return;
		} 
		await this.InquiryDetails().catch(this.handleError);
	}

	InquiryDetails =async (e) => {
		this.setState({ loading: true, visible: false });
		const { form, dispatch , history } = this.props;
		const { inquiryType } = this.state;
		const param = form.getFieldsValue();
		let responseData ;
		if(inquiryType=='Member'){
			responseData = await getMemberInquiryDetails(dispatch,param);
		}else{
			responseData = await getTrainerInquiryDetails(dispatch,param);
		}
		const { message , status } = responseData
		if(status == 200){
			form.resetFields();
			AntMessage.success(`${param.name} - Inquiry Registered Successfully`);
		}else{
			this.handleError(responseData.data);
		}
	}


	render() {
		const { visible } = this.state;
		const { getFieldDecorator } = this.props.form;
		const { packageDetails , userToken, branchDetails } = this.props;
		const { inquiryType } = this.state;
		const { TextArea } = Input;
		const { Option } = Select;

		return (
				<div>
				{ userToken.length > 0 && <Button style = {{ left: '78%',marginTop:15 ,marginBottom : 15}} type="primary" onClick={this.showModal} icon="question-circle">
				Inquiry
				</Button> }
				<Modal
				visible={visible}
				title="24/7 - INQUIRIES"
					onOk={this.handleOk}
				onCancel={this.handleCancel}
				footer={null}
				centered
				width={800}
				>

				<Form onSubmit={this.handleSubmit}>
				<Row>
				<Col span={12}>
				<Form.Item label="Inquiry Type:" style={{width:'90%'}}>
				{getFieldDecorator('inquiry',{
					initialValue: ["Member"] || []
				})
				(<Select id="comboValue" style = {{width : '100%'}} onChange={this.changeCombo} defaultValue="Member">
				<Option value="Member">Member Inquiry</Option>
				<Option value="Trainer">Trainer Inquiry</Option>
				</Select>)}
				</Form.Item>

				<Form.Item label="Name:" style={{width:'90%'}}>
				{getFieldDecorator('name', {
					rules: [
						{
							required: true,
							message: 'Please input your Name!',
						},
						],
				})(<Input placeholder="Please input your name!" />)}
					</Form.Item>

				<Form.Item label="Phone Number:" style={{width:'90%'}}>
				{getFieldDecorator('phoneNumber', {
					rules: [
						{
							required: true,
							message: 'Please input your Contact Number!',
						},
						],
				})(<Input maxLength = {10} placeholder="Please input your Phone Number!"/>)}
				</Form.Item>
				{ inquiryType == "Trainer" &&  <Form.Item label="Fitness Certificate" style={{width:'90%'}}>
				{getFieldDecorator('fitness', {
					rules: [
						{
							required: true,
							message: 'Please input your certificate availability!',
						},
						],

				})(<Select placeholder="Please select your certificate availability" onChange={this.handleChange}>
				<Option value={true}>Yes</Option>
				<Option value={false}>No</Option>
				</Select>
				)}
				</Form.Item>}


				{ inquiryType == "Member" && <Form.Item label="Interested package" style={{width:'90%'}} >
				{getFieldDecorator('packageId', {   
					rules: [
						{
							required: true,
							message: 'Please select your Fitness Package!',
						},
						],
				})(<Select style={{ width: '70%' }}  placeholder="Select a package">
						{packageDetails.map( packageDetail => <Option value={packageDetail.id}>{packageDetail.package_name}</Option> )}
				</Select>
				)}
				</Form.Item>}
				<Form.Item label="Branch Name">
				{getFieldDecorator('branch_id', {
				  rules: [{ required: true, message: 'Please select your branch!' }],
				})(
				    <Select style={{ width: '70%' }}  placeholder="Select a branch" onChange={this.handleChange}>
				    {branchDetails.map( branchDetail => <Option value={branchDetail.id}>{branchDetail.branch_name}</Option> )}
				    </Select>
				)}
				</Form.Item>

				</Col>

				<Col span={12}>

				<Form.Item label="Attended By:">
				{getFieldDecorator('attendedBy',{
					rules: [
						{
							required: true,
							message: 'Please input Attended By',
						},
						],
				})(<Input placeholder="Please input Attended By"/>)}
				</Form.Item>

				<Form.Item label="Gender">
				{getFieldDecorator('gender',{
					rules: [
						{
							required: true,
							message: 'Please select your Gender!',
						},
						],
				})(<Radio.Group>
				<Radio value="a" >Male</Radio>
				<Radio value="b" >Female</Radio>
				</Radio.Group>)}
				</Form.Item>

				{inquiryType == "Trainer" && <Form.Item label="Years of Experience" style={{width:'90%'}}>
				{getFieldDecorator('yearsOfExperience', {  
					rules: [
						{
							required: true,
							message: 'Please input your Years of experience!',
						},
						], 
				})(<InputNumber  min={0} max={10} defaultValue={0} > </InputNumber>)}
				</Form.Item>}    

				{ inquiryType == "Member" && 	<Form.Item label="Occupation" >
				{getFieldDecorator('occupation', {   
					rules: [
						{
							required: true,
							message: 'Please input your Occupation!',
						},
						],
				})(<Input placeholder="Please input your Occupation!"/>)}
				</Form.Item>}



				<Form.Item label="Address">
				{getFieldDecorator('contactAddress', {   
					rules: [
						{
							required: true,
							message: 'Please input your Contact Address!',
						},
						],
				})(<TextArea rows={4} placeholder="Please input your Contact Address!"/>)}
				</Form.Item>


				</Col>
				</Row>
				<Row>
				<Col span={12}>
				<Form.Item >
				<Button style={{  marginTop: 15, marginBottom: 15 ,marginLeft: "86%"}}  type="primary" htmlType="submit">Submit</Button>
				</Form.Item>
				</Col>
				</Row>
				</Form>
				</Modal>
				</div>
				);
				}
				}
				function mapStateToProps(state) {
					return {
						trainerInquiry: state.get('home').get('getTrainerInquiryDetails').toJS(),
						memberInquiry: state.get('home').get('getMemberInquiryDetails').toJS(),
						packageDetails: state.get('gym').get('getPackageDetails').toJS(),
						userToken: state.get('layout').get('checkUserToken').toJS(),
						branchDetails: state.get('gym').get('getBranchDetails').toJS(),
					};
				}

				const WrappedInquiryForm = Form.create()(TrainerInquiry);
				export default withRouter(connect(mapStateToProps)(WrappedInquiryForm));