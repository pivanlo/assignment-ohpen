import React from 'react';
import ReactDOM from 'react-dom';
import { Link, Redirect } from "react-router-dom";
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { Auth } from "aws-amplify";

class Verify extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      verificationCode: "",
      formError: ""
    };

    this.handleChange = this.handleChange.bind(this);
    this.clearFormError = this.clearFormError.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    this.setState({ verificationCode: event.target.value });
  }

  clearFormError(event) {
    this.setState({ formError: null });
  }

  async handleSubmit(event) {
    event.preventDefault();

    const verificationCode = this.state.verificationCode;

    if (!verificationCode) {
      this.setState({ formError: 'The code cannot be empty' });
    }

    try {
      const response = await Auth.confirmSignUp(
        this.props.auth.username,
        verificationCode
      );
      this.props.history.push("/profile");
    } catch (error) {
      if (error.code === 'CodeMismatchException') {
        this.setState({ formError: 'The code is invalid.' });
      } else if (error.code === 'LimitExceededException'){
        this.setState({ formError: 'Attempt limit exceeded, please try again after later.' });
      } else {
        console.log(error);
      }
    }
  }

  render() {
    if (!this.props.auth.username) {
      return <Redirect to='/sign-in' />;
    }

    return (
      <div className="formContainer">
        <Form className="form-signin" onSubmit={this.handleSubmit}>
          <h1>Verification</h1>

          <Form.Group controlId="formGroupMobileNumber">
            <div className="mb-2">Please enter the verification code that was sent to your email.</div>
            <Form.Control type="number" value={this.state.verificationCode}
              onChange={this.handleChange}
              onFocus={this.clearFormError}
            />
          </Form.Group>

          <Button type="submit" variant="dark" block>Verify</Button>

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

export default Verify;
