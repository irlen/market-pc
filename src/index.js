/** @jsx jsx */
import { jsx } from '@emotion/core'
import React from 'react';
import ReactDOM from 'react-dom';

import { createStore, compose, applyMiddleware } from 'redux'
import { Provider } from 'react-redux'

import { AppContainer } from 'react-hot-loader'//web服务器热加载
import { BrowserRouter } from 'react-router-dom'
import { ConfigProvider  } from 'antd';
import zh_CN from 'antd/lib/locale-provider/zh_CN';
import 'moment/locale/zh-cn';
//redux中间件
import logger from 'redux-logger'
import thunk from 'redux-thunk'
import promiseMiddleware from 'redux-promise'

//import DevTools from './reduxDevTools'//redux开发模式下调试工具
import reducers from './reducers'
import App from './App';
import registerServiceWorker from './registerServiceWorker'
//const enhancer = compose(applyMiddleware(thunk,promiseMiddleware,logger),DevTools.instrument())
const store = createStore(
  reducers,
  applyMiddleware(thunk,promiseMiddleware,logger)
)
const render = Component=>{
  const renderMethod = module.hot?ReactDOM.render:ReactDOM.hydrate
  renderMethod(
      <AppContainer>
        <Provider store={store}>
          <ConfigProvider  locale={zh_CN}>
            <BrowserRouter>
                <Component />
            </BrowserRouter>
          </ConfigProvider >
        </Provider>
      </AppContainer>,
    document.getElementById('root')
  )
}
render(App)
if(module.hot){
  module.hot.accept('./App',()=>{
    render(App)
  })
}

registerServiceWorker();
