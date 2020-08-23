import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import ReactDOM from 'react-dom';
import Highlighter from 'react-highlight-words';
import { Table, Tag, Switch, Button, Input, Select, Modal, Tooltip, Spin, message } from 'antd';
import { getSubscriptionDetails, updateIsInterested, updateIsNotified, 
  updateSubscriberRemarks, getBranchDetails } from './reduxFlow/homeActions';
import '../css/subscription.css';
import RegistrationUpdateModal from './container/registrationUpdateModal';
import { checkUserToken } from '../layout/reduxFlow/layoutActions';

const { Option } = Select;
const { Search } = Input;
const { TextArea } = Input;

class SubscriptionExpiryContainer extends Component {
  constructor(props) {
    super(props);
    this.tokenCheck();
  }

  state = {
    sortedInfo: null,
    subscriberName: '',
    subscriberId: null,
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
    const resultData = await getSubscriptionDetails(dispatch, branchId).catch(this.handleError);
    this.setState({ subscriberName: '', subscriberId: null, subscriberPhoneNumber: null });
  }
  
  calculateBalanceDays = (endOfSubscription) => {
    let currentDay = new Date(new Date().toLocaleDateString());
    let subsciptionEnddate = new Date(new Date(endOfSubscription).toLocaleDateString());
    let differenceInTime = subsciptionEnddate.getTime() - currentDay.getTime();
    let differenceInDays = differenceInTime / (1000 * 3600 * 24);
    return (<Tag color={differenceInDays > 10 ? "blue" : "red"} >{differenceInDays}</Tag >)
  }

  downloadSubscriptionData = () => {
    this.setState({ loading: true });
    const { subscriptionDetails, branchDetails } = this.props;
    const { currBranchId } = this.state;
    let currBranchName="";
    for(let i=0; i< branchDetails.length; i++){
      const { branch_name, id} = branchDetails[i];
      if(currBranchId === id){
        currBranchName = branch_name;
        break;
      }
    }
    
    var csvDataColumns = 'Branch Name, Member Name, Phone Number, Package Name, Expiring On, Remaining Days, Is Interested, Is Notified, Last Notified \n';
    subscriptionDetails.forEach(dataObj => {
      const { memberId, memberName, phoneNumber, packageDetails, endOfSubscription, isInterested, isNotified, lastNotified } = dataObj;
      let currentDay = new Date(new Date().toLocaleDateString());
      let subsciptionEnddate = new Date(new Date(endOfSubscription).toLocaleDateString());
      let differenceInTime = subsciptionEnddate.getTime() - currentDay.getTime();
      let balanceDays = differenceInTime / (1000 * 3600 * 24);

      csvDataColumns += currBranchName +","+ memberId + ',' + memberName + ',' + phoneNumber + ',' + packageDetails['package_name'] + ',' + endOfSubscription.split('T')[0] + ',' + balanceDays
        + ',' + (isInterested ? 'YES' : 'NO') + ',' + (isNotified ? 'YES' : 'NO');

      if (isNotified) {
        csvDataColumns += ',' + (lastNotified ? new Date(lastNotified).toLocaleString().replace(',', '') : '') + '\n';
      } else {
        csvDataColumns += '\n';
      }
    });

    const element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(csvDataColumns));
    element.setAttribute('download', `Subscribed Members Details.ods`);
    element.style.display = 'none';
    element.click();
    this.setState({ loading: false });
  }

  loadTableData = () => {
    const { subscriptionDetails } = this.props;
    let result = subscriptionDetails;
    const { subscriberName, subscriberPhoneNumber, subscriberId } = this.state;

    if (subscriberName) {
      result = subscriptionDetails && subscriptionDetails.filter(dataObj => ((dataObj.memberName !== null) && 
          (((dataObj.memberName.toLowerCase()).indexOf(subscriberName.toLowerCase())) != -1)));
    }
    if (subscriberPhoneNumber) {
      result = subscriptionDetails && subscriptionDetails.filter(dataObj => (((dataObj.phoneNumber.toString()).indexOf(subscriberPhoneNumber.toString())) != -1));
    }
    if (subscriberId) {
      result = subscriptionDetails && subscriptionDetails.filter(dataObj => (((dataObj.memberId.toString()).indexOf(subscriberId.toString())) != -1));
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

  handleSubscriberId = (subscriberId) => {
    this.setState({ loading: true });
    this.setState({ subscriberId });
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
    const { memberId, isInterested, id, memberName } = rowData;
    const { currBranchId } = this.state;
    const param = {
      memberId: id,
      isInterested: !isInterested
    }
    await updateIsInterested(dispatch, param);
    await getSubscriptionDetails(dispatch, currBranchId).catch(this.handleError);
    this.setState({ loading: false });
    message.success(`Interest has been updated successfully for -> ${memberName}`);
  }

  updateLastNotified = async (rowData) => {
    this.setState({ loading: true });
    const { dispatch } = this.props;
    const { currBranchId } = this.state;
    const { memberId, isNotified, id, memberName } = rowData;
    const param = {
      memberId: id,
      isNotified: true
    }

    await updateIsNotified(dispatch, param);
    await getSubscriptionDetails(dispatch, currBranchId).catch(this.handleError);
    this.setState({ loading: false });
    message.success(`Notification has been sent successfully to -> ${memberName}`);
  }

  updateRemarks = async () => {
    this.setState({ loading: true });
    const { currentRemarks, currentRowId, currBranchId} = this.state;
    const { dispatch } = this.props;
    const param = {
      memberId: currentRowId,
      remarks: currentRemarks
    }
    await updateSubscriberRemarks(dispatch, param);
    message.success(`remarks has been updated successfully`);
    await getSubscriptionDetails(dispatch, currBranchId).catch(this.handleError);
    this.handleCancel();
    this.setState({ loading: false });
  }

  openMemberModal = (row) => {
    row.openChildModal = true;
    this.child.parentMethod(row);
  }

  changechild = async () => {
    const { dispatch } = this.props;
    await getSubscriptionDetails(dispatch).catch(this.handleError);
  }

  setRemarks = (e) => {
    this.setState({ currentRemarks: e.target.value });
  }

  render() {
    const { subscriptionDetails, branchDetails } = this.props;
    const { isInterested } = subscriptionDetails;
    let { sortedInfo, modalVisible, loading, currentRemarks, defaultBranchName} = this.state;
    const { subscriberId, subscriberName, subscriberPhoneNumber } = this.state;
    sortedInfo = sortedInfo || {};

    const columns = [
      {
        title: 'Member ID',
        dataIndex: 'memberId',
        key: 'memberId',
        render: text => <Highlighter
          highlightClassName="highlightSubscriberId" searchWords={[subscriberId]}
          autoEscape={true} textToHighlight={text + ''} />,
          width: '8%',
      },
      {
        title: 'Member Name',
        dataIndex: 'memberName',
        key: 'memberName',
        width: '14%',
        render: (text, row) => <span>
          <Button onClick={() => this.openMemberModal(row)} icon="edit" size="small" shape="square" type="primary" ></Button>
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
      {
        title: 'Package Name',
        dataIndex: 'packageDetails.package_name',
        key: 'packageDetails',
        width: '12%',
      },
      {
        title: 'Expiring On',
        dataIndex: 'endOfSubscription',
        key: 'endOfSubscription',
        width: '10%',
        sorter: (a, b) => {
          if (a.endOfSubscription < b.endOfSubscription) {
            return -1;
          }
          return 1;
        },
        render: (text) => <div>{text ? text.split('T')[0] : ''}</div>,
        sortOrder: sortedInfo.columnKey === 'endOfSubscription' && sortedInfo.order
      },
      {
        title: 'Remaining Days',
        key: 'balanceDays',
        width: '10%',
        sorter: (a, b) => {
          if (a.balanceDays < b.balanceDays) {
            return -1;
          }
          return 1;
        },
        sortOrder: sortedInfo.columnKey === 'balanceDays' && sortedInfo.order,
        render: (firstParam, row) => this.calculateBalanceDays(row.endOfSubscription)
      },
      {
        title: 'Notification Details',
        width: '25%',
        children: [
          {
            title: 'Is Interested',
            dataIndex: 'isInterested',
            key: 'isInterested',
            align: 'center',
            width: '10%',
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
            width: '10%',
            render: (isNotified, rowData) => <Button type="primary" size="small" onClick={() => this.updateLastNotified(rowData)}>Click Me</Button>
          },
          {
            title: 'Last Notified',
            dataIndex: 'lastNotified',
            key: 'lastNotified',
            align: 'center',
            width: '15%',
            render: (text) => <div>{text ? new Date(text).toLocaleString().replace(',', '') : ''}</div>
          }]
      }];

    return (
      <Spin spinning={loading}>
        <Search placeholder="Enter the Name" onSearch={this.handleSubscriberName} 
        onChange={(e) => this.handleSubscriberName(e.target.value)} value={subscriberName}
          style={{ marginBottom: 15, margin: '16px 0', marginLeft: 15, visible: true, width: '15%' }} />

        <Search placeholder="Enter the Phone Number" onSearch={this.handleSubscriberPhoneNumber}
        onChange={(e) => this.handleSubscriberPhoneNumber(e.target.value)}  value={subscriberPhoneNumber}
          style={{ marginBottom: 15, margin: '16px 0', marginLeft: 25, visible: true, width: '20%' }} />

        <Search placeholder="Enter the Id" onSearch={this.handleSubscriberId} 
        onChange={(e) => this.handleSubscriberId(e.target.value)} value={subscriberId}
          style={{ marginBottom: 15, margin: '16px 0', marginLeft: 25, visible: true, width: '15%' }} />

        <Select style = {{ width: '14%', marginTop:20, marginBottom:-15, marginLeft: 25}} 
        placeholder="Select the Branch"  onChange = {this.loadDataBasedOnCombo} defaultValue={defaultBranchName}> 
        {branchDetails.map( branchDetail => <Option value={branchDetail.id}>{branchDetail.branch_name}</Option> )}
        </Select>
        
        <Button type="primary" icon="download" size={'default'} onClick={this.downloadSubscriptionData}
          style={{ float: 'right', marginBottom: 15, marginRight: 25, marginTop: 15 }}> Download </Button>

        <RegistrationUpdateModal changeChild={this.changechild.bind(this)} onRef={ref => (this.child = ref)} />

        <Table dataSource={this.loadTableData()} columns={columns} onChange={this.handleChange} size="small" pagination={{ pageSize: 8 }}
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
    subscriptionDetails: state.get('gym').get('getSubscriptionDetails').toJS(),
    branchDetails: state.get('gym').get('getBranchDetails').toJS(),
    userToken: state.get('layout').get('checkUserToken').toJS(),
  };
}



export default withRouter(connect(mapStateToProps)(SubscriptionExpiryContainer));