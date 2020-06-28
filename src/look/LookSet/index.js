/** @jsx jsx */
import { jsx } from '@emotion/core'
import styled from '@emotion/styled'
import React, { useState, useEffect, useRef } from 'react'
import { connect } from 'react-redux'
import _ from 'lodash'
import { Scrollbars } from 'react-custom-scrollbars'
import { Tabs , Row, Col, Button, Divider, Drawer, Table, Spin, Empty, message, Popconfirm, Modal, Input, Form, InputNumber, Select, Upload } from 'antd'
import { PlusOutlined  } from '@ant-design/icons'
import { AiTwotoneEdit } from "react-icons/ai";
import { MdDelete } from "react-icons/md";
import moment from 'moment'
import { host } from '../../components/Host'

import { wyAxiosPost } from '../../components/WyAxios'
import { curTheme } from '../../styles/defineColor'


const { TextArea } = Input
const { TabPane } = Tabs
const { Option } = Select
function LookSet(props){
  //页面高度
  const [ windowH,setWindowH ]  = useState(0);
  const [visible, setVisible]  = useState(false)
  const [id, setId]  = useState("")
  //商品列表
  const [tableData,setTableData] = useState({total:0,xData:[],yData:[]})
  const [spinning,setSpinning] = useState(false)
  //类目列表
  const [categoryList,setCategoryList] = useState([])
  //分页信息
  const [pageInfo,setPageInfo] = useState({pageSize:10,current:1, search:""})
  //选中条数
  const [ selectedRowKeys,setSelectedRowKeys ] = useState([])
  const [ _isMounted,set_isMounted ] = useState(true)
  //表单相关
  const [form] = Form.useForm();
  const [formData,setFormData] = useState({productName: "",productPrice:"",productReal:"",productStock:"",categoryType:"",productDescription:""})
  //图片上传
  const [previewData, setPreviewData] = useState({ previewVisible: false, previewImage:'', previewTitle:'' })
  const [fileList,setFileList]  = useState([
      {
        uid: '-1',
        name: 'image.png',
        status: 'done',
        url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
      },
      {
        uid: '-2',
        name: 'image.png',
        status: 'done',
        url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
      }])


  //做初始化
  useEffect(()=>{
    setWindowH(props.windowH);
    getTableData();
    getCategoryList();
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
  useEffect(()=>{
    getTableData();
  },[pageInfo])
  function getTableData(){
    const info = {current:pageInfo.current,pageSize:pageInfo.pageSize}
    wyAxiosPost('productInfo/all',{...info},(result)=>{
      if(result.code === 1){
        const xData = _.cloneDeep(result.data.xData);
        const yData = _.cloneDeep(result.data.yData);
        if(yData && yData.length>0){
          yData.map(item=>{
            item.key = item.productId
            item.updateTime = moment(item.updateTime).format("YYYY-MM-DD hh:mm:ss")
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
        const newTableData = Object.assign({},tableData,{xData:xData,yData:yData,total: result.data.total});
        setTableData(newTableData);
      }else{
        message.warning(result.msg);
      }
    })
  }
  //获取类目列表
  function getCategoryList(){
    wyAxiosPost('category/list',{},(result)=>{
      if(result.code === 1){
        const newCategoryList = _.cloneDeep(result.data)
        setCategoryList(newCategoryList);
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
  function pageSizeChange(current, size){
    const curPageInfo = _.cloneDeep(pageInfo)
    const newPageInfo = Object.assign({},curPageInfo,{pageSize: size,current})
    setPageInfo(newPageInfo)
  }
  function pageChange(value){
    const curPageInfo = _.cloneDeep(pageInfo)
    const newPageInfo = Object.assign({},curPageInfo,{current: value})
    setPageInfo(newPageInfo)
  }

 //表单事件
 function formChange(value){
   const newFormData = Object.assign({},formData,value);
   setFormData(newFormData);
 }
 function showDrawer(){
   form.resetFields();
   setVisible(true);
 };
 function onClose(){
   setFormData({productName:"",productPrice:"",productReal:"",productStock:"",categoryType:"",productDescription:""})
   //图片上传
   setPreviewData({ previewVisible: false, previewImage:'', previewTitle:'' })
   setFileList([])
   setVisible(false);
 };
 //提交表单
 function doSubmit(){
   const arr = form.getFieldsError();
   function checkErro(item){
     return item.errors.length === 0
   }
   const isRight = arr.every(checkErro);
   console.log(formData)
   console.log(isRight)
   if(formData.productName=== "" || formData.productPrice==="" || formData.productReal==="" || formData.productStock==="" || formData.categoryType===""){
     message.warning("请正确填写所有选项");
     return
   }
   if(!isRight){
     message.warning("请正确填写所有选项");
     return
   }
   wyAxiosPost("product/save",{...formData},(result)=>{
     if(result.code === 1){
       getTableData();
       onClose();
     }else{
       message.warning(result.msg)
     }
   })

 }
 function addProduct(){
   showDrawer();
 }
 //图片上传
 function getBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });
}
function handleCancel(){
  const curPreviewData = _.cloneDeep(previewData);
  const newPreviewData = Object.assign({},curPreviewData,{previewVisible: false});
  setPreviewData(newPreviewData);
}

async function handlePreview (file){
  if (!file.url && !file.preview) {
    file.preview = await getBase64(file.originFileObj);
  }
  const curPreviewData = _.cloneDeep(previewData);
  const newPreviewData = Object.assign({},curPreviewData,{
    previewVisible: true,
    previewImage: file.url || file.preview,
    previewTitle: file.name || file.url.substring(file.url.lastIndexOf('/') + 1)
  });
  setPreviewData(newPreviewData);
}


function handleChange({fileList}){
  setFileList(fileList);
}
 const rowSelection = {
  selectedRowKeys,
  onChange: onSelectChange,
 };
 const uploadButton = (
    <div>
      <PlusOutlined />
      <div className="ant-upload-text">Upload</div>
    </div>
  );
  return (
    <div style={{background:curTheme.moduleBg,padding:"20px"}}>
      <Row gutter={16}>
        <Col span={24}>
          <div style={{textAlign:"right",lineHeight:"50px"}}>
            <Button style={{marginRight:"10px"}} type="primary" onClick={addProduct}>添加</Button>
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
        </Col>
      </Row>
      <Drawer
        title="添加商品"
        placement="right"
        closable={false}
        onClose={onClose}
        visible={visible}
        width="90%"
        footer={
            <div
              style={{
                textAlign: 'right',
              }}
            >
              <Button onClick={onClose} style={{ marginRight: 8 }}>
                取消
              </Button>
              <Button onClick={doSubmit} type="primary">
                确定
              </Button>
            </div>
          }
      >
        <Form
          layout={'horizontal'}
          form={form}
          onValuesChange={formChange}
        >
          <Row gutter={16}>
            <Col span={8}>
              <Form.Item
                label="商品名称"
                name="productName"
                initialvalue=""
                rules={[
                   {
                     required: true,
                     message: '请输入商品名称!',
                   },
                 ]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                label="商品促销价"
                name="productPrice"
                style={{width:"100%"}}
                initialvalue=""
                rules={[
                   {
                     required: true,
                     message: '请输入商品促销价!',
                   },
                 ]}
              >
                <InputNumber min={0} />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                label="商品真实价"
                name="productReal"
                style={{width:"100%"}}
                initialvalue=""
                rules={[
                   {
                     required: true,
                     message: '请输入商品真实价!',
                   },
                 ]}
              >
                <InputNumber min={0} />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                label="库存"
                name="productStock"
                style={{width:"100%"}}
                initialvalue=""
                rules={[
                   {
                     required: true,
                     message: '请输入商品库存!',
                   },
                 ]}
              >
                <InputNumber min={0} />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                label="所属类目"
                name="categoryType"
                initialvalue=""
                rules={[
                   {
                     required: true,
                     message: '请选择类目!',
                   },
                 ]}
              >
                <Select
                  showSearch
                  optionFilterProp="children"
                  filterOption={(input, option) =>
                    option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                  }
                  allowClear
                >
                  {
                    categoryList && categoryList.length>0?
                    categoryList.map(item=>{
                      return <Option key={item.categoryType} value={item.categoryType}>{item.categoryName}</Option>
                    })
                    :
                    ''
                  }
                </Select>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                label="商品状态"
                name="productStatus"
                initialvalue=""
                rules={[
                   {
                     required: true,
                     message: '请选择状态!',
                   },
                 ]}
              >
                <Select
                  allowClear
                >
                  <Option key={0} value={0}>下架</Option>
                  <Option key={1} value={1}>上架</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item
                label="描述"
                name="productDescription"
                style={{width:"100%"}}
                initialvalue=""
                rules={[
                   {
                     // required: true,
                     // message: '请输入商品描述!',
                   },
                 ]}
              >
                <TextArea />
              </Form.Item>
            </Col>
            <Col span={24}>
              <div>商品展示图片</div>
              <div className="clearfix" style={{border:"#cdcdcd solid 1px",padding:"20px",width:"100%",minHeight:"200px"}}>
                <Upload
                  action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
                  listType="picture-card"
                  fileList={fileList}
                  onPreview={handlePreview}
                  onChange={handleChange}
                  multiple
                >
                  {fileList.length >= 8 ? null : uploadButton}
                </Upload>
                <Modal
                  visible={previewData.previewVisible}
                  title={previewData.previewTitle}
                  footer={null}
                  onCancel={handleCancel}
                >
                  <img alt="example" style={{ width: '100%' }} src={previewData.previewImage} />
                </Modal>
              </div>
            </Col>
          </Row>
        </Form>
      </Drawer>
    </div>
  )
}

const mapStateToProps = (state)=>({
  windowH: state.windowH.windowH
})
export default connect(mapStateToProps,null)(LookSet)
