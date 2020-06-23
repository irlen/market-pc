/** @jsx jsx */
import { jsx } from '@emotion/core'
import styled from '@emotion/styled'
import React, { useState, useEffect, useRef } from 'react'
import { connect } from 'react-redux'
import _ from 'lodash'
import { Scrollbars } from 'react-custom-scrollbars'
import { Tabs, Tree, Input, message, Button, Empty, Modal } from 'antd'
import { FaNewspaper } from 'react-icons/fa'
import { withRouter } from 'react-router-dom'


import { curTheme } from '../../../styles/defineColor'
import { base64Decode } from '../../../components/Base64'
import { wyAxiosPost } from '../../../components/WyAxios'
import Compare from './Compare'
import CompareReport from './CompareReport'

function PageForCom(props){
  const [ windowH,setWindowH ]  = useState(0);
  const [ pageInfo,setPageInfo ] = useState({})
  useEffect(()=>{
    setWindowH(props.windowH);
    const param = JSON.parse(base64Decode(props.match.params.id))
  const { deviceId,deviceName,ids,modalType} = param
    console.log(param)
    setPageInfo({deviceId,deviceName,ids,modalType})
  },[])


  return (
    <div>
      <div style={{fontWeight:"bold",lineHeight:"40px",paddingLeft:"20px", borderBottom: curTheme.border}}>
        {pageInfo.deviceName}
      </div>
      <div style={{padding:"20px"}}>
        {
          pageInfo.modalType === 'compare'?
          <Compare
            ids={pageInfo.ids}
            device_id={pageInfo.deviceId}
            />
          :
          <CompareReport
          ids={pageInfo.ids}
          device_id={pageInfo.deviceId}
          />
        }
      </div>
    </div>
  )




}


const mapStateToProps = (state)=>({
  windowH: state.windowH.windowH,
})

export default connect(mapStateToProps,null)(withRouter(PageForCom))
