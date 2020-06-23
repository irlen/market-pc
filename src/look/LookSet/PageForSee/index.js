/** @jsx jsx */
import { jsx } from '@emotion/core'
import styled from '@emotion/styled'
import React, { useState, useEffect, useRef } from 'react'
import { connect } from 'react-redux'
import _ from 'lodash'
import { Scrollbars } from 'react-custom-scrollbars'
import { withRouter } from 'react-router-dom'
import { Tabs, message, Empty } from 'antd'

import { base64Decode } from '../../../components/Base64'
import { wyAxiosPost } from '../../../components/WyAxios'
import VisitControl from './VisitControl'
import RouteInfo from './RouteInfo'
import InterfaceInfo from './InterfaceInfo'
import ObjConfig from './ObjConfig'
import { curTheme } from '../../../styles/defineColor'
const { TabPane } = Tabs

function PageForSee(props){
  const [ windowH,setWindowH ]  = useState(0);
  const [ pageInfo,setPageInfo ] = useState({})
  //做初始化
  useEffect(()=>{
    setWindowH(props.windowH);
    const param = JSON.parse(base64Decode(props.match.params.id))
    const device_id = param.deviceId
    const is_fire = param.is_fire
    const deviceName = param.deviceName
    const reversion = param.curVersionId
    const curTab = param.curTab
    setPageInfo({device_id,is_fire,deviceName,reversion,curTab})
  },[])
  //监控windowH
  useEffect(()=>{
    setWindowH(props.windowH);
  },[props.windowH])

  function tabChange(value){
    const curPageInfo = _.cloneDeep(pageInfo)
    const newPageInfo = Object.assign({},curPageInfo,{curTab: value})
    setPageInfo(newPageInfo)
  }

  return(
    <div>
      <div style={{fontWeight:"bold",lineHeight:"40px",paddingLeft:"20px", borderBottom: curTheme.border}}>
        {pageInfo.deviceName}
      </div>
      <div style={{padding:"20px"}}>
        <Tabs
          activeKey={pageInfo.curTab}
          onChange={tabChange}
          tabPosition={"left"}
        >
        {
          pageInfo.is_fire === 1?
          <TabPane tab="策略" key="stragedy">
            <Scrollbars
              autoHide
              autoHideTimeout={100}
              autoHideDuration={200}
              universal={true}
              style={{height: windowH===0?0 : windowH-80+'px'}}
            >
              策略
            </Scrollbars>
          </TabPane>
          :
          <TabPane tab="访问控制" key="visitControl">
            <Scrollbars
              autoHide
              autoHideTimeout={100}
              autoHideDuration={200}
              universal={true}
              style={{height: windowH===0?0 : windowH-80+'px'}}
            >
              <VisitControl deviceId={pageInfo.device_id}  versionId={pageInfo.reversion}  is_fire={pageInfo.is_fire} />
            </Scrollbars>
          </TabPane>
        }

          <TabPane tab="对象" key="obj">
            <Scrollbars
              autoHide
              autoHideTimeout={100}
              autoHideDuration={200}
              universal={true}
              style={{height: windowH===0?0 : windowH-80+'px'}}
            >
              <ObjConfig deviceId={pageInfo.device_id}  versionId={pageInfo.reversion}  is_fire={pageInfo.is_fire} />
            </Scrollbars>
          </TabPane>
          <TabPane tab="路由表" key="routeList">
            <Scrollbars
              autoHide
              autoHideTimeout={100}
              autoHideDuration={200}
              universal={true}
              style={{height: windowH===0?0 : windowH-80+'px'}}
            >
              <RouteInfo deviceId={pageInfo.device_id}  versionId={pageInfo.reversion}  is_fire={pageInfo.is_fire} />
            </Scrollbars>
          </TabPane>
          <TabPane tab="接口信息" key="interfaceInfo">
            <Scrollbars
              autoHide
              autoHideTimeout={100}
              autoHideDuration={200}
              universal={true}
              style={{height: windowH===0?0 : windowH-80+'px'}}
            >
              <InterfaceInfo deviceId={pageInfo.device_id}  versionId={pageInfo.reversion}  is_fire={pageInfo.is_fire} />
            </Scrollbars>
          </TabPane>

        </Tabs>
      </div>
    </div>
  )
}


const mapStateToProps = (state)=>({
  windowH: state.windowH.windowH,
})

export default connect(mapStateToProps,null)(withRouter(PageForSee))
