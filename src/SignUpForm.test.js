import React from 'react';
import SignUpForm from "./SignUpForm.js";
import { BrowserRouter } from 'react-router-dom';
import renderer from 'react-test-renderer';

it('renders correctly', () => {
  const tree = renderer
    .create(
      <BrowserRouter>
        <SignUpForm />
      </BrowserRouter>
    )
    .toJSON();

  expect(tree).toMatchSnapshot();
});
