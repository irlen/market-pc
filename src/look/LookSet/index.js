/** @jsx jsx */
import { jsx } from '@emotion/core'
import styled from '@emotion/styled'
import React, { useState, useEffect, useRef } from 'react'
import { connect } from 'react-redux'
import _ from 'lodash'
import { Scrollbars } from 'react-custom-scrollbars'
import { Tabs , Row, Col, Button, Divider, Drawer, Table, Spin, Empty, message, Popconfirm, Modal, Input, Form, InputNumber} from 'antd'
import { AiTwotoneEdit } from "react-icons/ai";
import { MdDelete } from "react-icons/md";

import { wyAxiosPost } from '../../components/WyAxios'
import { curTheme } from '../../styles/defineColor'



const { TabPane } = Tabs
function LookSet(props){
  //页面高度
  const [ windowH,setWindowH ]  = useState(0);
  const [visible, setVisible]  = useState(false)
  const [id, setId]  = useState("")
  //我的列表
  const [tableData,setTableData] = useState({total:0,xData:[],yData:[]})
  const [spinning,setSpinning] = useState(false)
  //分页信息
  const [pageInfo,setPageInfo] = useState({pageSize:10,current:1, search:""})
  //选中条数
  const [ selectedRowKeys,setSelectedRowKeys ] = useState([])
  const [ _isMounted,set_isMounted ] = useState(true)
  //表单相关
  const [form] = Form.useForm();
  const [formData,setFormData] = useState({categoryName:"",categoryType:""})


  //做初始化
  useEffect(()=>{
    setWindowH(props.windowH);
    getTableData();
    return ()=>{
      set_isMounted(false)
    }
  },[])
  useEffect(()=>{
    setWindowH(props.windowH)
  },[props.windowH])
  useEffect(()=>{
    form.setFieldsValue(formData);
  },[formData])


  function getTableData(){
    const info = {current:1,pageSize:5}
    wyAxiosPost('productInfo/all',{...info},(result)=>{
      if(result.code === 1){
        const xData = _.cloneDeep(result.data.xData);
        const yData = _.cloneDeep(result.data.yData);
        if(yData && yData.length>0){
          yData.map(item=>{
            item.key = item.categoryId
          })
        }
        const edit = {
          key: 'edit',
          title: '操作',
          dataIndex:'edit',
          width: 160,
          render: (text,record,index)=>(
            <span><Button onClick={()=>{doEdit(record.key)}} size={"small"}>修改</Button><Button style={{marginLeft:"10px"}} onClick={()=>{doDelete(record.key)}} size={"small"}>删除</Button></span>
          )
        }
        xData.push(edit);
        const newTableData = Object.assign({},tableData,{xData:xData},{yData:yData});
        setTableData(newTableData);
      }else{
        message.warning(result.msg);
      }
    })
  }
  function onSelectChange(selectedRowKeys ){
    setSelectedRowKeys(selectedRowKeys );
  }
  function doEdit(id){
    setId(id);
  }
  function doDelete(id){

  }
  function showModal(){
   setVisible(true);
 };
 function handleOk(){
   const info = {current:1,pageSize:10}
   if(id){
     info.categoryId = id
   }
   if(!info.categoryName || !info.categoryTye){
     message.warning("请正确完整的填写信息！");
     return
   }
   wyAxiosPost('productInfo/all',{...info},(result)=>{
     if(result.code === 1){
       getTableData();
       handleCancel();
       message.success(result.msg);
     }else{
       message.warning(result.msg);
     }
   });
 };

 function handleCancel(){
   setVisible(false);
   setFormData({categoryName:"",categoryType:""});
   setId("");
 };
 function addCategory(){
   showModal();
 }

 //表单事件
 function formChange(value){
   const newFormData = Object.assign({},formData,value);
   setFormData(newFormData);
 }

 const rowSelection = {
  selectedRowKeys,
  onChange: onSelectChange,
 };
  return (
    <div style={{background:curTheme.moduleBg,padding:"20px"}}>
      <Row gutter={16}>
        <Col span={24}>
          <div style={{textAlign:"right",lineHeight:"50px"}}>
            <Button style={{marginRight:"10px"}} type="primary" onClick={addCategory}>添加</Button>
            <Button>删除</Button>
          </div>
        </Col>
      </Row>
      <Row gutter={16}>
        <Col span={24}>
          <Table
            size={'small'}
            columns={tableData.xData}
            dataSource={tableData.yData}
            rowSelection={rowSelection}
          />
        </Col>
      </Row>
      <Modal
        title={id?"修改":"新增"}
        visible={visible}
        onOk={handleOk}
        onCancel={handleCancel}
      >
          <Form
            layout={'horizontal'}
            form={form}
            onValuesChange={formChange}
          >
            <Form.Item
              label="类目名称"
              name="categoryName"
              rules={[
                 {
                   required: true,
                   message: '请输入类目名称!',
                 },
               ]}
               hasFeedback
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="类目编号"
              name="categoryType"
              rules={[
                 {
                   required: true,
                   message: '请输入类目编号!',
                 },
               ]}
               hasFeedback
            >
              <InputNumber min={0} />
            </Form.Item>
          </Form>
      </Modal>
    </div>
  )
}

const mapStateToProps = (state)=>({
  windowH: state.windowH.windowH
})
export default connect(mapStateToProps,null)(LookSet)
