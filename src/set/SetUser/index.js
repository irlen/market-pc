/** @jsx jsx */
import { jsx } from '@emotion/core'
import styled from '@emotion/styled'
import React, { useState, useEffect, useRef } from 'react'
import { connect } from 'react-redux'
import _ from 'lodash'
import { Scrollbars } from 'react-custom-scrollbars'
import { message, Dropdown, Button, Empty, List, Modal, Input, Tabs, Select, Popconfirm } from 'antd'
import { MdAdd, MdRemove, MdDelete } from "react-icons/md";
import { AiTwotoneEdit } from "react-icons/ai";

import { wyAxiosPost } from '../../components/WyAxios'
import Super from './Super'
import Domain from './Domain'
import { curTheme } from '../../styles/defineColor'
const { TabPane } = Tabs
const { Option } = Select
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
function SetUser(props){
  const superRef = useRef(null);
  const domainRef = useRef(null);
  //页面高度
  const [ windowH,setWindowH ]  = useState(0);
  //控制modal状态
  const [visible,setVisible] = useState(false);
  //分组列表
  const [ groupList, setGroupList ] = useState([]);
  //表单数据
  const [formData,setFormData] = useState({
    username:"",password:"",repeatpassword:"",role:"",group_id:[],auth:"",usernote:""
  });
  const [ curTab,setCurTab ] =  useState("super")
  //当前正在编辑的id
  const [ editId,setEditId ] = useState("")


  //做初始化
  useEffect(()=>{
    setWindowH(props.windowH);
    getGroupList();
  },[])

  //监控windowH
  useEffect(()=>{
    setWindowH(props.windowH);
  },[props.windowH])

  function tabChange(value){
    setCurTab(value)
  }
  //设置表单数据
  function formChange(param){
    const curFormData = _.cloneDeep(formData)
    let newFormData = Object.assign({},curFormData,{[param.field]:param.value})
    if(param.field === 'group_id' && param.value.length>0){
      if(param.value.indexOf("1")>-1){
        const allValue = _.cloneDeep(param.value)
        const value = _.cloneDeep(param.value)
        const lastOne = value.pop();
        let newGroup_id = {}
        if(lastOne === "1"){
          newGroup_id = {group_id:["1"]}
        }else{
          const groupIdArr = allValue.filter(o=>{
            return o !== "1"
          })
          newGroup_id = {group_id:groupIdArr}
        }
        newFormData = Object.assign({},newFormData,newGroup_id)
      }
    }
    setFormData(newFormData)
  }
  function handleCancel(){
    setFormData({username:"",password:"",repeatpassword:"",role:"",group_id:[],auth:"",usernote:""})
    setEditId("");
    setVisible(false);
  }
  function showModal(){
    setVisible(true);
  }
  //添加
  function handleOk(){
    //username:"",password:"",repeatpassword:"",role:"",group_id:[],auth:"",usernote:""
    const { username,password,repeatpassword,role,group_id,auth,usernote } = formData
    const erroList = []
    if(!username){
      erroList.push("用户名不能为空")
    }
    if(!role){
      erroList.push("权限不能为空")
    }
    if(!group_id){
      erroList.push("分组不能为空")
    }
    if(!auth){
      erroList.push("认证不能为空")
    }
    if(auth === 'default'){
      if(!password){
        erroList.push("请填写密码")
      }else if(password !== repeatpassword){
        erroList.push("两次填写密码不一样")
      }
    }
    if(erroList && erroList.length>0){
      message.error(<div style={{textAlign:"left"}}>{
        erroList.map((item,index)=>{
          return <div>{`${index+1}.${item}`}</div>
        })
      }</div>);
      return
    }
    let submitData = _.cloneDeep(formData)
    if(editId){
      submitData = Object.assign({},submitData,{id:editId})
    }
    wyAxiosPost('user/add',{...submitData},result=>{
      if(result.status === 0){
        message.warning(result.msg)
        return
      }
      message.success(result.msg);
      //这里需要切还到当前页面，并加载列表
      if(_.isEqual(formData.group_id,["1"]) ){
        setCurTab("super")
        superRef.current.doUpDate();
      }else{
        setCurTab("domain")
        domainRef.current.doUpDate();
      }
      handleCancel()
    })
  }
  //获取分层组列表
  function getGroupList(){
    wyAxiosPost('group/get',{},(result)=>{
      if(result.status === 0){
        message.warning(result.msg);
        return;
      }
      const newGroupList = _.cloneDeep(result.msg)
      setGroupList(newGroupList);
    })
  }
  function forEdit(id,param){
    setEditId(id);
    setFormData(param);
    showModal();
  }
  function curIds(){
    let ids = []
    if(curTab === 'super' && superRef.current){
      ids = superRef.current.getSelectedRowKeys()
    }else if(curTab === 'domain' && domainRef.current){
      ids = domainRef.current.getSelectedRowKeys()
    }
    return ids
  }


  function deleteSome(){
    wyAxiosPost('user/del',{ids:curIds()},(result)=>{
      if(result.status === 0){
        message.warning(result.msg)
        return
      }
      if(curTab === "super"){
        superRef.current.doUpDate();
      }else{
        domainRef.current.doUpDate();
      }
      message.success(result.msg);
    })
  }
  return(
    <div style={{background:curTheme.moduleBg,padding:"20px"}}>
      <Tabs size={"small"} tabBarExtraContent={
        <span>
          <Button
            type="primary" size={"small"} style={{margin:"0 5px 0 5px"}}
            onClick={showModal}
            ><span style={{verticalAlign:"middle"}}><MdAdd /></span> 创建</Button>
            <Popconfirm
              placement="topRight"
              title={
                ()=>{return curIds().length>0?'确定要删除这些用户吗？':'请选择要删除的项'}
              }
              onConfirm={()=>{
                return curIds().length > 0?deleteSome():null
              }}
              okText="确定"
              cancelText="取消"
              style={{margin: "0 5px"}}
            >
              <Button size={"small"} ><span style={{verticalAlign: "middle"}}><MdRemove /></span> 删除</Button>
            </Popconfirm>
        </span>}
        activeKey={curTab}
        onChange={tabChange}
      >
        <TabPane tab="全局用户" key="super">
          <Scrollbars
            autoHide
            autoHideTimeout={100}
            autoHideDuration={200}
            universal={true}
            style={{height: windowH===0?0 : windowH-160+'px'}}
          >
            <Super myref={ superRef } forEdit={ forEdit }/>
          </Scrollbars>
        </TabPane>
        <TabPane tab="分组用户" key="domain">
          <Scrollbars
            autoHide
            autoHideTimeout={100}
            autoHideDuration={200}
            universal={true}
            style={{height: windowH===0?0 : windowH-160+'px'}}
          >
            <Domain myref={ domainRef } forEdit={ forEdit }/>
          </Scrollbars>
        </TabPane>
      </Tabs>
      <Modal
          title="用户信息"
          visible={visible}
          onOk={handleOk}
          onCancel={handleCancel}
          okText="确定"
          cancelText="取消"
          destroyOnClose={true}
        >
          <div>
              <DivCont>
                <DivLeft><span style={{color:"#FF6600"}}>* </span> 用户名</DivLeft>
                <DivRight><Input
                  value={formData.username}
                  onChange={e=>{formChange({field:"username",value: e.target.value})}}
                /></DivRight>
              </DivCont>
              <DivCont>
                <DivLeft><span style={{color:"#FF6600"}}>* </span> 认证</DivLeft>
                <DivRight>
                  <Select style={{width:"100%"}}
                    value={formData.auth}
                    onChange={(value)=>{formChange({field:"auth",value: value})}}
                  >
                    <Option value="default">本地认证</Option>
                    <Option value="ldap">LDAP</Option>
                    <Option value="radius">RADIUS</Option>
                  </Select>
                  {

                    formData.auth === 'default'?
                    <div style={{margin:"5px 0  5px 0",border:"#d9d9d9 solid 1px",borderRadius:"3px",padding:"20px"}}>
                      <DivCont>
                        <DivLeft><span style={{color:"#FF6600"}}>* </span> 密码</DivLeft>
                        <DivRight><Input
                          type="password"
                          value={formData.password}
                          onChange={e=>{formChange({field:"password",value: e.target.value})}}
                        /></DivRight>
                      </DivCont>
                      <DivCont>
                        <DivLeft><span style={{color:"#FF6600"}}>* </span> 重复密码</DivLeft>
                        <DivRight><Input
                          type="password"
                          value={formData.repeatpassword}
                          onChange={e=>{formChange({field:"repeatpassword",value: e.target.value})}}
                        /></DivRight>
                      </DivCont>
                    </div>
                    :
                    ""
                  }
                </DivRight>
              </DivCont>
              <DivCont>
                <DivLeft><span style={{color:"#FF6600"}}>* </span> 角色</DivLeft>
                <DivRight>
                  <Select style={{width:"100%"}}
                    value={formData.role}
                    onChange={(value)=>{formChange({field:"role",value: value})}}
                  >
                    <Option value="1">管理员</Option>
                    <Option value="2">只读账户</Option>
                  </Select>
                </DivRight>
              </DivCont>
              <DivCont>
                <DivLeft><span style={{color:"#FF6600"}}>* </span> 分组</DivLeft>
                <DivRight>
                  <Select style={{width:"100%"}}
                    mode="multiple"
                    value={formData.group_id}
                    onChange={(value)=>{formChange({field:"group_id",value: value})}}
                  >
                    {
                      groupList && groupList.length>0?
                      groupList.map(item=>{
                        return <Option key={item.id} value={item.id}>{item.name}</Option>
                      })
                      :
                      ''
                    }
                  </Select>
                </DivRight>
              </DivCont>
              <DivCont>
                <DivLeft> 备注</DivLeft>
                <DivRight><Input
                  value={formData.usernote}
                  onChange={e=>{formChange({field:"usernote",value: e.target.value})}}
                /></DivRight>
              </DivCont>
          </div>
        </Modal>
    </div>
  )
}
const mapStateToProps = (state)=>({
  windowH: state.windowH.windowH
})
export default connect(mapStateToProps,null)(SetUser)
