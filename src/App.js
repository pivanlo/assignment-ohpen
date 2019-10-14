import React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route
} from "react-router-dom";
import SignUpForm from "./SignUpForm.js";
import Verify from "./Verify.js";
import SignInForm from "./SignInForm.js";
import Profile from "./Profile.js";
import OnlyManagers from "./OnlyManagers.js";
import { Auth } from "aws-amplify";
import './App.css';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isAuthenticated: false,
      isAuthenticating: true,
      user: null,
      username: null
    };

    this.setAuthStatus = this.setAuthStatus.bind(this);
    this.setUser = this.setUser.bind(this);
    this.setUsername = this.setUsername.bind(this);
    this.isManager = this.isManager.bind(this);
  }

  setAuthStatus(authenticated) {
    this.setState({ isAuthenticated: authenticated });
  }

  setUser(user) {
    this.setState({ user: user });
  }

  setUsername(username) {
    this.setState({ username: username });
  }

  isManager() {
    const userGroups =
      this.state.user &&
      this.state.user.signInUserSession.accessToken.payload['cognito:groups'];

    if (userGroups && userGroups.length && userGroups[0] === 'Managers') {
      return true;
    }
    return false;
  }

  async componentDidMount() {
    try {
      const session = await Auth.currentSession();
      this.setAuthStatus(true);
      const user = await Auth.currentAuthenticatedUser();
      this.setUser(user);
    } catch(error) {
      console.log(error);      
    }
    this.setState({ isAuthenticating: false });
  }

  render() {
    const auth = {
      isAuthenticated: this.state.isAuthenticated,
      user: this.state.user,
      username: this.state.username,
      setAuthStatus: this.setAuthStatus,
      setUser: this.setUser,
      setUsername: this.setUsername,
      isManager: this.isManager
    };

    return (
      !this.state.isAuthenticating &&
      <Switch>
        <Route path="/sign-in" render={(props) => <SignInForm {...props} auth={auth} />} />
        <Route path="/sign-up" render={(props) => <SignUpForm {...props} auth={auth} />} />
        <Route path="/verify" render={(props) => <Verify {...props} auth={auth} />} />
        <Route path="/profile" render={(props) => <Profile {...props} auth={auth} />} />
        <Route path="/only-managers" render={(props) => <OnlyManagers {...props} auth={auth} />} />
        <Route path="/" render={(props) => <SignInForm {...props} auth={auth} />} />
      </Switch>
    )
  }
}

export default App;
