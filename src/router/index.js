
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
import SetGroup from '../set/SetGroup'
import SetUser from '../set/SetUser'
import SetAuth from '../set/SetAuth'
import SetPlatform from '../set/SetPlatform'

//配置查看
import LookSet from '../look/LookSet'
import PageForCom from '../look/LookSet/PageForCom'
import PageForSee from '../look/LookSet/PageForSee'
//配置变更
import ChangeRequest from '../change/ChangeRequest'
import ChangeSecurity from '../change/ChangeSecurity'
import ChangeTask from '../change/ChangeTask'
export const FirstRoute = ()=>
  {
    return <div>
      <Switch>
        <Route path='/login' exact render={()=>  <Login /> } />
        <Route path='/pageforcom/:id' exact render={()=>  <PageForCom /> }/>
        <Route path='/pageforsee/:id' exact render={()=>  <PageForSee /> }/>
        <Route onEnter={()=>{console.log("/app")}} path='/app' render={()=>  <Frame /> } />
        <Redirect onEnter={()=>{console.log("/")}} from='/' to='/app' />
      </Switch>
    </div>
  }

export const ARoute = ()=>(
  <div>
      <Route onEnter={()=>{console.log("/app/set/setmonitor")}} path='/app/set/setmonitor' exact render={()=>  <SetMonitor />}/>
      <Route path='/app/set/setgroup' exact render={()=>  <SetGroup />}/>
      <Route path='/app/set/setuser' exact render={()=>  <SetUser />}/>
      <Route path='/app/set/setauth' exact render={()=>  <SetAuth />}/>
      <Route path='/app/set/setplatform' exact render={()=>  <SetPlatform />}/>
      <Route path='/app/look/lookset' exact render={()=>  <LookSet />}/>
      <Route path='/app/change/changerequest' exact render={()=>  <ChangeRequest />}/>
      <Route path='/app/change/changetask' exact render={()=>  <ChangeTask />}/>
      <Route path='/app/change/changesecurity' exact render={()=>  <ChangeSecurity />}/>
      {
        <Redirect from='/' exact to='/app/change/changerequest' />
      }

  </div>
)
