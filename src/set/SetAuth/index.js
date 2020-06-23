/** @jsx jsx */
import { jsx } from '@emotion/core'
import styled from '@emotion/styled'
import React, { useState, useEffect, useRef } from 'react'
import { connect } from 'react-redux'
import _ from 'lodash'
import { Scrollbars } from 'react-custom-scrollbars'
import { Tabs } from 'antd'


import { wyAxiosPost } from '../../components/WyAxios'
import { curTheme } from '../../styles/defineColor'
import Ldap from './Ldap'
import Radius from './Radius'

const { TabPane } = Tabs
function SetAuth(props){
  const [ curTab,setCurTab ] =  useState("ldap")
  //做初始化
  useEffect(()=>{

  },[])

  function tabChange(value){
    setCurTab(value)
  }
  return (
    <div style={{background:curTheme.moduleBg,padding:"20px"}}>
      <Tabs defaultActiveKey="1"
        activeKey={curTab}
        onChange={tabChange}
      >
        <TabPane tab="LDAP" key="ldap">
          <Ldap />
        </TabPane>
        <TabPane tab="RADIUS" key="radius">
          <Radius />
        </TabPane>
      </Tabs>
    </div>
  )
}


export default SetAuth
