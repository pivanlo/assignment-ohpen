import React from 'react';
import SignInForm from "./SignInForm.js";
import { BrowserRouter } from 'react-router-dom';
import renderer from 'react-test-renderer';

it('renders correctly for unauthenticated users', () => {
  const auth = {
    user: {
      attributes: {
        email: 'john.doe@gmail.com'
      }
    },
    isAuthenticated: false,
    isManager: () => false
  };

  const tree = renderer
    .create(
      <BrowserRouter>
        <SignInForm auth={auth} />
      </BrowserRouter>
    )
    .toJSON();

  expect(tree).toMatchSnapshot();
});

it('renders correctly for authenticated users', () => {
  const auth = {
    user: {
      attributes: {
        email: 'john.doe@gmail.com'
      }
    },
    isAuthenticated: true,
    isManager: () => false
  };

  const tree = renderer
    .create(
      <BrowserRouter>
        <SignInForm auth={auth} />
      </BrowserRouter>
    )
    .toJSON();

  expect(tree).toMatchSnapshot();
});
