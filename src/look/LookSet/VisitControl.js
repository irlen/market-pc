/** @jsx jsx */
import { jsx } from '@emotion/core'
import styled from '@emotion/styled'
import React, { useState, useEffect, useRef } from 'react'
import { connect } from 'react-redux'
import _ from 'lodash'
import { Tabs, Tree, Input, message, Table, Modal, Button, Select, Empty } from 'antd'
import { FaRegEye } from 'react-icons/fa'
import { IoMdDownload } from 'react-icons/io'

import ConfigMeta from './ConfigMeta'
import { wyAxiosPost } from '../../components/WyAxios'
import { curTheme } from '../../styles/defineColor'
const { Option } = Select
function VisitControl(props){
  const [ windowH,setWindowH ]  = useState(0);
  const [idInfo,setIdInfo] = useState({device_id:"",reversion:"",is_fire:""})
  const [configData,setConfigData] = useState({})
  const [curInterface,setCurInterface] = useState("all")
  const [configList,setConfigList] = useState([])
  //做初始化
  useEffect(()=>{
    setWindowH(props.windowH);
    const {deviceId,versionId,is_fire} = props
    const idInfo = {device_id:deviceId,reversion:versionId,is_fire}
    setIdInfo(idInfo)
    const value = {device_id:deviceId,reversion:versionId,interface:curInterface,is_fire}
    getConfigList(value)

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
    if(idInfo.device_id,idInfo.reversion){
      getConfigInfo()
    }
  },[idInfo])

  //接口变化回调
  useEffect(()=>{
    const value = {interface:curInterface,...idInfo}
    getConfigList(value)
  },[curInterface])
  function interfaceChange(value){
    setCurInterface(value)
  }
  function getConfigInfo(){
    wyAxiosPost('config/acscontrol',{...idInfo},(result)=>{
      if(result.status === 0){
        message.warning(result.msg)
        return
      }
      const newConfigData = _.cloneDeep(result.msg)
      setConfigData(newConfigData)
    })
  }
  function getConfigList(value){
    const { device_id, reversion } = value
    if(device_id && value.interface){
      wyAxiosPost('config/interface',{...value},(result)=>{
        if(result.status === 0){
          message.warning(result.msg)
          return
        }
        const newConfigList = _.cloneDeep(result.msg)
        setConfigList(newConfigList)
      })
    }
  }
  return (
    <div>
      <div style={{display:"flex",lineHeight:"30px",marginBottom:"20px"}}>
        <div style={{flex:"0 0 60px",textAlign:"right"}}>接口：</div>
        <div style={{flex:"1 1 auto"}}>
          <Select style={{width:"200px"}} value={curInterface} onChange={interfaceChange}>
            <Option value="all" key="all">所有接口</Option>
            {
              configData && configData.length>0?
              configData.map(item=>{
                return <Option value={item.id} key={item.id}>{item.interface_name}</Option>
              })
              :
              ''
            }
          </Select>
        </div>
      </div>
      <div>
        {
          configList && configList.length>0?
          configList.map((item,index)=>{
            return <ConfigMeta key={index} data={item} />
          })
          :
          <Empty />
        }
      </div>
    </div>
  )

}
const mapStateToProps = (state)=>({
  windowH: state.windowH.windowH,
  deviceId: state.lookset.deviceId,
  versionId: state.lookset.versionId,
  is_fire: state.lookset.is_fire
})
export default connect(mapStateToProps,null)(VisitControl)
