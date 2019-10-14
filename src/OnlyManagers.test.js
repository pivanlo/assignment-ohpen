import React from 'react';
import OnlyManagers from "./OnlyManagers.js";
import { BrowserRouter } from 'react-router-dom';
import renderer from 'react-test-renderer';

it('renders correctly for managers', () => {
  const auth = {
    user: {
      attributes: {
        email: 'john.doe@gmail.com'
      }
    },
    isAuthenticated: true,
    isManager: () => true
  };

  const tree = renderer
    .create(
      <BrowserRouter>
        <OnlyManagers auth={auth} />
      </BrowserRouter>
    )
    .toJSON();

  expect(tree).toMatchSnapshot();
});

it('renders correctly for non-managers', () => {
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
        <OnlyManagers auth={auth} />
      </BrowserRouter>
    )
    .toJSON();

  expect(tree).toMatchSnapshot();
});
