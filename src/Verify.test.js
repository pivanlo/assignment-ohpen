import React from 'react';
import Verify from "./Verify.js";
import { BrowserRouter } from 'react-router-dom';
import renderer from 'react-test-renderer';

it('renders correctly', () => {
  const auth = {
    username: 'john',
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
        <Verify auth={auth} />
      </BrowserRouter>
    )
    .toJSON();

  expect(tree).toMatchSnapshot();
});
