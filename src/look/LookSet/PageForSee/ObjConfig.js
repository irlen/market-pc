/** @jsx jsx */
import { jsx } from '@emotion/core'
import styled from '@emotion/styled'
import React, { useState, useEffect, useRef } from 'react'
import { connect } from 'react-redux'
import _ from 'lodash'
import { Scrollbars } from 'react-custom-scrollbars'
import { Tabs, Input, message, Divider, Tree, Row, Col, Button, Empty } from 'antd'
import { CaretRightOutlined } from '@ant-design/icons';

import { wyAxiosPost } from '../../../components/WyAxios'
import { curTheme } from '../../../styles/defineColor'
const { TabPane } = Tabs;
const { DirectoryTree } = Tree
function ObjConfig(props){
  const [ windowH,setWindowH ]  = useState(0);
  const [ curTab,setCurTab ]  = useState('network');
  const [ idInfo,setIdInfo ] = useState({device_id:"",reversion:"",is_fire:""})
  const [ objectData,setObjectData ] = useState({})
  const [ network,setNetwork ] = useState([])
  const [ service,setService ] = useState({})
  const [ time,setTime ] = useState([])
  const [ curService,setCurService ] = useState("tcp")
  //做初始化
  useEffect(()=>{
    setWindowH(props.windowH);
    const { device_id, reversion, is_fire } = idInfo
    if(device_id){
      getObjectData()
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
    const { device_id, reversion } = idInfo
    if(device_id){
      getObjectData()
    }
  },[idInfo])
  function tabChange(value){
    setCurTab(value)
  }
  function serviceChange(value){
    setCurService(value)
  }
  function transData(data){
    const list = []
    data.map(item=>{
      const  meta = {}
      if(item.children && item.children.length>0){
        meta.title = item.name
        meta.key = item.key
        meta.children = transData(item.children)
      }else{
        meta.title = "ip:"+item.ip+","+"掩码:"+item.mask
        meta.key = item.key
        meta.isLeaf = true
      }
      list.push(meta)
    })
    return list
  }
  function transService(data){
    const list = []
    data.map(item=>{
      const  meta = {}
      if(item.children && item.children.length>0){
        meta.title = item.name
        meta.key = item.key
        meta.children = transService(item.children)
      }else{
        meta.title = item.name+":"+item.value
        meta.key = item.key
        meta.isLeaf = true
      }
      list.push(meta)
    })
    return list
  }
  function getObjectData(){
    const { device_id, reversion,is_fire} = idInfo
    wyAxiosPost('config/object',{device_id, reversion,is_fire},(result)=>{
      if(result.status === 0){
        message.warning(result.msg)
        return
      }
      const newObjectData = _.cloneDeep(result.msg)
      const newNetwork = _.cloneDeep(newObjectData.network)
      const service = _.cloneDeep(newObjectData.service)
      const time = _.cloneDeep(newObjectData.time)
      const compiledNetwork = transData(newNetwork)
      const compiledServiceGroup = transService(service.group)
      service.group = compiledServiceGroup
      setNetwork(compiledNetwork)
      setService(service)
      setTime(time)
      setObjectData(newObjectData)
    })
  }
  function onSelect(){

  }
  function onExpand(){

  }
  return (
    <div>
      <Tabs activeKey={curTab} onChange={tabChange}>
        <TabPane tab="网络对象" key="network">
          <Scrollbars
            autoHide
            autoHideTimeout={100}
            autoHideDuration={200}
            universal={true}
            style={{height: windowH===0?0 : windowH-300+'px'}}
          >
            {
              network && network.length>0?
              <DirectoryTree
                multiple
                defaultExpandAll
                onSelect={onSelect}
                onExpand={onExpand}
                treeData={network}
              />
              :
              ''
            }
          </Scrollbars>
        </TabPane>
        <TabPane tab="服务对象" key="service">
          <Scrollbars
            autoHide
            autoHideTimeout={100}
            autoHideDuration={200}
            universal={true}
            style={{height: windowH===0?0 : windowH-300+'px'}}
          >
            <Row>
              <Col>
                <Button type={curService==="tcp"?"primary":""} onClick={()=>{serviceChange('tcp')}}>TCP</Button>
                <Button type={curService==="udp"?"primary":""} onClick={()=>{serviceChange('udp')}}>UDP</Button>
                <Button type={curService==="group"?"primary":""} onClick={()=>{serviceChange('group')}}>组</Button>
              </Col>
            </Row>
            <Row>
              <Col>
                {
                  curService && curService === 'tcp'?
                    <div>
                        <div style={{display:"flex",fontWeight:'bold',textAlign:"center",marginTop:"20px"}}>
                          <div style={{flex:"0 0 60px"}}>ID</div>
                          <div style={{flex:"0 0 200px"}}>端口名称</div>
                          <div style={{flex:"0 0 200px"}}>端口</div>
                        </div>
                        {
                          service.tcp && service.tcp.length>0?
                          service.tcp.map(item=>{
                            return <div key={item.id} style={{display:"flex",lineHeight:"30px",textAlign:"center",marginTop:"2px"}}>
                                    <div style={{flex:"0 0 60px",background:"rgba(204,204,204,0.5)"}}>{item.id}</div>
                                    <div style={{flex:"0 0 200px",background:"rgba(204,204,204,0.5)"}}>{item.port_name}</div>
                                    <div style={{flex:"0 0 200px",background:"rgba(204,204,204,0.5)"}}>{item.port}</div>
                                  </div>
                          })
                          :
                          <Empty />
                        }
                    </div>
                    :
                    ''
                }
                {
                  curService && curService === 'udp'?
                  <div>
                      <div style={{display:"flex",fontWeight:'bold',textAlign:"center",marginTop:"20px"}}>
                        <div style={{flex:"0 0 60px"}}>ID</div>
                        <div style={{flex:"0 0 200px"}}>端口名称</div>
                        <div style={{flex:"0 0 200px"}}>端口</div>
                      </div>
                      {
                        service.udp && service.udp.length>0?
                        service.udp.map(item=>{
                          return <div key={item.id} style={{display:"flex",lineHeight:"30px",textAlign:"center",marginTop:"2px"}}>
                                  <div style={{flex:"0 0 60px",background:"rgba(204,204,204,0.5)"}}>{item.id}</div>
                                  <div style={{flex:"0 0 200px",background:"rgba(204,204,204,0.5)"}}>{item.port_name}</div>
                                  <div style={{flex:"0 0 200px",background:"rgba(204,204,204,0.5)"}}>{item.port}</div>
                                </div>
                        })
                        :
                        <Empty />
                      }
                  </div>
                  :
                  ''
                }
                {
                  curService && curService === 'group'?
                  <div style={{marginTop:"20px"}}>
                    {
                      network && network.length>0?
                      <DirectoryTree
                        multiple
                        defaultExpandAll
                        onSelect={onSelect}
                        onExpand={onExpand}
                        treeData={service.group}
                      />
                      :
                      <Empty />
                    }
                  </div>
                  :
                  ''
                }
              </Col>
            </Row>
          </Scrollbars>
        </TabPane>
        <TabPane tab="时间对象" key="time">
          <div>
              <div style={{display:"flex",fontWeight:'bold',textAlign:"center",marginTop:"20px"}}>
                <div style={{flex:"0 0 60px"}}>ID</div>
                <div style={{flex:"0 0 200px"}}>时间名称</div>
                <div style={{flex:"0 0 auto"}}>时间</div>
              </div>
              {
                time && time.length>0?
                time.map(item=>{
                  return <div key={item.id} style={{display:"flex",lineHeight:"30px",textAlign:"center",marginTop:"2px"}}>
                          <div style={{flex:"0 0 60px",background:"rgba(204,204,204,0.5)"}}>{item.id}</div>
                          <div style={{flex:"0 0 200px",background:"rgba(204,204,204,0.5)"}}>{item.time_name}</div>
                          <div style={{
                            flex:"0 0 auto",background:"rgba(204,204,204,0.5)",
                            paddingRight:"20px",title:item.msg,
                            whiteSpace:"nowrap",
                            overflow:"hidden",
                            textOverflow:"ellipsis"
                          }}>{item.msg}</div>
                        </div>
                })
                :
                <Empty />
              }
          </div>
        </TabPane>
      </Tabs>
    </div>
  )

}
const mapStateToProps = (state)=>({
  windowH: state.windowH.windowH,
})
export default connect(mapStateToProps,null)(ObjConfig)
