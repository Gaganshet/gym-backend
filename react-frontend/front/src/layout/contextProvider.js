import React, { Component } from 'react';

export const LoginContext = React.createContext({});

class ContextProvider extends Component {

  state = {
    loginToken:"checking"
  }

  render() {
    return (
      <div>
        
      </div>
    );
  }
}

export default ContextProvider;