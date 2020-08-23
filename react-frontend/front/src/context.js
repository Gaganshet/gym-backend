import React, { Component } from 'react';

export const LoginContext = React.createContext({});

class Context extends Component {
    constructor(props){
        super(props);
        this.state = {
            loginToken:{}
          }
        }      
  

  render() {
    return (
      <LoginContext.Provider value = {this.state}>
          {this.props.children}
      </LoginContext.Provider> 
    );
  }
}

export default Context;