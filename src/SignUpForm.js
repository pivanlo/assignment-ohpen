import React from 'react';
import ReactDOM from 'react-dom';
import { Link } from "react-router-dom";
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { Auth } from "aws-amplify";
import FormErrors from "./FormErrors.js";

class SignUpForm extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      username: "",
      email: "",
      password: "",
      formError: ""
    };

    this.handleUsernameChange = this.handleUsernameChange.bind(this);
    this.handleEmailChange = this.handleEmailChange.bind(this);
    this.handlePasswordChange = this.handlePasswordChange.bind(this);
    this.clearFormError = this.clearFormError.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleUsernameChange(event) {
    this.setState({ username: event.target.value });
  }

  handleEmailChange(event) {
    this.setState({ email: event.target.value });
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
    const email = this.state.email;
    const password = this.state.password;

    const formError = this.validateForm(username, email, password);

    if (formError) {
      return;
    }

    // We will need the username later if the user still
    // needs to be verified.
    this.props.auth.setUsername(username);

    let response;
    try {
      response = await Auth.signUp({
        username,
        password,
        attributes: {
          email: email
        }
      });
      this.props.history.push("/verify");
    } catch (error) {
      if (error.code === "UsernameExistsException") {
        this.setState({ formError: 'User already exists.' });
      } else {
        console.log(error);
      }
    }
  }

  validateForm(username, email, password) {
    let message;

    if (!username) {
      message = 'The username cannot be empty.';
    } else if (!isEmail(email)) {
      message = 'The email is not valid.';
    } else if (!password) {
      message = 'The password cannot be empty.';
    } else if (password.length < 8) {
      message = 'The password is too short (minimum length is 8 characters).';
    } else if (!hasLowerCase(password)) {
      message = 'The password must have lowercase characters.'
    } else if (!hasUpperCase(password)) {
      message = 'The password must have uppercase characters.'
    } else if (!hasNumber(password)) {
      message = 'The password must have numeric characters.'
    } else if (!hasSpecialCharacter(password)) {
      message = 'The password must have special characters.'
    }

    this.setState({ formError: message });
    return message;
  }

  render() {
    return (
      <div className="formContainer">
        <Form className="form-signin" onSubmit={this.handleSubmit}>
          <h1>Sign up</h1>

          <Form.Group controlId="formGroupUsername">
            <Form.Label>Username</Form.Label>
            <Form.Control type="text" value={this.state.username}
              onChange={this.handleUsernameChange}
              onFocus={this.clearFormError}
            />
          </Form.Group>

          <Form.Group controlId="formEmail">
            <Form.Label>Email</Form.Label>
            <Form.Control type="email" value={this.state.email}
              onChange={this.handleEmailChange}
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

          <Button type="submit" variant="dark" block>Sign up</Button>

          {!this.state.formError &&
            <div className="mt-3">
              <span>I'm already a member, </span>
              <Link to="/sign-in">Sign in</Link>
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

export default SignUpForm;

// =================================

function hasLowerCase(str) {
  return (/[a-z]/.test(str));
}

function hasUpperCase(str) {
  return (/[/A-Z]/.test(str));
}

function hasNumber(str) {
  return /\d/.test(str);
}

function hasSpecialCharacter(str) {
  return /[$^*.\[\]{}()?\-"!@#%&\/\\,><':;|_~`]/.test(str);
}

function isEmail(str) {
  var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(str.toLowerCase());
}
