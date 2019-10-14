import React from 'react';
import ReactDOM from 'react-dom';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import { Link, Redirect } from "react-router-dom";
import { Auth } from "aws-amplify";

class OnlyManagers extends React.Component {
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
    if (!this.props.auth.isManager()) {
      return <Redirect to='/' />;
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
          <h1 className="mb-4">Only Managers</h1>
          <p>This page is only accesible to managers.</p>
        </div>
      </div>
    );
  }
}

export default OnlyManagers;
