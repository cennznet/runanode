import React from 'react';
import withContainer from './container';
import packageJson from '../../../../package.json';

const TestPage = ({ text }) => {
  return (
    <div>
      {text}
      <div>{packageJson.version}</div>
    </div>
  );
};

export default withContainer(TestPage);
