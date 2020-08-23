import React , { Component } from "react";
import { Layout , Menu, Icon } from 'antd';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import '../css/layout.css';
import {getSideMenuChange, checkUserToken} from './reduxFlow/layoutActions';
import { menuList } from './menuConstants.js';
import ContextProvider from "./contextProvider";
import { LoginContext } from "../context";

const { Sider } = Layout;

class Sidemenu extends Component {
    constructor(props){
        super(props);
        this.state ={

        }
    }

    componentDidMount = async() =>{
        const {dispatch} = this.props;
        let data = '';
        await getSideMenuChange(dispatch,data);
        await checkUserToken(dispatch);
      }

    sideMenuChange = async(context, path , sideMenuName) => {
        console.log();
        const {dispatch , history} = this.props;
        let data = sideMenuName;
        await getSideMenuChange(dispatch,data); 
        history.push(path);
    }

    render(){
        const {toggleStatus , history , userToken} = this.props;
        return(
         <LoginContext.Consumer>
           {(context) => { 
             return(
          <Sider trigger={null} collapsible collapsed={toggleStatus}>
            <div className={toggleStatus? "logo":"logo_full"} />
            <Menu theme="dark" mode="inline" defaultSelectedKeys={['1']}>
                {menuList.map((item,i) =>
                <Menu.Item key={"m"+i} onClick={()=>{userToken.length >0 ?  this.sideMenuChange(context , item.path , item.mainMenu) :history.push('/')}} >
                  <Icon type={item.icon} />
                  <span style={{ color :"#ffffff"}} >{item.mainMenu}</span>
                </Menu.Item>
                )}
            </Menu>
        </Sider>
           )}
          }
          </LoginContext.Consumer> 
         
        )
    }
}

function mapStateToProps(state) {
	return {
    toggleStatus: state.get('layout').get('getToggleChange'),
    userToken: state.get('layout').get('checkUserToken').toJS(),
	};
}

export default withRouter(connect(mapStateToProps)(Sidemenu));
