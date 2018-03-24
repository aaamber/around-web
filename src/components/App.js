import React, { Component } from 'react';
import {Header} from './Header';
import {Main} from './Main';
import {TOKEN_KEY} from "../constants"
import '../styles/App.css';

class App extends Component {
  state = {
    isLoggedIn: Boolean(localStorage.getItem(TOKEN_KEY)),
  }

  handleLogIn = (token) => {
    localStorage.setItem(TOKEN_KEY, token);
    this.setState({isLoggedIn: true});
  }

  render() {
    return (
      <div className="App">
        <Header/>
        <Main isLoggedIn={this.state.isLoggedIn} handleLogin={this.handleLogIn}/>
        <p className="App-intro">
        </p>
      </div>
    );
  }
}

export default App;
