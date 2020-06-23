/** @jsx jsx */
import { jsx } from '@emotion/core'
import styled from '@emotion/styled'
import React, { useState, useEffect, useRef } from 'react'
import { connect } from 'react-redux'
import _ from 'lodash'
import { message, Table, Empty } from 'antd'
import { FaRegEye } from 'react-icons/fa'
import { IoMdDownload } from 'react-icons/io'

import ConfigMeta from './ConfigMeta'
import { wyAxiosPost } from '../../components/WyAxios'
import { curTheme } from '../../styles/defineColor'

function RouteInfo(props){
  const [ windowH,setWindowH ]  = useState(0);
  const [idInfo,setIdInfo] = useState({device_id:"",reversion:"",is_fire:""})
  const [routeData,setRouteData] = useState("")

  //做初始化
  useEffect(()=>{
    setWindowH(props.windowH);
    const {deviceId,versionId, is_fire} = props
    const idInfo = {device_id:deviceId,reversion:versionId,is_fire: is_fire}
    setIdInfo(idInfo)
    if(deviceId){
      getRouteData()
    }
  },[])
  //监控windowH
  useEffect(()=>{
    setWindowH(props.windowH);
  },[props.windowH])

  useEffect(()=>{
    if(props.deviceId){
      setIdInfo({device_id:props.deviceId,reversion:props.versionId,is_fire: props.is_fire})
    }
  },[props.deviceId,props.versionId])

  useEffect(()=>{
    if(idInfo.device_id){
      getRouteData();
    }
  },[idInfo])

  function getRouteData(){
    const { device_id, reversion,is_fire} = idInfo
    if(device_id){
      wyAxiosPost('config/route',{device_id,reversion,is_fire},(result)=>{
        if(result.status === 0){
          message.warning(result.msg)
          return
        }
        const newRouteData = _.cloneDeep(result.msg)
        setRouteData(newRouteData)
      })
    }
  }
  return (
    <div>
      <Table
        columns={routeData.xxx || []}
        dataSource={routeData.yyy || []}
        pagination={false}
        bordered
        size={"small"}
      />
    </div>
  )

}
const mapStateToProps = (state)=>({
  windowH: state.windowH.windowH,
  deviceId: state.lookset.deviceId,
  versionId: state.lookset.versionId,
  is_fire: state.lookset.is_fire
})
export default connect(mapStateToProps,null)(RouteInfo)
