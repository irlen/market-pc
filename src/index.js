import React from 'react';
import ReactDOM from 'react-dom';
import { createStore, compose, applyMiddleware } from 'redux'
import { Provider } from 'react-redux'
import { HashRouter } from 'react-router-dom'
//redux中间件
import logger from 'redux-logger'
import thunk from 'redux-thunk'
import promiseMiddleware from 'redux-promise'


import reducers from './redux/reducers'
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
const store = createStore(
  reducers,
  applyMiddleware(thunk,promiseMiddleware,logger)
)
ReactDOM.render(
  <div>
    <Provider store={store}>
      <HashRouter>
        <App />
      </HashRouter>
    </Provider>
  </div>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
