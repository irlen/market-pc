/** @jsx jsx */
import { jsx } from '@emotion/core'
import styled from '@emotion/styled'
import React, { useState, useEffect, useRef } from 'react'
import { connect } from 'react-redux'
import _ from 'lodash'
import { Scrollbars } from 'react-custom-scrollbars'
import { Tabs, Tree, Input, message, Button, Empty, Modal } from 'antd'
import { FaNewspaper } from 'react-icons/fa'

import { base64Encode } from '../../components/Base64'
import { wyAxiosPost } from '../../components/WyAxios'
import { curTheme } from '../../styles/defineColor'
import { getCurDevice,setVersionId } from '../../redux/actions'
import DeviceTable from './DeviceTable'
import Compare from './Compare'
import CompareReport from './CompareReport'
const { Search } = Input
const { TabPane } = Tabs
const SpaceSpan = styled.span({
  display:"inline-block",
  margin:"0 5px 0 5px"
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
function LookSet(props){
  const [ windowH,setWindowH ]  = useState(0);
  const [ treeData,setTreeData ]  = useState([]);
  const [ deviceName,setDeviceName ]  = useState("");
  const [ treeParam,setTreeParam ] = useState({expandedKeys: [],searchValue: '',autoExpandParent: true})
  const [ ids,setIds] = useState([])
  const [ visible,setVisible] = useState(false)
  const [ modalType, setModalType ] = useState('')
  const [deviceId, setDeviceId] = useState("");

  //做初始化
  useEffect(()=>{
    setWindowH(props.windowH);
    getDeviceData();
  },[])
  //监控windowH
  useEffect(()=>{
    setWindowH(props.windowH);
  },[props.windowH])
  //监控deviceName
  useEffect(()=>{
    if(props.deviceName){
      setDeviceName(props.deviceName)
      setDeviceId(props.deviceId)
    }
  },[props.deviceName])
  useEffect(()=>{
    setIds(props.ids)
  },[props.ids])

  useEffect(()=>{
    if(modalType){
      showModal()
    }
  },[modalType])
  function getDeviceData(){
    wyAxiosPost('group/getinfo',{},(result)=>{
      if(result.status === 0){
        message.warning(result.msg)
        return
      }
      const data = _.cloneDeep(result.msg)
      setTreeData(data)
    })
  }
  function defineGet(key, tree){
    let parentKeys = []
    const haha = (key, tree)=>{
      for (let i = 0; i < tree.length; i++) {
        const node = tree[i];
        if (node.children && node.children.length>0) {
          if (node.children.some(item => item.key === key)) {
            parentKeys.push(node.key);
          }else{
            haha(key,node.children)
          }
        }
      }
    }
    haha(key,tree)
    return parentKeys
  }

  function searchChange(e){
    const { value } = e.target;
    let expandedKeys = []
    const panta = (data)=>{
      if(data && data.length>0){
        data.map(item => {
          if (item.title.indexOf(value) > -1) {
            const result =  defineGet(item.key, treeData);
            expandedKeys = expandedKeys.concat(result)
          }else{
            if(item.children && item.children.length>0){
              panta(item.children)
            }
          }
        })
      }
    }
    panta(treeData)
    expandedKeys = expandedKeys.filter((item, i, self) => item && self.indexOf(item) === i); //将后面重复的给过滤掉了
    const param = {expandedKeys,searchValue: value,autoExpandParent: true,}
    const curParam = _.cloneDeep(treeParam)
    const newParam = Object.assign({},curParam,param)
    setTreeParam(newParam)
  }

  function selectDevice (value,e){
    if(value && value.length>0 && e.node.type==='device'){
      const {is_fire,name} = e.node
      const key = value[0]
      props.getCurDevice({key,title: name,is_fire})
      props.setVersionId("")
    }
    // if(value && value.length>0){
    //   const str = value[0]
    //   const arr = str.split("_");
    //   if(arr[0] === "device"){
    //     const deviceName = e.node.title.props.children[2];
    //     const is_fire = e.node.is_fire
    //     props.getCurDevice({key:arr[2],title: deviceName,is_fire})
    //     props.setVersionId("")
    //   }
    // }
  }
  const onExpand = expandedKeys => {
    const param = {expandedKeys,autoExpandParent: false}
    const curParam = _.cloneDeep(treeParam)
    const newParam = Object.assign({},curParam,param)
    setTreeParam(newParam)
  }
  const loop =data =>data.map((item,order) => {
        const index = item.title.indexOf(treeParam.searchValue);
        const beforeStr = item.title.substr(0, index);
        const afterStr = item.title.substr(index + treeParam.searchValue.length);
        const title =
          index > -1 ? (
            <span>
              {beforeStr}
              <span style={{color: curTheme.focusColor}}>{treeParam.searchValue}</span>
              {afterStr}
            </span>
          ) : (
            <span>{item.title}</span>
          );

        if (item.children && item.children.length>0) {
          return { title,
            //key: `${item.type}_${order}_${item.key}`,
            key: item.key,
            children: loop(item.children) };
        }
        return {
          title,
          //key: `${item.type}_${order}_${item.key}`,
          key: item.key,
          is_fire: item.is_fire,
          type: item.type,
          name: item.title
        };
      });
  function doCompare(value){
    if(ids && ids.length !== 2 || ids.length === 0){
      message.warning('请选择两条信息做对比')
      return
    }
    setModalType(value)
  }
  function showModal(){
    setVisible(true)
  }
  function handleCancel(){
    setVisible(false)
    setModalType("")
  }
  function handleOk(){
    handleCancel();
  }
  function toPageCompare(){

    const param = { deviceId,deviceName,ids, modalType }
    window.open("/#/pageforcom/"+base64Encode(JSON.stringify(param)))
  }
  return (
    <div>
      <div style={{display:"flex",alignContent:"space-between"}}>
        <div style={{flex:"0 0 200px",background:curTheme.moduleBg,padding:"20px",boxShadow:curTheme.boxShadow}}>
          <Scrollbars
            autoHide
            autoHideTimeout={100}
            autoHideDuration={200}
            universal={true}
            style={{height: windowH===0?0 : windowH-142+'px'}}
          >
            <Search style={{ marginBottom: 8 }} placeholder="search" onChange={searchChange} />
            <Tree
              onExpand={onExpand}
              expandedKeys={treeParam.expandedKeys}
              autoExpandParent={treeParam.autoExpandParent}
              treeData={loop(treeData)}
              onSelect={selectDevice}
            />
          </Scrollbars>
        </div>
        <div style={{flex:"1 1 auto",paddingLeft:"10px",}}>
            <Scrollbars
              autoHide
              autoHideTimeout={100}
              autoHideDuration={200}
              universal={true}
              style={{height: windowH===0?0 : windowH-100+'px'}}
            >
              <div style={{minHeight:windowH===0?0 : windowH-100+'px',height:"auto",background:curTheme.moduleBg,padding:"20px",boxShadow:curTheme.boxShadow}}>
            {
              deviceName?
              <div>
                <div style={{marginBottom:"10px",display:"flex"}}>
                  <div style={{flex:"0 0 100px",paddingLeft:"10px"}}>
                    <h3>{ deviceName }</h3>
                  </div>
                  <div style={{flex:"1 1 auto",textAlign:"right"}}>
                    <SpaceSpan><Button type="primary" size={"small"} onClick={()=>{doCompare('compare')}}>对比</Button></SpaceSpan>
                    <SpaceSpan><Button type="primary" size={"small"} onClick={()=>{doCompare('report')}}>对比报告</Button></SpaceSpan>
                  </div>
                </div>
                <div>
                  <DeviceTable />
                </div>
              </div>
              :
              <Empty />

            }
            </div>
            </Scrollbars>
        </div>
      </div>
      <Modal
        title={`${deviceName}版本对比`}
        title={
          <div style={{display:"flex"}}>
            <div style={{flex:"1 1 auto"}}>{`${deviceName}版本对比`}</div>
            <div style={{flex:"0 0 80px"}}> <SpanNew title="新窗口中查看" onClick={toPageCompare}><FaNewspaper /></SpanNew>  </div>
          </div>
        }
        visible={visible}
        onOk={handleOk}
        onCancel={handleCancel}
        footer={null}
        width={"96%"}
        destroyOnClose={true}
      >
        <div>
          {
            modalType === 'compare'?
            <Compare />
            :
            <CompareReport />
          }
        </div>
      </Modal>
    </div>
  )
}
const mapStateToProps = (state)=>({
  windowH: state.windowH.windowH,
  deviceName: state.lookset.deviceName,
  ids: state.lookset.ids,
  deviceId: state.lookset.deviceId
})
const mapDispatchToProps = (dispatch)=>({
  getCurDevice: (value)=>{dispatch(getCurDevice(value))},
  setVersionId: (value)=>{dispatch(setVersionId(value))}
})
export default connect(mapStateToProps,mapDispatchToProps)(LookSet)

// Persistence.createENtityManagerFactory
// createEntiryManager
