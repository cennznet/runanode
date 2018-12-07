import '@babel/polyfill';
import './scss/styles.scss';

import React from 'react';
import { render } from 'react-dom';
import App from './App';

render(<App />, document.getElementById('root'));
