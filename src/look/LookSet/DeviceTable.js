/** @jsx jsx */
import { jsx } from '@emotion/core'
import styled from '@emotion/styled'
import React, { useState, useEffect, useRef } from 'react'
import { connect } from 'react-redux'
import _ from 'lodash'
import { Scrollbars } from 'react-custom-scrollbars'
import { Tabs, Tree, Input, message, Table, Modal, Button } from 'antd'
import { FaRegEye, FaNewspaper } from 'react-icons/fa'
import { IoMdDownload } from 'react-icons/io'

import { setVersionId, setIds } from '../../redux/actions'
import { wyAxiosPost } from '../../components/WyAxios'
import { curTheme } from '../../styles/defineColor'
import VisitControl from './VisitControl'
import RouteInfo from './RouteInfo'
import InterfaceInfo from './InterfaceInfo'
import ObjConfig from './ObjConfig'
import { base64Encode } from '../../components/Base64'
const { TabPane } = Tabs
const Spandel = styled.div({
  textAlign:"center",
  display:"inline-block",
  width:"30px",
  cursor:"pointer",
  "&:hover":{
    fontWeight:"bold",
    color:"#00CC66",
    fontSize:"16px"
  },
  "&:active":{
    opacity:0.8
  }
})
const SpanNew = styled.span({
  fontWeight:"normal",
  verticalAlign: "middle",
  cursor:"pointer",
  "&:hover":{
    fontWeight:"bold",
    color:"#00CC66",
    fontSize:"16px"
  },
  "&:active":{
    opacity:0.8
  }
})

function DeviceTable(props){
  const [ windowH,setWindowH ]  = useState(0);
  const [deviceId, setDeviceId] = useState("");
  const [is_fire, setIsFire] = useState("");
  const [deviceName, setDeviceName] = useState("");
  const [ visionList, setVisionList ] = useState([])
  const [ visible, setVisible ] = useState(false)
  const [ curTab, setCurTab ] = useState(props.is_fire=== 1?"stragedy":"visitControl")
  const [ curVersionId, setCurVersionId ] = useState("")
  //选中条数
  const [ selectedRowKeys,setSelectedRowKeys ] = useState([])
  //分页信息
  const [pageInfo,setPageInfo] = useState({pageSize:10,current:1, search:""})
  //做初始化
  useEffect(()=>{
    setWindowH(props.windowH);
  },[])
  //监控windowH
  useEffect(()=>{
    setWindowH(props.windowH);
  },[props.windowH])
  //当前设备监控
  useEffect(()=>{
    if(props.deviceId){
      setDeviceId(props.deviceId)
      setIsFire(props.is_fire)
      setDeviceName(props.deviceName)
    }
  },[props.deviceId,props.deviceName])
  useEffect(()=>{
    if(deviceId){
      getVisionList(deviceId,is_fire)
    }
  },[deviceId])
  //监控页面信息，然后回调getDevice
  useEffect(()=>{
    if(pageInfo && deviceId){
      getVisionList(deviceId,is_fire)
    }
  },[pageInfo])
  function getVisionList(deviceId,is_fire){
    wyAxiosPost('config/see',{id: deviceId,is_fire,...pageInfo},(result)=>{
      if(result.status === 0){
        message.warning(result.msg)
        return
      }
      const newVisionList = _.cloneDeep(result.msg)
      const editColumn = {
        title:"操作",
        key:"action",
        render:(text, record) => (
          <span>
            <Spandel title="查看" onClick={()=>{doCheck(record.key)}}>
              <FaRegEye />
            </Spandel>
            <Spandel title="下载" onClick={
              ()=>{
                doDownLoad({device_id:deviceId,reversion:record.key})
              }
            }>
              <IoMdDownload />
            </Spandel>
          </span>
        )
      }
      newVisionList.xxx.push(editColumn)
      setVisionList(newVisionList)
    })
  }
  function pageSizeChange(current, size){
    const curPageInfo = _.cloneDeep(pageInfo)
    const newPageInfo = Object.assign({},curPageInfo,{pageSize: size,current: 1})
    setPageInfo(newPageInfo)
  }
  function searchChange(value){
    const curPageInfo = _.cloneDeep(pageInfo)
    const newPageInfo = Object.assign({},curPageInfo,{search: value,current:1})
    setPageInfo(newPageInfo)
  }
  function pageChange(value){
    const curPageInfo = _.cloneDeep(pageInfo)
    const newPageInfo = Object.assign({},curPageInfo,{current: value})
    setPageInfo(newPageInfo)
  }
  function doCheck(value){
    setCurVersionId(value)
    props.setVersionId(value)
    showModal()
  }
  function handleOk(){
    handleCancel()
  }
  function showModal(){
    setVisible(true)
  }
  function handleCancel(){
    setVisible(false)
  }
  function tabChange(value){
    setCurTab(value)
  }
  const onSelectChange = selectedRowKeys => {
    props.setIds(selectedRowKeys)
    setSelectedRowKeys(selectedRowKeys)
  }
  function doDownLoad(value){
    wyAxiosPost('config/download',{...value},(result)=>{
      if(result.status === 0){
        message.warning(result.msg)
        return
      }
      function download(content, filename) {
        const eleLink = document.createElement('a');
        eleLink.download = filename;
        eleLink.style.display = 'none';
        const blob = new Blob([content]);
        eleLink.href = URL.createObjectURL(blob);
        document.body.appendChild(eleLink);
        eleLink.click();
        document.body.removeChild(eleLink);
      }
      download(result.msg.config,result.msg.fileName)
    })
  }
  function toPageForSee(){
    const param = { deviceId,is_fire,deviceName,curVersionId,curTab }
    window.open("/#/pageforsee/"+base64Encode(JSON.stringify(param)))
  }
  return(
      <div>
        <Table
          columns={visionList.xxx}
          dataSource={visionList.yyy}
          bordered
          size={"small"}
          rowSelection={{selectedRowKeys,onChange:onSelectChange}}
          pagination={{
            pageSize: pageInfo.pageSize,
            pageSizeOptions: ["5","10","20","30","40"],
            showSizeChanger: true,
            showQuickJumper: true,
            current: pageInfo.current,
            total: visionList.total,
            onShowSizeChange: pageSizeChange,
            onChange: pageChange
          }}
        />
        <Modal
          title={
            <div style={{display:"flex"}}>
              <div style={{flex:"1 1 auto"}}>{deviceName}</div>
              <div style={{flex:"0 0 80px"}}> <SpanNew title="新窗口中查看" onClick={toPageForSee}><FaNewspaper /></SpanNew>  </div>
            </div>
          }
          visible={visible}
          onOk={handleOk}
          onCancel={handleCancel}
          footer={null}
          width={"90%"}
          destroyOnClose={true}
        >
          <Tabs
            activeKey={curTab}
            onChange={tabChange}
            tabPosition={"left"}
          >
          {
            is_fire === 1?
            <TabPane tab="策略" key="stragedy">
              <Scrollbars
                autoHide
                autoHideTimeout={100}
                autoHideDuration={200}
                universal={true}
                style={{height: windowH===0?0 : windowH-240+'px'}}
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
                style={{height: windowH===0?0 : windowH-240+'px'}}
              >
                <VisitControl />
              </Scrollbars>
            </TabPane>
          }

            <TabPane tab="对象" key="obj">
              <Scrollbars
                autoHide
                autoHideTimeout={100}
                autoHideDuration={200}
                universal={true}
                style={{height: windowH===0?0 : windowH-240+'px'}}
              >
                <ObjConfig />
              </Scrollbars>
            </TabPane>
            <TabPane tab="路由表" key="routeList">
              <Scrollbars
                autoHide
                autoHideTimeout={100}
                autoHideDuration={200}
                universal={true}
                style={{height: windowH===0?0 : windowH-240+'px'}}
              >
                <RouteInfo />
              </Scrollbars>
            </TabPane>
            <TabPane tab="接口信息" key="interfaceInfo">
              <Scrollbars
                autoHide
                autoHideTimeout={100}
                autoHideDuration={200}
                universal={true}
                style={{height: windowH===0?0 : windowH-240+'px'}}
              >
                <InterfaceInfo />
              </Scrollbars>
            </TabPane>

          </Tabs>
        </Modal>
      </div>
  )
}

const mapStateToProps = (state)=>({
  windowH: state.windowH.windowH,
  deviceId: state.lookset.deviceId,
  is_fire: state.lookset.is_fire,
  deviceName: state.lookset.deviceName
})
const mapDispatchToProps = (dispatch)=>({
  setVersionId: (value)=>{dispatch(setVersionId(value))},
  setIds: (value)=>{dispatch(setIds(value))},
})
export default connect(mapStateToProps,mapDispatchToProps)(DeviceTable)
