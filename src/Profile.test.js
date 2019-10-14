import React from 'react';
import Profile from "./Profile.js";
import { BrowserRouter } from 'react-router-dom';
import renderer from 'react-test-renderer';

it('renders correctly', () => {
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
        <Profile auth={auth} />
      </BrowserRouter>
    )
    .toJSON();

  expect(tree).toMatchSnapshot();
});
