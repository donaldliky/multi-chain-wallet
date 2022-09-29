import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { MoralisProvider } from "react-moralis";

import './index.css';
import { serverUrl, appId } from './config/config'

ReactDOM.render(
  <MoralisProvider appId={appId} serverUrl={serverUrl}>
    <App />
  </MoralisProvider>,
  document.getElementById('root')
);