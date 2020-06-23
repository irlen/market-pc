/** @jsx jsx */
import { jsx } from '@emotion/core'
import styled from '@emotion/styled'
import React, { useState, useEffect, useRef } from 'react'
import { connect } from 'react-redux'
import _ from 'lodash'
import { message, Table, Empty } from 'antd'
import { FaRegEye } from 'react-icons/fa'
import { IoMdDownload } from 'react-icons/io'

import { wyAxiosPost } from '../../components/WyAxios'
import { curTheme } from '../../styles/defineColor'

function InterfaceInfo(props){
  const [ windowH,setWindowH ]  = useState(0);
  const [idInfo,setIdInfo] = useState({device_id:"",reversion:"",is_fire:""})
  const [interfaceData,setInterfaceData] = useState({xxx:[],yyy:[]})

  //做初始化
  useEffect(()=>{
    setWindowH(props.windowH);
    const {deviceId,versionId,is_fire} = props
    const idInfo = {device_id:deviceId,reversion:versionId,is_fire}
    setIdInfo(idInfo)
    if(deviceId){
      getinterfaceData()
    }
  },[])
  //监控windowH
  useEffect(()=>{
    setWindowH(props.windowH);
  },[props.windowH])

  useEffect(()=>{
    if(props.deviceId){
      setIdInfo({device_id:props.deviceId,reversion:props.versionId,is_fire:props.is_fire})
    }
  },[props.deviceId,props.versionId])

  useEffect(()=>{
    if(idInfo.device_id){
      getinterfaceData();
    }
  },[idInfo])

  function getinterfaceData(){
    const { device_id, reversion, is_fire } = idInfo
    if(device_id){
      wyAxiosPost('config/interfaceinfo',{device_id,reversion,is_fire},(result)=>{
        if(result.status === 0){
          message.warning(result.msg)
          return
        }
        const newInterfaceData = _.cloneDeep(result.msg)
         newInterfaceData.xxx.forEach(item=>{
           if(item.dataIndex === "acl_name"){
            item.render = (text, record, index)=>{
              if(text && text.indexOf("/") > -1){
                const arr = text.split("/")
                return <div>
                  <div>{arr[0]?arr[0]:""}</div>
                  <div>{arr[1]?arr[1]:""}</div>
                </div>
              }else{
                return text
              }
            }
          }
         })
        setInterfaceData(newInterfaceData)
      })
    }
  }
  return (
    <div>
      <Table
        columns={interfaceData.xxx || []}
        dataSource={interfaceData.yyy || []}
        pagination={false}
        bordered
        size={'small'}
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
export default connect(mapStateToProps,null)(InterfaceInfo)
