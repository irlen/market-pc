/** @jsx jsx */
import { jsx } from '@emotion/core'
import styled from '@emotion/styled'
import React, { useState, useEffect, useRef } from 'react'
import { connect } from 'react-redux'
import _ from 'lodash'
import { Scrollbars } from 'react-custom-scrollbars'
import { Tabs , Row, Col, Button, Divider, Drawer, Table, Spin, Empty, message, Popconfirm } from 'antd'
import { AiTwotoneEdit } from "react-icons/ai";
import { MdDelete } from "react-icons/md";

import { wyAxiosPost } from '../../components/WyAxios'
import { curTheme } from '../../styles/defineColor'
import FieldForm from './FieldForm'


const { TabPane } = Tabs
function ChangeRequest(props){
  //页面高度
  const [ windowH,setWindowH ]  = useState(0);
  const [visible, setVisible]  = useState(false)
  const [id, setId]  = useState("")
  //我的列表
  const [tableData,setTableData] = useState({total:0,xxx:[],yyy:[]})
  const [spinning,setSpinning] = useState(false)
  //分页信息
  const [pageInfo,setPageInfo] = useState({pageSize:10,current:1, search:""})
  //选中条数
  const [ selectedRowKeys,setSelectedRowKeys ] = useState([])
  const [ _isMounted,set_isMounted ] = useState(true)
  //做初始化
  useEffect(()=>{
    setWindowH(props.windowH);

    return ()=>{
      set_isMounted(false)
    }
  },[])
  useEffect(()=>{
    setWindowH(props.windowH)
  },[props.windowH])
  //监控页面信息，然后回调getDevice
  useEffect(()=>{
    getDataList()
  },[pageInfo])

  const onSelectChange = selectedRowKeys => {
    setSelectedRowKeys(selectedRowKeys)
  }
  function pageSizeChange(current, size){
    const curPageInfo = _.cloneDeep(pageInfo)
    const newPageInfo = Object.assign({},curPageInfo,{pageSize: size,current: 1})
    setPageInfo(newPageInfo)
  }
  function pageChange(value){
    const curPageInfo = _.cloneDeep(pageInfo)
    const newPageInfo = Object.assign({},curPageInfo,{current: value})
    setPageInfo(newPageInfo)
  }
  function searchChange(value){
    const curPageInfo = _.cloneDeep(pageInfo)
    const newPageInfo = Object.assign({},curPageInfo,{search: value,current:1})
    setPageInfo(newPageInfo)
  }
  function showDrawer(){
    setVisible(true);
  }
  function onClose(){
    setVisible(false);
    setId("");
  };
  //添加按钮事件
  function addDevice(){
    showDrawer()
  }
  //编辑
  function editDevice(id){
    setId(id)
    setVisible(true)
  }
  //删除
  function deleteOne(value){
    wyAxiosPost('Order/del',{id:value},(result)=>{
        if(result.status === 1){
          message.success(result.msg)
          getDataList();
        }else{
          message.warning(result.msg)
        }
    })
  }
  //删除所有
  function deleteSome(){
    wyAxiosPost('Order/del',{ids:selectedRowKeys},(result)=>{
      if(result.status === 1){
        message.success(result.msg)
        getDataList();
      }else{
        message.warning(result.msg)
      }
    })
  }

  //获取列表
  function getDataList(search=''){
    const {current,pageSize} = pageInfo
    const info = {current,pageSize}
    if(search){
      info.search = search
    }
    if(_isMounted){
      setSpinning(true)
    }
    wyAxiosPost('Order/getOrderList',{...info},(result)=>{
      if(result.status === 1){
        const responseData = result.msg
        let curxData = _.cloneDeep(responseData.xxx)
        if(curxData && curxData.length>0){
            curxData.map(item=>{
              if(item.dataIndex === 'progress'){
                item.render=(text, record, index)=>{
                  const colors = ['#BBBBBB','#33CC00','#FFFF00','#FF3300']
                  return <div style={{width:"80%",display:"flex"}}>
                    {
                      text && text.length>0?
                      text.map((subItem,index)=>{
                        return <div key={index} style={{height:"10px",background:colors[subItem.color],width:"20%",marginRight:"2px"}}></div>
                      })
                      :
                      ''
                    }
                  </div>
                }
              }else if(item.dataIndex === 'status'){
                item.filters =[
                                {
                                  text: '进行中',
                                  value: 1,
                                },
                                {
                                  text: '已取消',
                                  value: 0,
                                },
                              ]
                item.filterMultiple = false
                item.onFilter = (value, record) => {
                  return record.status === value
                }
                item.render=(text, record, index)=>{
                  return record.status === 1?<span>进行中</span>:<span style={{color:"#cdcdcd"}}>已取消</span>
                }
              }else{
                item.render=(text, record, index)=>{
                  if(record.status === 0){
                    return <span style={{color:"#cdcdcd"}}>{text}</span>
                  }else{
                    return <span>{text}</span>
                  }
                }
              }
            })
          }
        curxData.push({
          title: '操作',
          dataIndex: 'edit',
          render: (text, record, index)=>{
            if(record.status === 0){
              return (
                <span>
                  <span title="编辑" onClick={()=>{return}} >
                    <AiTwotoneEdit />
                  </span>
                  <span title="取消">
                    <MdDelete />
                  </span>
                </span>
              )
            }else{
              return (
                <span>
                  <span title="编辑" style={{cursor:"pointer",color: "#00CC66"}} onClick={()=>{editDevice(record.key)}} >
                    <AiTwotoneEdit />
                  </span>
                  <Popconfirm
                    placement="topRight"
                    title={'确定要取消这个工单吗？'}
                    onConfirm={()=>{deleteOne(record.key)}}
                    okText="确定"
                    cancelText="取消"
                    style={{margin: "0 5px"}}
                  >
                    <span title="取消" style={{cursor:"pointer",color: "#00CC66"}}>
                      <MdDelete />
                    </span>
                  </Popconfirm>
                </span>
              )
            }
          }
        })
        if(_isMounted){
          const newTableData = {
            xxx: curxData,
            yyy: responseData.yyy,
            total: responseData.total,
          }
          setTableData(_.cloneDeep(newTableData))
          setSpinning(false)
        }
      }else{
        message.warning(result.msg);
      }
    })
  }
  return (
    <div style={{background:curTheme.moduleBg,padding:"20px"}}>
      <Row gutter={16}>
        <Col span={24} style={{marginBottom:"10px"}}>
          <div style={{display:"flex"}}>
            <div style={{flex:"1 1 auto"}}>
              <span style={{cursor:"pointer",lineHeight:"30px"}}>我的</span>
              <Divider type="vertical" />
              <span><Button onClick={addDevice} size={"small"} type="primary">新工单</Button></span>
            </div>
            <div style={{flex:"0 0 60px"}}>
              <Popconfirm
                placement="topRight"
                title={selectedRowKeys.length ===0?'请选择要删除的项':'确定要删除所选工单吗？'}
                onConfirm={selectedRowKeys.length === 0?()=>{return}:deleteSome}
                okText="确定"
                cancelText="取消"
                style={{margin: "0 5px"}}
              >
                <Button size={'small'}>删除</Button>
              </Popconfirm>
            </div>
          </div>
        </Col>
        <Col span={24}>
          <Spin spinning={spinning}>
            <Scrollbars
              autoHide
              autoHideTimeout={100}
              autoHideDuration={200}
              universal={true}
              style={{height: windowH===0?0 : windowH-180+'px'}}
            >
              {
                tableData.yyy && tableData.yyy.length>0?
                <Table
                  rowSelection={{selectedRowKeys,onChange:onSelectChange}}
                  columns ={tableData.xxx}
                  dataSource={tableData.yyy}
                  bordered
                  pagination={{
                    pageSize: pageInfo.pageSize,
                    pageSizeOptions: ["5","10","20","30","40"],
                    showSizeChanger: true,
                    showQuickJumper: true,
                    current: pageInfo.current,
                    total: tableData.total,
                    onShowSizeChange: pageSizeChange,
                    onChange: pageChange
                  }}
                />
                :
                <Empty />
              }
            </Scrollbars>
          </Spin>
        </Col>
      </Row>
      <Drawer
        title={id === ''?'创建工单':'操作工单'}
        height={windowH?windowH-160+"px":0}
        onClose={onClose}
        visible={visible}
        placement={'bottom'}
        destroyOnClose={true}
        className="changeRequest"
      >
        <FieldForm
          id={id}
          setId={(id)=>{setId(id)}}
          onClose={onClose}
          getDataList={getDataList}
          setVisible={(arg)=>{setVisible(arg)}}
        />
      </Drawer>
    </div>
  )
}

const mapStateToProps = (state)=>({
  windowH: state.windowH.windowH
})
export default connect(mapStateToProps,null)(ChangeRequest)
