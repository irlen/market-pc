
import React from 'react'
import {
  Route,
  Switch,
  Redirect
} from 'react-router-dom'

import Frame from '../Frame'
import Login from '../Login'
//系统设置组件
import SetMonitor from '../set/SetMonitor'


//配置查看
import LookSet from '../look/LookSet'


//配置变更
import ChangeRequest from '../change/ChangeRequest'


export const FirstRoute = ()=>
  {
    return <div>
      <Switch>
        <Route path='/login' exact render={()=>  <Login /> } />
        <Route onEnter={()=>{console.log("/app")}} path='/app' render={()=>  <Frame /> } />
        <Redirect onEnter={()=>{console.log("/")}} from='/' to='/app' />
      </Switch>
    </div>
  }

export const ARoute = ()=>(
  <div>
      <Route onEnter={()=>{console.log("/app/set/setmonitor")}} path='/app/set/setmonitor' exact render={()=>  <SetMonitor />}/>
      <Route path='/app/look/lookset' exact render={()=>  <LookSet />}/>
      <Route path='/app/change/changerequest' exact render={()=>  <ChangeRequest />}/>
      {
        <Redirect from='/' exact to='/app/change/changerequest' />
      }

  </div>
)
