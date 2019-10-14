import React from 'react';
import ReactDOM from 'react-dom';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import Form from 'react-bootstrap/Form';
import { Link, Redirect } from "react-router-dom";
import { Auth } from "aws-amplify";

class Profile extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      username: props.auth.user && props.auth.user.username,
      email: props.auth.user && props.auth.user.attributes.email
    };

    this.handleSignOutClick = this.handleSignOutClick.bind(this);
  }

  async handleSignOutClick(event) {
    event.preventDefault();

    try {
      await Auth.signOut();

      this.props.auth.setAuthStatus(false);
      this.props.auth.setUser(null);
    } catch(error) {
      console.log(error);
    }
  }

  render() {
    if (!this.props.auth.isAuthenticated) {
      return <Redirect to='/sign-in' />;
    }

    // Show a link to a second page if the current user is a manager.
    let managersLink = null;
    if (this.props.auth.isManager()) {
      managersLink = <Link to="/only-managers">Only managers</Link>;
    }

    return (
      <div>
        <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
          <Navbar.Brand href="#home">Ohpen</Navbar.Brand>
          <Nav className="ml-auto">
            <Nav.Link href="#" onClick={this.handleSignOutClick}>Sign out</Nav.Link>
          </Nav>
        </Navbar>

        <div className="container mt-5">
          <Form onSubmit={this.handleSubmit}>
            <h1 className="mb-4">Profile</h1>

            <Form.Group controlId="formGroupUsername">
              <b><Form.Label>Username</Form.Label></b>
              <Form.Control type="text" readOnly plaintext value={this.state.username} />
            </Form.Group>

            <Form.Group controlId="formGroupMobileNumber">
              <b><Form.Label>Email</Form.Label></b>
              <Form.Control type="email" readOnly plaintext value={this.state.email} />
            </Form.Group>
          </Form>

          <div>{managersLink}</div>
        </div>
      </div>
    );
  }
}

export default Profile;
