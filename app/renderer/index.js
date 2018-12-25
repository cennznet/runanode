import '@babel/polyfill';
import React from 'react';
import { render } from 'react-dom';

import App from './App';
import '../app.global.css';
import './scss/styles.scss';

render(<App />, document.getElementById('root'));
