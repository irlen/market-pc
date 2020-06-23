/** @jsx jsx */
import { jsx } from '@emotion/core'
import styled from '@emotion/styled'
import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'
import _ from 'lodash'
import { Scrollbars } from 'react-custom-scrollbars'
import { Menu, message, Dropdown, Button, Empty, List, Modal, Input, Popconfirm } from 'antd'
import { GoChevronRight } from "react-icons/go"
import { MdAdd,MdRemove } from "react-icons/md"
import { AiOutlineEdit } from "react-icons/ai"
import { FiSettings } from "react-icons/fi"
import { DownOutlined } from '@ant-design/icons';

import { curTheme } from '../../styles/defineColor'
import { wyAxiosPost } from '../../components/WyAxios'
const { SubMenu } = Menu;
const DivCont = styled.div({
  margin:"5px auto",
  display: "flex",
  lineHeight:"30px"
})
const DivLeft = styled.div({
  flex:"0 0 100px"
})
const DivRight = styled.div({
  flex:"1 1 auto"
})
const GroupDiv = styled.div({
  lineHeight:"40px",
  padding:"0 10px 0 20px",
  background:"#f9f9f9",
  margin:"5px 0 5px 0",
  cursor:"pointer",
  display:"flex",
  "&:hover":{
    background: curTheme.alphColor
  }
})
function SetGroup(props){
  //页面高度
  const [ windowH,setWindowH ]  = useState(0);
  const [ groupList,setGroupList ] = useState([]);
  const [ curGroup,setCurGroup ] = useState("");
  const [ deviceList,setDeviceList ] = useState([]);
  //控制modal状态
  const [ visible,setVisible ] = useState(false);
  const [ isAdd, setIsAdd ] = useState(false);
  const [ name,setName ] = useState("");
  const [ deVisible,setDeVisible ] = useState(false)

  //做初始化
  useEffect(()=>{
    setWindowH(props.windowH);
    getGroup();
  },[])

  //监控windowH
  useEffect(()=>{
    setWindowH(props.windowH);
  },[props.windowH])
  useEffect(()=>{
    getDevice();
  },[curGroup])
  function curGroupChange(id){
    setCurGroup(id);
  }
  function getGroup(){
    wyAxiosPost('group/get',{},(result)=>{
        if(result.status === 0){
          message.warning(result.msg)
          return
        }
        const groupList = _.cloneDeep(result.msg);
        setGroupList(groupList);
        if(groupList && groupList.length>0){
          setCurGroup(groupList[0]["id"])
        }
    })
  }
  function getDevice(){
    wyAxiosPost('group/device',{id: curGroup},(result)=>{
      if(result.status === 0){
        message.warning(result.msg);
        return
      }
      const deviceList = _.cloneDeep(result.msg);
      setDeviceList(deviceList);
    })
  }
  function showModal(){
    setVisible(true);
  }
  function clickAdd(){
    setIsAdd(true);
    showModal();
  }
  function clickEdit(){
    setIsAdd(false);
    wyAxiosPost('group/edit',{id:curGroup},result=>{
      if(result.status === 0){
        message.warning(result.msg)
        return
      }
      setName(result.msg.name);
    })
    showModal();
  }
  function handleCancel(){
    setVisible(false);
  }
  function handleOk(){
    if(!name){
      message.warning("请输入组名");
      return
    }
    let data = {name}
    if(!isAdd){
      data.id = curGroup
    }
    wyAxiosPost('group/add',{...data},result=>{
      if(result.status === 0){
        message.warning(result.msg)
        return
      }
      message.success(result.msg);
      getGroup();
      setName("");
    })
    handleCancel();
  }
  function nameChange(e){
    const value = e.target.value
    setName(value);
  }
  function showDeModal(){
    setDeVisible(true)
  }
  function cancelDeModal(){
    setDeVisible(false)
  }
  function okDeModal(){
    wyAxiosPost('group/delete',{id:curGroup},(result)=>{
      if(result.status === 0){
        message.warning(result.msg);
        return
      }
      message.success(result.msg);
      getGroup();
      cancelDeModal();
    })
  }
  function digui(arr){
    return arr.map((item)=>{
      if(item.children && item.children.length>0){
        return <SubMenu
          key={item.id}
          title={item.name}
        >
          { digui(item.children) }
        </SubMenu>
      }else{
        return <Menu.Item key={item.id} >
          {item.name}
        </Menu.Item>
      }
    })
  }
  return(
    <div>
      <div></div>
      <div style={{display:"flex",alignContent:"space-between"}}>
        <div style={{flex:"0 0 200px",background:curTheme.moduleBg}}>
          <div style={{padding:"20px 0 0 20px",display:"flex"}}>
            <div style={{flex:"0 0 74px",fontWeight:"bold"}}>组</div>
            <div style={{flex:"1 1 auto"}}>
              <Dropdown overlay={
                <Menu>
                  <Menu.Item key="1" onClick={clickAdd}>
                    <MdAdd /> 增加组
                  </Menu.Item>
                  <Menu.Item key="2" onClick={clickEdit}>
                    <AiOutlineEdit /> 编辑组
                  </Menu.Item>
                  {
                    curGroup && curGroup === "1"?
                    ""
                    :
                    <Menu.Item key="3" onClick={showDeModal}>
                      <MdRemove /> 删除组
                    </Menu.Item>
                  }
                </Menu>
              }>
                <Button size={"small"}>
                  <span style={{verticalAlign:"middle",marginRight:"10px"}}><FiSettings /> </span> 操作 <DownOutlined />
                </Button>
              </Dropdown>
            </div>
          </div>
          <Scrollbars
            autoHide
            autoHideTimeout={100}
            autoHideDuration={200}
            universal={true}
            style={{height: windowH===0?0 : windowH-142+'px'}}
          >
            {
              groupList && groupList.length>0?
              <div style={{padding:"20px"}}>
                {
                  groupList && groupList.length>0?
                  groupList.map(item=>{
                    return <GroupDiv
                      style={{color: item.id === curGroup?curTheme.focusColor:"#333333"}}
                      onClick={()=>{curGroupChange(item.id)}}
                      key={item.id}
                    >
                      <div style={{flex:"1 1 auto"}}>{item.name}</div>
                      <div style={{flex:"0 0 20px"}}>
                      {
                        item.id === curGroup?
                        <GoChevronRight />
                        :
                        ''
                      }
                      </div>
                    </GroupDiv>
                  })
                  :
                  ""
                }
              </div>
              :
              <Empty />
            }
          </Scrollbars>
        </div>
        <div style={{flex:"1 1 auto",paddingLeft:"10px"}}>
          <div style={{background:"#ffffff"}}>
          <div style={{padding:"20px 0 0 20px",display:"flex"}}>
            <div style={{flex:"0 0 74px",fontWeight:"bold"}}>组内设备</div>
            <div style={{flex:"1 1 auto"}}>

            </div>
          </div>
            <Scrollbars
              autoHide
              autoHideTimeout={100}
              autoHideDuration={200}
              universal={true}
              style={{height: windowH===0?0 : windowH-140+'px'}}
            >
            <div style={{padding:"20px"}}>
              {
                deviceList && deviceList.length>0?
                <List
                  itemLayout="horizontal"
                  dataSource={deviceList}
                  renderItem={item => (
                    <List.Item>
                      <List.Item.Meta

                        title={item.name}
                        description=""
                      />
                    </List.Item>
                  )}
                />
                :
                <Empty />
              }
              </div>
            </Scrollbars>
          </div>
        </div>
      </div>
      <Modal
        title="组属性"
        visible={visible}
        onOk={handleOk}
        onCancel={handleCancel}
        okText={"确定"}
        cancelText={"取消"}
      >
        <DivCont>
          <DivLeft><span style={{color:"#FF6600"}}>* </span> 组名称</DivLeft>
          <DivRight><Input
            value={name}
            onChange={nameChange}
          /></DivRight>
        </DivCont>
      </Modal>
      <Modal
        title="提示"
        visible={deVisible}
        onOk={okDeModal}
        onCancel={cancelDeModal}
        okText={"确定"}
        cancelText={"取消"}
      >
        <div style={{textAlign:"center"}}>
          若删除该组，则该组内设备将移入默认组，确定要删除吗？
        </div>
      </Modal>
    </div>
  )
}

const mapStateToProps = (state)=>({
  windowH: state.windowH.windowH
})
export default connect(mapStateToProps,null)(SetGroup)
