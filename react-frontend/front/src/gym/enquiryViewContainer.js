import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import ReactDOM from 'react-dom';
import Highlighter from 'react-highlight-words';
import { Table, Tag, Switch, Button, Input, Select, Modal, Tooltip, Spin, message } from 'antd';
import { updateIsInterestedForEnquiry, updateRemarksForEnquiry,
  updateIsNotifiedForEnquiry, getEnquiryDetails, getBranchDetails } from './reduxFlow/homeActions';
import '../css/subscription.css';
import RegistrationUpdateModal from './container/registrationUpdateModal';
import { checkUserToken } from '../layout/reduxFlow/layoutActions';

const { Option } = Select;
const { Search } = Input;
const { TextArea } = Input;

class EnquiryViewContainer extends Component {
  constructor(props) {
    super(props);
    this.tokenCheck();
  }

  state = {
    sortedInfo: null,
    subscriberName: '',
    attendedByName: '',
    subscriberPhoneNumber: null,
    modalVisible: false,
    loading: false,
    currentRemarks: '',
    currentRowId: null,
    defaultBranchName: "THORAIPAKKAM",
    currBranchId:""
  };

  tokenCheck = async () => {
    const { dispatch, history } = this.props;
    await checkUserToken(dispatch);
    const { userToken } = this.props;
    userToken.length == 0 ? history.push('/home') : '';
  }

  handleChange = (pagination, filters, sorter) => {
    this.setState({
      filteredInfo: filters,
      sortedInfo: sorter,
    });
  };

  showModal = () => {
    this.setState({ visible: false });
  };

  componentDidMount = async () => {
    const { dispatch } = this.props;
    const { defaultBranchName } = this.state;
    const branchList = await getBranchDetails(dispatch).catch(this.handleError);
    
    for(let i=0; i<branchList.data.length; i++){
      const { branch_number ,branch_name, id} = branchList.data[i];
      if(branch_number ==  1){
        this.setState({currBranchId : id});
        this.setState({defaultBranchName: 'THORAIPAKKAM'});
        await this.loadDataBasedOnCombo(id);
      }
    }
  }

  loadDataBasedOnCombo = async (branchId) => {
    const { dispatch } = this.props;
    this.setState({ currBranchId: branchId });
    const resultData = await getEnquiryDetails(dispatch, branchId).catch(this.handleError);
    this.setState({ subscriberName: '', subscriberId: null, subscriberPhoneNumber: null });
  }
  
  downloadSubscriptionData = () => {
    this.setState({ loading: true });
    const { enquiryDetails, branchDetails } = this.props;
    const { currBranchId } = this.state;
    let currBranchName="";
    for(let i=0; i< branchDetails.length; i++){
      const { branch_name, id} = branchDetails[i];
      if(currBranchId === id){
        currBranchName = branch_name;
        break;
      }
    }
    
    var csvDataColumns = 'Branch Name,Member Name, Phone Number, Interested Package Name, Attended By, Is Interested, Is Notified, Last Notified \n';
    
    enquiryDetails.filter(rec => !(rec.hasJoined));
    enquiryDetails.forEach(dataObj => {
      const { name, phoneNumber, packageId ,isInterested, isNotified, lastNotified, attendedBy } = dataObj;

      csvDataColumns += currBranchName +","+ name + ',' + phoneNumber + ',' + packageId + ',' + attendedBy 
      + ',' + (isInterested ? 'YES' : 'NO') + ',' + (isNotified ? 'YES' : 'NO');

      if (isNotified) {
        csvDataColumns += ',' + (lastNotified ? new Date(lastNotified).toLocaleString().replace(',', '') : '') + '\n';
      } else {
        csvDataColumns += '\n';
      }
    });

    const element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(csvDataColumns));
    element.setAttribute('download', `Inquired Members Details.ods`);
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    this.setState({ loading: false });
  }

  handleEnquiryTableData = () => {
    const { enquiryDetails } = this.props;
    let  result = enquiryDetails.filter(rec => (rec.hasJoined !== "true") && !(rec.hasJoined));
    const { subscriberName, subscriberPhoneNumber, attendedByName } = this.state;
    if (subscriberName) {
      result = enquiryDetails && enquiryDetails.filter(dataObj => ((dataObj.name !== null) && 
          (((dataObj.name.toLowerCase()).indexOf(subscriberName.toLowerCase())) != -1)));
    }
    if (subscriberPhoneNumber) {
      result = enquiryDetails && enquiryDetails.filter(dataObj => (((dataObj.phoneNumber.toString()).indexOf(subscriberPhoneNumber.toString())) != -1));
    }
    if (attendedByName) {
      result = enquiryDetails && enquiryDetails.filter(dataObj => ((dataObj.attendedBy !== null) && 
          (((dataObj.attendedBy.toLowerCase()).indexOf(attendedByName.toLowerCase())) != -1)));
    }
    return result;
  }

  handleSubscriberName = (subscriberName) => {
    this.setState({ loading: true });
    this.setState({ subscriberName });
    this.setState({ loading: false });
  }

  handleSubscriberPhoneNumber = (subscriberPhoneNumber) => {
    this.setState({ loading: true });
    this.setState({ subscriberPhoneNumber });
    this.setState({ loading: false });
  }

  handleAttendedBy = (attendedByName) => {
    this.setState({ loading: true });
    this.setState({ attendedByName });
    this.setState({ loading: false });
  }

  handleRemarksModal = (rowData) => {
    const { id, remarks } = rowData;
    this.setState({ modalVisible: true, currentRowId: id, currentRemarks: remarks });
  }

  handleCancel = () => {
    this.setState({ modalVisible: false, currentRowId: null, currentRemarks: null });
  }

  updateLastNotifiedDetails = () => {
    let today = new Date();
    let date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
    let time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    let dateTime = date + ' ' + time;
    return dateTime;
  }

  updateInterests = async (rowData) => {
    this.setState({ loading: true });
    const { dispatch } = this.props;
    const { isInterested, id, name } = rowData;
    const { currBranchId } = this.state;
    const param = {
        enquiryId : id,
        isInterested: !isInterested
    }
    await updateIsInterestedForEnquiry(dispatch, param);
    await getEnquiryDetails(dispatch, currBranchId).catch(this.handleError);
    this.setState({ loading: false });
    message.success(`Interest has been updated successfully for -> ${name}`);
  }

  updateLastNotified = async (rowData) => {
    this.setState({ loading: true });
    const { dispatch } = this.props;
    const { isNotified, id, name } = rowData;
    const { currBranchId } = this.state;
    const param = {
        enquiryId: id,
      isNotified: true
    }
    await updateIsNotifiedForEnquiry(dispatch, param);
    await getEnquiryDetails(dispatch, currBranchId).catch(this.handleError);
    this.setState({ loading: false });
    message.success(`Notification has been sent successfully to -> ${name}`);
  }

  updateRemarks = async () => {
    this.setState({ loading: true });
    const { currentRemarks, currentRowId, currBranchId } = this.state;
    const { dispatch } = this.props;
    const param = {
        enquiryId: currentRowId,
      remarks: currentRemarks
    }
    await updateRemarksForEnquiry(dispatch, param);
    message.success(`remarks has been updated successfully`);
    await getEnquiryDetails(dispatch, currBranchId).catch(this.handleError);
    this.handleCancel();
    this.setState({ loading: false });
  }

  openMemberModal = (row) => {
    row.openChildModal = true;
    this.child.parentMethod(row);
  }

  changechild = async () => {
    const { dispatch } = this.props;
    await getEnquiryDetails(dispatch).catch(this.handleError);
  }

  setRemarks = (e) => {
    this.setState({ currentRemarks: e.target.value });
  }

  render() {
    const { enquiryDetails, branchDetails  } = this.props;
    const { isInterested } = enquiryDetails;
    let { sortedInfo, modalVisible, attendedByName, subscriberName, subscriberPhoneNumber, loading, currentRemarks, defaultBranchName} = this.state;
    sortedInfo = sortedInfo || {};

    const columns = [
      {
        title: 'Member Name',
        dataIndex: 'name',
        key: 'name',
        width: '12%',
        render: (text, row) => <span>
          {text !== "" && text !== null && <span style={{ marginLeft: 10 }} ><Tag color="grey">
            <Highlighter
              highlightClassName="highlightSubscriberName" searchWords={[subscriberName]}
              autoEscape={true} textToHighlight={text} />
          </Tag></span>}
        </span>,
      },
      {
        title: 'Contact Number',
        dataIndex: 'phoneNumber',
        key: 'phoneNumber',
        render: text => <Highlighter
          highlightClassName="highlightSubscriberPhoneNumber" searchWords={[subscriberPhoneNumber]}
          autoEscape={true} textToHighlight={text} />,
        width: '12%',
      },
//      {
//        title: 'Interested Package Name',
//        dataIndex: 'packageDetails[package_name]',
//        key: 'packageDetails',
//        width: '16%',
//      },
      {
        title: 'Notification Details',
        width: 340,
        children: [
          {
            title: 'Is Interested',
            dataIndex: 'isInterested',
            key: 'isInterested',
            align: 'center',
            width: '14%',
            sorter: (a, b) => {
              const first = a.isInterested ? 1 : 0;
              const second = b.isInterested ? 1 : 0;
              return first - second;
            },
            sortOrder: sortedInfo.columnKey === 'isInterested' && sortedInfo.order,
            render: (isInterested, rowData) =>

              <span>
                <Tooltip placement="top" title={rowData.remarks} >
                  <Button type='primary' icon="info-circle" onClick={() => this.handleRemarksModal(rowData)} />
                </Tooltip>
                <Button type='primary' icon={isInterested ? "check" : "cross"} onClick={() => this.updateInterests(rowData)}
                  style={{ marginLeft: 15, backgroundColor: (isInterested ? 'green' : 'red') }} />
              </span>,
          },
          {
            title: 'Notify',
            dataIndex: 'isNotified',
            key: 'isNotified',
            align: 'center',
            width: '13%',
            render: (isNotified, rowData) => <Button type="primary" size="small" onClick={() => this.updateLastNotified(rowData)}>Click Me</Button>
          },
          {
            title: 'Last Notified',
            dataIndex: 'lastNotified',
            key: 'lastNotified',
            align: 'center',
            width: '15%',
            render: (text) => <div>{text ? new Date(text).toLocaleString() : ''}</div>
          }]
      },
      {
        title: 'Attended By',
        dataIndex: 'attendedBy',
        key: 'attendedBy',
        width: '14%',
        render: text => <Highlighter
        highlightClassName="highlightAttendedBy" searchWords={[attendedByName]}
        autoEscape={true} textToHighlight={text} />,
      }];

    return (
      <Spin spinning={loading}>
        <Search placeholder="Enter Name" onSearch={this.handleSubscriberName}
        onChange={(e) => this.handleSubscriberName(e.target.value)} value={subscriberName}
          style={{ marginBottom: 15, margin: '16px 0', marginLeft: 15, visible: true, width: '15%' }} />

        <Search placeholder="Enter Phone Number" onSearch={this.handleSubscriberPhoneNumber}
        onChange={(e) => this.handleSubscriberPhoneNumber(e.target.value)}  value={subscriberPhoneNumber}
          style={{ marginBottom: 15, margin: '16px 0', marginLeft: 25, visible: true, width: '20%' }} />

        <Search placeholder="Enter Attended By" onSearch={this.handleAttendedBy}
        onChange={(e) => this.handleAttendedBy(e.target.value)} value={attendedByName}
          style={{ marginBottom: 15, margin: '16px 0', marginLeft: 25, visible: true, width: '15%' }} />
       
        <Select style = {{ width: '14%', marginTop:20, marginBottom:-15, marginLeft: 25}} 
        placeholder="Select the Branch" onChange = {this.loadDataBasedOnCombo} defaultValue={defaultBranchName}> 
        {branchDetails.map( branchDetail => <Option value={branchDetail.id}>{branchDetail.branch_name}</Option> )}
        </Select>
        
        <Button type="primary" icon="download" size={'default'} onClick={this.downloadSubscriptionData}
          style={{ float: 'right', marginBottom: 15, marginRight: 25, marginTop: 15 }}> Download </Button>

        <RegistrationUpdateModal changeChild={this.changechild.bind(this)} onRef={ref => (this.child = ref)} />
        <Table dataSource={this.handleEnquiryTableData()} columns={columns} onChange={this.handleChange} size="small" pagination={{ pageSize: 8 }}
          style={{ align: 'center' }} bordered />
        <Modal title="Remarks" visible={modalVisible} onCancel={this.handleCancel}
          footer={[
            < Button key="back" onClick={this.handleCancel} > Cancel </Button>,
            < Button key="submit" type="primary" onClick={() => this.updateRemarks()}> Submit </Button>
          ]}>
          <Spin spinning={loading}>
            <TextArea placeholder="Enter The Remarks" allowClear onChange={(e) => this.setRemarks(e)} value={currentRemarks} />
          </Spin>

        </Modal>
      </Spin>);
  }
}

function mapStateToProps(state) {
  return {
    enquiryDetails: state.get('gym').get('getEnquiryDetails').toJS(),
    branchDetails: state.get('gym').get('getBranchDetails').toJS(),
    userToken: state.get('layout').get('checkUserToken').toJS(),
  };
}



export default withRouter(connect(mapStateToProps)(EnquiryViewContainer));