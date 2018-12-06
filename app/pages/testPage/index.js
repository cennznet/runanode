import React from 'react';
import withContainer from './container';

const TestPage = ({ text }) => {
  return <h1>{text}</h1>;
};

export default withContainer(TestPage);
