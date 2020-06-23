/** @jsx jsx */
import { jsx } from '@emotion/core'
import styled from '@emotion/styled'
import React, { useState, useEffect, useImperativeHandle } from 'react'
import { Scrollbars } from 'react-custom-scrollbars'
import { message, Table, Popconfirm } from 'antd'
import _ from 'lodash'
import { AiTwotoneEdit } from "react-icons/ai";
import { MdRemove, MdDelete } from "react-icons/md";

import { wyAxiosPost } from '../../components/WyAxios'

const Spandel = styled.div({
  textAlign:"center",
  display:"inline-block",
  width:"30px",
  cursor:"pointer",
  color:"#00CC66",
  "&:hover":{
    fontWeight:"bold",
    fontSize:"16px"
  },
  "&:active":{
    opacity:0.8
  }
})

function Domain(props){
  const [ domainList,setDomainList ] =  useState({total:0,xxx:[],yyy:[],spinning: false,})
  //选中条数
  const [ selectedRowKeys,setSelectedRowKeys ] = useState([])
  //分页信息
  const [pageInfo,setPageInfo] = useState({pageSize:10,current:1, search:""})
  useEffect(()=>{
    getdomainList();
  },[])
  //监控页面信息，然后回调getDevice
  useEffect(()=>{
    getdomainList()
  },[pageInfo])
  const onSelectChange = selectedRowKeys => {
    setSelectedRowKeys(selectedRowKeys)
  }
  function getdomainList(){
    wyAxiosPost('user/getgroup',{...pageInfo},(result)=>{
      if(result.status === 0){
        message.warning(result.msg)
        return
      }
      const newdomainList = _.cloneDeep(result.msg);
      //加操作列
      const editColumn = {
        title:"操作",
        key:"action",
        render:(text, record) => (
          <span>
            <Spandel title="编辑" onClick={()=>{editOne(record.key)}}>
              <AiTwotoneEdit />
            </Spandel>
            <Popconfirm
              placement="topRight"
              title={'确定要删除这个设备吗？'}
              onConfirm={()=>{deleteOne(record.key)}}
              okText="确定"
              cancelText="取消"
              style={{margin: "0 5px"}}
            >
              <Spandel title="删除" >
                <MdDelete />
              </Spandel>
            </Popconfirm>

          </span>
        )
      }
      newdomainList.xxx.push(editColumn)
      setDomainList(newdomainList);
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
  useImperativeHandle(props.myref,()=>({
    doUpDate: ()=>{
      if(pageInfo.current === 1){
        getdomainList()
      }else{
        const curPageInfo = _.cloneDeep(pageInfo)
        const newPageInfo = Object.assign({},curPageInfo,{current:1})
        setPageInfo(newPageInfo)
      }
    },
    getSelectedRowKeys:()=>{return selectedRowKeys}
  }),[selectedRowKeys])
  function deleteOne(id){
    wyAxiosPost('user/dele',{id},(result)=>{
      if(result.status === 0){
        message.warning(result.msg)
        return
      }
      if(pageInfo.current === 1){
        getdomainList()
      }else{
        const curPageInfo = _.cloneDeep(pageInfo)
        const newPageInfo = Object.assign({},curPageInfo,{current:1})
        setPageInfo(newPageInfo)
      }
      message.success(result.msg);
    })
  }
  function editOne(id){
    wyAxiosPost('user/get',{id},(result)=>{
      if(result.status === 0){
        message.warning(result.msg)
        return
      }
      const param = _.cloneDeep(result.msg)
      props.forEdit(id,param)
    })
  }
  return (
    <div>
      <Table
        rowSelection={{selectedRowKeys,onChange:onSelectChange}}
        columns ={domainList.xxx}
        dataSource={domainList.yyy}
        bordered
        pagination={{
          pageSize: pageInfo.pageSize,
          pageSizeOptions: ["5","10","20","30","40"],
          showSizeChanger: true,
          showQuickJumper: true,
          current: pageInfo.current,
          total: domainList.total,
          onShowSizeChange: pageSizeChange,
          onChange: pageChange
        }}
      />
    </div>
  )
}


export default Domain
