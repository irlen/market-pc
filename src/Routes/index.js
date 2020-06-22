/** @jsx jsx */
import React from 'react'
import {
  Route,
  Switch,
  Redirect
} from 'react-router-dom'

import { jsx, css } from '@emotion/core'
import styled from '@emotion/styled'
import { userAuth } from '../components/UserAuth'
import { base64Decode } from '../components/Base64'


import Authenticated from './Authenticated'
import VerticFail from './VerticFail'
import VerticFailForApp from './VerticFailForApp'

import Login from '../Login'



//后台管理页面
import Admin from '../Admin'


//防火墙页面
import FireDevice from '../FireDevice'
import RecordConfig from '../RecordConfig'
import OrderList from '../OrderList'

const getEdificate = ()=>{
  let edificate = 0
  if(localStorage.user_token){
    const user_token = localStorage.user_token
    const userArr = user_token.split('.')
    const userInfo = JSON.parse(base64Decode(userArr[1]))
    edificate = userInfo.type
  }
  return edificate
}
const ARoute = (props)=>(
  <div>
    <Switch>
      <Route path='/login' exact render={()=> <Login />} />
      <Route path='/admin' render={()=><Admin />}/>
      <Redirect from='/' to='/admin' />
    </Switch>
  </div>
);
export const AppRoute = ARoute

const isAdmin = ()=>{
  let roleId = '3'
  if(localStorage.user_token){
    const user_token = localStorage.user_token
    const userArr = user_token.split('.')
    const userInfo = JSON.parse(base64Decode(userArr[1]))
    roleId = userInfo.role
  }
   if(roleId === "1" || roleId === "2"){
     return true
   }else{
     return false
   }
}

export const SubAdminRoute = () => (
    <div>
      {
       //管理
      }
      <Route path='/admin/set/firedevice' exact render={
        ()=>//localStorage.user_token?
        <FireDevice />
        //:<VerticFail />
      } />
      <Route path='/admin/record/recordconfig' exact render={()=><RecordConfig />} />
      <Route path='/admin/order/orderlist' exact render={()=><OrderList />} />
  </div>
)
