import React, { Component } from 'react';
import { Switch, Input, Button, Drawer, Table, Tag, Spin, Row, Col, Select, message as AntMessage } from 'antd';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { getDrawerDetails, updateSwitchChange, userLogout } from '../reduxFlow/homeActions';
import { checkUserToken } from '../../layout/reduxFlow/layoutActions';
import Highlighter from 'react-highlight-words';
import InquiryForm from './inquiry';
import { getBranchDetails } from '../../gym/reduxFlow/homeActions';

const { Option } = Select;

class AttendanceDrawer extends Component {
   constructor(props) {
      super(props);
      this.state = {
         visible: false,
         userName: null,
         userId: null,
         filterData: null,
         loading: false,
         switchBoolean: '',
         switchClick: false,
         defaultBranchName: "THORAIPAKKAM",
         currBranchId: ""
      }
      this.tokenCheck();
   }

   tokenCheck = async () => {
      const { dispatch } = this.props;
      await checkUserToken(dispatch);
   }


   componentDidMount = async () => {
      const { dispatch } = this.props;
      const { defaultBranchName } = this.state;
      const branchList = await getBranchDetails(dispatch).catch(this.handleError);

      for(let i=0; i<branchList.data.length; i++){
        const { branch_number ,branch_name, id} = branchList.data[i];
        console.log('branchList.data',branchList.data)
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
      const resultData = await getDrawerDetails(dispatch, branchId).catch(this.handleError);
   }

   showDrawer = async () => {
      const { dispatch } = this.props
      const {currBranchId} = this.state;
      this.setState({ loading: true });
      await getDrawerDetails(dispatch, currBranchId);
      this.setState({ visible: true, loading: false });
   };

   onClose = () => {
      this.setState({
         visible: false
      });
   };

   onChange = async (row, switchBoolean) => {
      await this.rowClick(row, switchBoolean);
   }

   rowClick = async (record, switchBoolean) => {
      const { dispatch } = this.props;
      const {currBranchId} = this.state;
      let switchtype = switchBoolean ? 0 : 1
      let requestData = {
         memberId: record.id,
         logType: switchtype
      }
      await updateSwitchChange(dispatch, requestData);
      await getDrawerDetails(dispatch, currBranchId);
      this.setState({ loading: false });

   }

   sortName = () => {
      const { drawerDetails } = this.props;
      let sortedArray = drawerDetails.sort((a, b) => {
         let x = a[name];
         let y = b[name];
         return ((x < y) ? -1 : ((x > y) ? 1 : 0));
      })
   }

   handleError = (err) => {
      if (status == 200) {
         form.resetFields();
         AntMessage.success(`${values.name} has been successfully registered as Member`);
      } else {
         AntMessage.error(`${err.message}`);
         this.setState({ loading: false });
      }
      this.setState({ loading: false });;
   }

   handleUserName = (userName) => {
      const { filterData } = this.state;
      const { drawerDetails } = this.props;
      let resultData = null;
      if (userName) {
         resultData = drawerDetails && drawerDetails.filter(dataObj =>
            (dataObj.memberName.toLowerCase()).indexOf(userName.toLowerCase()) != -1 || (dataObj.memberId.toString()).indexOf(userName) != -1);
      }
      this.setState({ filterData: resultData })
   }

   calculateBalanceDays = (endOfSubscription) => {
      let currentDay = new Date(new Date().toLocaleDateString());
      let subsciptionEnddate = new Date(new Date(endOfSubscription).toLocaleDateString());
      let differenceInTime = subsciptionEnddate.getTime() - currentDay.getTime();
      let differenceInDays = differenceInTime / (1000 * 3600 * 24);
      return (<Tag color={differenceInDays > 10 ? "blue" : "red"} >{differenceInDays}</Tag >)
   }

   handleLogout = async () => {
      const { userToken, dispatch, history } = this.props;
      const responseData = await userLogout(dispatch, userToken[0]);
      history.push('/home');
   }

   render() {
      const { filterData, loading, switchBoolean, defaultBranchName } = this.state;
      const { drawerDetails, userToken, userLogin, branchDetails } = this.props;
      let dataResult = filterData == null ? drawerDetails : (filterData.length == 0 ? filterData : filterData);

      const columns = [
         {
            title: 'Name',
            dataIndex: 'memberName',
            key: 'memberName',

            width: '20%',
            render: (text, row) =>

               <span style={{ marginLeft: 10 }} ><Tag color="grey">{text}
               </Tag></span>

         },
         {
            title: 'MemberId',
            dataIndex: 'memberId',
            key: 'memberId',
            align: 'center',
            width: '20%',
            sortDirections: ['descend', 'ascend'],
            sorter: (a, b) => a.memberId - b.memberId,
         },
         {
            title: 'Remaining Days',
            dataIndex: 'endOfSubscription',
            key: 'balanceDays',
            align: 'center',
            width: 110,
            render: (endOfSubscription) => this.calculateBalanceDays(endOfSubscription),
         },
         {
            title: 'IN/OUT',
            dataIndex: 'isPresentNow',
            key: 'isPresentNow',
            width: '12%',
            align: 'center',
            render: (text, row) => {
               return <Switch checkedChildren="In" unCheckedChildren="Out" checked={switchBoolean == '' ? (text ? true : false) : switchBoolean} onChange={(onOff) => this.onChange(row, onOff)} />
            }
         },
      ];
      const { Search } = Input;

      const { visible } = this.state;

      return (
         <div>

            {userToken.length > 0 &&
               <Row gutter={[8, 8]}>
                  <Col span={6}>
                     <Button style={{ left: '40%', marginTop: 15, marginBottom: 15, marginLeft: 15 }} onClick={this.showDrawer} type="primary" icon="user">
                        Entry Check
                     </Button>
                  </Col>
                  <Col span={10} >
                     <Button style={{ left: '70%', marginTop: 15, marginBottom: 15, marginLeft: 15 }} onClick={this.handleLogout} type="primary" icon="user">
                        Logout
                     </Button>
                  </Col>
               </Row>}

            <Spin spinning={loading} >
               <Drawer
                  placement="right"
                  title="Members - Entry Check"
                  onClose={this.onClose}
                  visible={visible}
                  width='40%'
               >
                  <React.Fragment>

                     <Select style={{ width: '35%', marginTop: 5, marginBottom: 15 }}
                        placeholder="Select the Branch" onChange = {this.loadDataBasedOnCombo} defaultValue={defaultBranchName}>
                        {branchDetails.map(branchDetail => <Option value={branchDetail.id}>{branchDetail.branch_name}</Option>)}
                     </Select>

                     <Search style={{ marginBottom: 15 }} placeholder="Search for Name,ID" onSearch={this.handleUserName} enterButton />
                  </React.Fragment>
                  <Table
                     rowKey={record => record.memberId}

                     dataSource={dataResult} columns={columns} bordered onChange={this.sortName} />
               </Drawer>
            </Spin>
         </div>
      );
   }
}

function mapStateToProps(state) {
   return {
      drawerDetails: state.get('home').get('getDrawerDetails').toJS(),
      branchDetails: state.get('gym').get('getBranchDetails').toJS(),
      userToken: state.get('layout').get('checkUserToken').toJS(),
      userLogin: state.get('home').get('checkUserLogin').toJS()
   };
}


export default withRouter(connect(mapStateToProps)(AttendanceDrawer));
