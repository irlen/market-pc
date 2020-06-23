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

const { TabPane } = Tabs
function ChangeSecurity(props){
  //做初始化
  useEffect(()=>{

  },[])


  return (
    <div style={{background:curTheme.moduleBg,padding:"20px"}}>
      安全变更
    </div>
  )
}


export default ChangeSecurity
