import React from 'react';
import ReactDOM from 'react-dom';
import { Link, Redirect } from "react-router-dom";
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { Auth } from "aws-amplify";

class SignInForm extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      username: "",
      password: "",
      formError: ""
    };

    this.handleUsernameChange = this.handleUsernameChange.bind(this);
    this.handlePasswordChange = this.handlePasswordChange.bind(this);
    this.clearFormError = this.clearFormError.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleUsernameChange(event) {
    this.setState({ username: event.target.value });
  }

  handlePasswordChange(event) {
    this.setState({ password: event.target.value });
  }

  clearFormError(event) {
    this.setState({ formError: null });
  }

  async handleSubmit(event) {
    event.preventDefault();

    const username = this.state.username;
    const password = this.state.password;

    const formError = this.validateForm(username, password);

    if (formError) {
      return;
    }

    // We will need the username later if the user still
    // needs to be verified.
    this.props.auth.setUsername(username);

    try {
      const user = await Auth.signIn(
        this.state.username,
        this.state.password
      );

      this.props.auth.setAuthStatus(true);
      this.props.auth.setUser(user);

    } catch (error) {
      if (error.code === "UserNotConfirmedException") {
        this.props.history.push("/verify");
      } else {
        this.setState({ formError: 'Incorrect username or password.' });
      }
    }
  }

  validateForm(username, password) {
    let message;

    if (!username) {
      message = 'The username cannot be empty.';
    } else if (!password) {
      message = 'The password cannot be empty.';
    }

    this.setState({ formError: message });
    return message;
  }

  render() {
    if (this.props.auth.isAuthenticated && this.props.auth.user) {
      return <Redirect to='/profile' />;
    }

    return (
      <div className="formContainer">
        <Form className="form-signin" onSubmit={this.handleSubmit}>
          <h1>Sign in</h1>

          <Form.Group controlId="formGroupUsername">
            <Form.Label>Username</Form.Label>
            <Form.Control type="text" value={this.state.username}
              onChange={this.handleUsernameChange}
              onFocus={this.clearFormError}
            />
          </Form.Group>

          <Form.Group controlId="formGroupPassword">
            <Form.Label>Password</Form.Label>
            <Form.Control type="password" value={this.state.password}
              onChange={this.handlePasswordChange}
              onFocus={this.clearFormError}
            />
          </Form.Group>

          <Button type="submit" variant="dark" block>Sign in</Button>

          {!this.state.formError &&
            <div className="mt-3">
              <span>I'm a new user, </span>
              <Link to="/sign-up">Sign up</Link>
            </div>
          }

          {this.state.formError &&
            <div className="mt-3">
              <b>{this.state.formError}</b>
            </div>
          }
        </Form>
      </div>
    );
  }
}

export default SignInForm;
