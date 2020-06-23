/** @jsx jsx */
import { jsx } from '@emotion/core'
import styled from '@emotion/styled'
import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'
import { Button, Menu, Dropdown ,Space, message, Modal, Input, Select, InputNumber, Spin, Table, Popconfirm, Empty, Checkbox } from 'antd'
import { DownOutlined } from '@ant-design/icons';
import { FiPlus } from "react-icons/fi";
import { MdRemove, MdDelete } from "react-icons/md";
import { FaLevelDownAlt,FaLevelUpAlt, FaFilter,FaUnlink, FaLink } from "react-icons/fa";
import { AiTwotoneEdit } from "react-icons/ai";
import _ from 'lodash'
import { Scrollbars } from 'react-custom-scrollbars'

import { forName, singleIp, singlePort } from '../../components/RegExp'
import { wyAxiosPost } from '../../components/WyAxios'

const CheckboxGroup = Checkbox.Group
const { Search } = Input
const DivCont = styled.div({
  margin:"5px auto",
  display: "flex",
  lineHeight:"30px"
})
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
const DivLeft = styled.div({
  flex:"0 0 100px"
})
const DivRight = styled.div({
  flex:"1 1 auto"
})
const { SubMenu } = Menu;
const { Option }  = Select;
function SetMonitor(props){
  //页面高度
  const [ windowH,setWindowH ]  = useState(0);
  //设备列表
  const [equipmentList,setEquipmentList] = useState([]);
  //设备类型
  const [equipmentId, setEquipmentId] = useState({brandId:"",is_fire:""});
  //控制modal状态
  const [visible,setVisible] = useState(false);
  //是否在测试
  const [isTesting,setIsTesting] = useState({spinning:false,result:0})
  //表单数据
  const [formData,setFormData] = useState({
    equipname:"",ip:"",logintype:"",username:"",password:"",repeatpassword:"",secret:"",timegap:"",areainfo:"",definetimegap:0,desc:""
  });
  //区域分组
  const [groupList, setGroupList] = useState([])
  //分页信息
  const [pageInfo,setPageInfo] = useState({pageSize:10,current:1, search:""})
  //设备列表
  const [deviceList,setDeviceList] = useState({total:0,xxx:[],yyy:[],spinning: false,allxxx:[]})
  //选中条数
  const [ selectedRowKeys,setSelectedRowKeys ] = useState([])
  // 所有列和被选中的列
  const [columnData, setColumnData] = useState({allColumn:[],selectedColumn:[],indeterminate: false,checkAll: true})
  //当前编辑的id
  const [editInfo,setEditInfo] = useState({editId:"",brandId:""})

  //做初始化
  useEffect(()=>{
    setWindowH(props.windowH);
    getEquipment();
    getGroupList();
    getDevice();
  },[])

  //监控windowH
  useEffect(()=>{
    setWindowH(props.windowH);
  },[props.windowH])
  //监控页面信息，然后回调getDevice
  useEffect(()=>{
    getDevice()
  },[pageInfo])
  //获取设备列表
  function getEquipment(){
    wyAxiosPost('equipment/get',{},(result)=>{
      if(result.status !== 1){
        message.warning(result.msg)
        return
      }
      const data = _.cloneDeep(result.msg)
      const listData = [];
      if(data && data.length>0){
        data.forEach((item,index)=>{
           const curIndex = _.findIndex(listData,(o)=>{
             return o.name === item.name
           })
           const isExist = curIndex === -1?false: true;
           if(isExist){
             listData[curIndex]["children"].push({name:item.type,type:item.type,id:item.id,is_fire:item.is_fire});
           }else{
             const meta = {name:item.name,id:item.name,children:[{name:item.type,type:item.type,id:item.id,is_fire:item.is_fire}]}
             listData.push(meta)
           }
        })
      }
      setEquipmentList(listData)
    })
  }
  //获取添加时设备Id
  function getEquipmentId(value){
    setEquipmentId(value);
    showModal();
  }
  function handleCancel(){
    setFormData({equipname:"",ip:"",logintype:"",username:"",password:"",repeatpassword:"",secret:"",secret:"",timegap:"",areainfo:"",definetimegap:0,desc:""})
    setEditInfo({exitId:"",brandId:""})
    setVisible(false);
  }
  function showModal(){
    setVisible(true);
  }
  //设置表单数据
  function formChange(param){
    setIsTesting({spinning: false,result: 0})
    let data = {}
    if(param.field === 'areainfo' && param.value.length>0){
      const haha = _.cloneDeep(param);
      const lastMeta = haha.value.pop();
      const arr = []
      arr.push(lastMeta)
      data = { [param.field]: arr }
    }else{
      data = {[param.field]:param.value}
    }
    if(param.field === 'logintype' && param.value){
      if(param.value === 'https'){
        data.port = 443
      }else if(param.value === 'ssh'){
        data.port = 22
      }else if(param.value === 'telnet'){
        data.port = 23
      }
    }
    const curFormData = _.cloneDeep(formData)
    const newFormData = Object.assign({},curFormData,data)
    setFormData(newFormData)
  }
  //测试
  function dotest(){
    const data = Object.assign({},equipmentId,formData)
    const {brandId,username,logintype,password,secret,ip,port} = data
    setIsTesting({spinning: true,result: 0})
    wyAxiosPost('device/test',{id:brandId,username,logintype,password,secret,ip,port},(result)=>{
      if(result.status === 1){
        setIsTesting({spinning: false,result: 1})
        message.success(result.msg);
      }else{
        setIsTesting({spinning: false,result: 0})
        message.warning(result.msg)
      }
    })
  }
  //添加
  function handleOk(){
    let data = Object.assign({},equipmentId,formData,{areainfo:formData.areainfo[0]})
    if(editInfo&&editInfo.editId){
      data = Object.assign({},data,{id: editInfo.editId,brandId:editInfo.brandId})
    }
    //验证字段合法性
    //名称
    const erroList = []
    //equipname:"",ip:"",logintype:"",username:"",password:"",repeatpassword:"",secret:"",timegap:"",areainfo:"",definetimegap:0,desc:""
    if(data.equipname === ''){
      erroList.push("设备名称不能为空")
    }else if(!forName.test(data.equipname)){
      erroList.push("设备名称格式有误（须十个字符内）");
    }
    //设备Ip
    if(data.ip === ''){
      erroList.push("设备ip不能为空")
    }else if(!singleIp.test(data.ip)){
      erroList.push("设备ip格式有误");
    }
    //设备Ip
    if(data.port === ''){
      erroList.push("端口不能为空")
    }else if(!singlePort.test(data.port)){
      erroList.push("端口格式有误");
    }
    //登陆方式
    if(data.logintype === ''){
      erroList.push("登陆方式不能为空")
    }
    //用户名
    if(data.username === ""){
      erroList.push("用户名不能为空")
    }
    //密码
    if(data.password === ""){
      erroList.push("密码不能为空")
    }else if(data.password !== data.repeatpassword){
      erroList.push("两次输入的密码不同")
    }
    //间隔
    if(data.timegap === ''){
      erroList.push("间隔不能为空")
    }else if(data.areainfo==="自定义" && data.definetimegap ===""){
      erroList.push("自定义间隔不能为空")
    }
    //区域信息
    if(!data.areainfo){
      erroList.push("区域信息不能为空")
    }

    if(erroList && erroList.length>0){
      message.error(<div style={{textAlign:"left"}}>{
        erroList.map((item,index)=>{
          return <div>{`${index+1}.${item}`}</div>
        })
      }</div>);
      return
    }
    wyAxiosPost('device/add',{...data},(result)=>{
      if(result.status === 0){
        message.warning(result.msg);
        return
      }
      handleCancel();
      getDevice();
      message.success(result.msg);
    })
  }
  //获取设备
  function getDevice(){
    const aDeviceList = _.cloneDeep(deviceList)
    setDeviceList(Object.assign({},aDeviceList,{spinning: true}));
    wyAxiosPost('device/getlist',{...pageInfo},(result)=>{
      if(result.status === 0){
        message.warning(result.msg)
        return
      }
      const data = _.cloneDeep(result.msg)
      //加操作列
      const editColumn = {
        title:"操作",
        key:"action",
        render:(text, record) => (
          <span>
            <Popconfirm
              placement="topRight"
              title={'确定要删除这个设备吗？'}
              onConfirm={()=>{deleteOne(record.key)}}
              okText="确定"
              cancelText="取消"
              style={{margin: "0 5px"}}
            >
              <Spandel titile="删除" >
                <MdDelete />
              </Spandel>
            </Popconfirm>
            <Spandel titile="编辑" onClick={()=>{editOne(record.key)}}>
              <AiTwotoneEdit />
            </Spandel>
          </span>
        )
      }
      data.xxx.push(editColumn)
      if(data.xxx && data.xxx.length>0){
        const allColumn = []
        data.xxx.map(item=>{
          if(item.dataIndex === "is_conn"){
            item.render=(text, record)=>{
              if(text === 1){
                return <span title="连接" style={{color:"#00cc66",fontSize:"16px"}}><FaLink /></span>
              }else{
                return <span title="未连接" style={{color:"#666666",fontSize:"16px"}}><FaUnlink/></span>
              }
            }
          }
          allColumn.push(item.title)
        })
        setColumnData({allColumn, selectedColumn:allColumn, checkAll: true, indeterminate: false})
      }
      const curDeviceList = _.cloneDeep(deviceList)
      const newDeviceList = Object.assign({},curDeviceList,data,{spinning: false,allxxx:data.xxx})
      setDeviceList(newDeviceList);
    })
  }
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
  function deleteSome(){
    wyAxiosPost('device/del',{ids:selectedRowKeys},(result)=>{
      if(result.status === 0){
        message.warning(result.msg)
        return
      }
      const curPageInfo = _.cloneDeep(pageInfo)
      const newPageInfo = Object.assign({},curPageInfo,{current:1})
      setPageInfo(newPageInfo)
      message.success(result.msg);
    })
  }
  function deleteOne(id){
    wyAxiosPost('device/dele',{id},(result)=>{
      if(result.status === 0){
        message.warning(result.msg)
        return
      }
      if(pageInfo.current === 1){
        getDevice()
      }else{
        const curPageInfo = _.cloneDeep(pageInfo)
        const newPageInfo = Object.assign({},curPageInfo,{current:1})
        setPageInfo(newPageInfo)
      }
      message.success(result.msg);
    })
  }
  function editOne(id){
    wyAxiosPost('device/get',{id},(result)=>{
      if(result.status === 0){
        message.warning(result.msg)
        return
      }
      const curFormData = _.cloneDeep(formData)
      const data = _.cloneDeep(result.msg)
      const newFormData = Object.assign({},curFormData,data,{repeatpassword: data.password})
      setFormData(newFormData);
      setEditInfo({editId:id,brandId:data.brandId})
      showModal();
    })
  }
  function columnChange(selectedColumn){
    const data = {
      selectedColumn,
      indeterminate: !!selectedColumn.length && selectedColumn.length < columnData.allColumn.length,
      checkAll: selectedColumn.length === columnData.allColumn.length
    }
    const curColumnData = _.cloneDeep(columnData)
    const newColumnData = Object.assign({},curColumnData,data)
    setColumnData(newColumnData)
  }
  //选择所有列
  function checkAllChange(e){
    const data = {
      selectedColumn: e.target.checked ? columnData.allColumn : [],
      indeterminate: false,
      checkAll: e.target.checked,
    }
    const curColumnData = _.cloneDeep(columnData)
    const newColumnData = Object.assign({},curColumnData,data)
    setColumnData(newColumnData)
  }
  function doColumnChange(){
    const curxxx = _.cloneDeep(deviceList.allxxx)
    const newxxx = curxxx.filter(o=>{
      return columnData.selectedColumn.indexOf(o.title) !== -1
    })
    const curDeviceList = _.cloneDeep(deviceList)
    const newDeviceList = Object.assign({},curDeviceList,{xxx:newxxx})
    setDeviceList(newDeviceList);
  }
  //获取分组
  function getGroupList(){
    wyAxiosPost('group/get',{},(result)=>{
      if(result.status === 0){
        message.warning(result.msg)
        return
      }
      const data = _.cloneDeep(result.msg)
      setGroupList(data)
    })
  }
  const digui = (arr)=>{
    return arr.map((item)=>{
      if(item.children && item.children.length>0){
        return <SubMenu
          key={item.id}
          title={item.name}
        >
          { digui(item.children) }
        </SubMenu>
      }else{
        return <Menu.Item key={item.id} onClick={()=>{getEquipmentId({brandId:item.id,is_fire:item.is_fire})}}>
          {item.name}
        </Menu.Item>
      }
    })
  }
  return(
    <div>
      <div style={{display:"flex"}}>
		    <div style={{flex:"1 1 auto"}}>

            <Button style={{margin:"0 5px"}}>
              <Dropdown overlay={
                  equipmentList && equipmentList.length>0?
                  <Menu>{digui(equipmentList)}</Menu>
                  :
                  <Menu>无数据</Menu>
              }>
                <a className="ant-dropdown-link">
                  <span style={{verticalAlign: "middle"}}><FiPlus /></span> 创建设备 <DownOutlined />
                </a>
              </Dropdown>
            </Button>
            <Button type="primary" style={{margin:"0 5px"}}><span style={{verticalAlign: "middle"}}><FaLevelDownAlt /></span> 导入</Button>
            <Button type="primary" style={{margin:"0 5px"}}><span style={{verticalAlign: "middle"}}><FaLevelUpAlt /></span> 导出</Button>
            <Popconfirm
              placement="topRight"
              title={selectedRowKeys.length ===0?'请选择要删除的项':'确定要删除这些设备吗？'}
              onConfirm={selectedRowKeys.length === 0?()=>{return}:deleteSome}
              okText="确定"
              cancelText="取消"
              style={{margin: "0 5px"}}
            >
              <Button><span style={{verticalAlign: "middle"}}><MdRemove /></span> 删除</Button>
            </Popconfirm>

        </div>
        <div style={{flex:"0 0 260px"}}>
          <Search
            placeholder="input search text"
            onSearch={searchChange}
            style={{ width: 200 }}
          />
          <Popconfirm
            placement="bottomLeft"
            title={
              <div>
                <div className="site-checkbox-all-wrapper">
                  <Checkbox
                    indeterminate={columnData.indeterminate}
                    checked={columnData.checkAll}
                    onChange={checkAllChange}
                  >
                    显示所有字段
                  </Checkbox>
                </div>
                <br />
                <CheckboxGroup
                  options={columnData.allColumn}
                  value={columnData.selectedColumn}
                  onChange={columnChange}
                />
              </div>
            }
            onConfirm={doColumnChange}
            okText="确定"
            cancelText="取消"
          >
            <Spandel style={{display:"inline-block",marginLeft:"20px"}}><FaFilter /></Spandel>
          </Popconfirm>
        </div>
      </div>
      <div style={{marginTop:"20px"}}>
        <Spin spinning={deviceList.spinning}>
          <Scrollbars
            autoHide
            autoHideTimeout={100}
            autoHideDuration={200}
            universal={true}
            style={{height: windowH===0?0 : windowH-160+'px'}}
          >
            {
              deviceList.yyy && deviceList.yyy.length>0?
              <Table
                rowSelection={{selectedRowKeys,onChange:onSelectChange}}
                columns ={deviceList.xxx}
                dataSource={deviceList.yyy}
                bordered
                pagination={{
                  pageSize: pageInfo.pageSize,
                  pageSizeOptions: ["5","10","20","30","40"],
                  showSizeChanger: true,
                  showQuickJumper: true,
                  current: pageInfo.current,
                  total: deviceList.total,
                  onShowSizeChange: pageSizeChange,
                  onChange: pageChange
                }}
              />
              :
              <Empty />
            }
          </Scrollbars>
        </Spin>
      </div>
      <Modal
          title="设备信息"
          visible={visible}
          onOk={handleOk}
          onCancel={handleCancel}
          okText="确定"
          cancelText="取消"
          destroyOnClose={true}
        >
          <div>
              <DivCont>
                <DivLeft><span style={{color:"#FF6600"}}>* </span> 设备名称</DivLeft>
                <DivRight><Input
                  value={formData.equipname}
                  onChange={e=>{formChange({field:"equipname",value: e.target.value})}}
                /></DivRight>
              </DivCont>
              <DivCont>
                <DivLeft><span style={{color:"#FF6600"}}>* </span> 设备Ip</DivLeft>
                <DivRight><Input
                value={formData.ip}
                onChange={
                  e=>{formChange({field:"ip",value: e.target.value})}
                }
                /></DivRight>
              </DivCont>
              <DivCont>
                <DivLeft><span style={{color:"#FF6600"}}>* </span> 登陆方式</DivLeft>
                <DivRight>
                  <Select style={{width:"100%"}}
                    value={formData.logintype}
                    onChange={(value)=>{formChange({field:"logintype",value: value})}}
                  >
                    <Option value="https">HTTPS</Option>
                    <Option value="ssh">SSH</Option>
                    <Option value="telnet">Telnet</Option>
                  </Select>
                </DivRight>
              </DivCont>
              <DivCont>
                <DivLeft><span style={{color:"#FF6600"}}>* </span> 端口</DivLeft>
                <DivRight><Input
                  value={formData.port}
                  onChange={e=>{formChange({field:"port",value: e.target.value})}}
                /></DivRight>
              </DivCont>
              <DivCont>
                <DivLeft><span style={{color:"#FF6600"}}>* </span> 用户名</DivLeft>
                <DivRight><Input
                  value={formData.username}
                  onChange={e=>{formChange({field:"username",value: e.target.value})}}
                /></DivRight>
              </DivCont>
              <DivCont>
                <DivLeft><span style={{color:"#FF6600"}}>* </span> 密码</DivLeft>
                <DivRight><Input type="password"
                  value={formData.password}
                  onChange={e=>{formChange({field:"password",value: e.target.value})}}
                /></DivRight>
              </DivCont>
              <DivCont>
                <DivLeft><span style={{color:"#FF6600"}}>* </span> 重复密码</DivLeft>
                <DivRight><Input type="password"
                  value={formData.repeatpassword}
                  onChange={e=>{formChange({field:"repeatpassword",value: e.target.value})}}
                /></DivRight>
              </DivCont>
              <DivCont>
                <DivLeft>特权密码</DivLeft>
                <DivRight><Input
                  value={formData.secret}
                  onChange={e=>{formChange({field:"secret",value: e.target.value})}}
                  placeholder="如果没有，可以不输入"
                type="password"/></DivRight>
              </DivCont>
              <DivCont>
                <DivLeft><span style={{color:"#FF6600"}}>* </span> 获取间隔</DivLeft>
                <DivRight>
                  <Select style={{width:"240px"}}
                    value={formData.timegap}
                    onChange={(value)=>{formChange({field:"timegap",value: value})}}
                  >
                    <Option value="默认">默认</Option>
                    <Option value="自定义">自定义</Option>
                  </Select>
                  {
                    formData.timegap === "自定义"?
                    <span><InputNumber
                      defaultValue={0}
                      min={360}
                      value={formData.definetimegap}
                      onChange={(value)=>{formChange({field:"definetimegap",value: value})}}
                    /> min</span>
                    :
                    ""
                  }
                </DivRight>
              </DivCont>
              <DivCont>
                <DivLeft><span style={{color:"#FF6600"}}>* </span> 区域信息</DivLeft>
                <DivRight>
                  <Select placeholder="选择或输入" mode="tags" style={{ width: '100%' }}
                  value={formData.areainfo.length>0? formData.areainfo:[]}
                  onChange={(value)=>{formChange({field:"areainfo",value: value})}}
                  tokenSeparators={[',']}>
                    {
                      groupList && groupList.length>0?
                      groupList.map(item=>{
                        return <Option value={item.name} key={item.name}>{item.name}</Option>
                      })
                      :
                      ''
                    }
                  </Select>
                </DivRight>
              </DivCont>
              <DivCont>
                <DivLeft>备注</DivLeft>
                <DivRight><Input
                  value={formData.desc}
                  onChange={e=>{formChange({field:"desc",value: e.target.value})}}
                /></DivRight>
              </DivCont>
              <DivCont>
                <DivLeft><Button type="primary" onClick={dotest}>测试</Button></DivLeft>
                <DivRight>
                  <Spin spinning={isTesting.spinning}/>
                  {
                    isTesting.result === 1?
                    <span style={{color:"#00cc33"}}>测试成功！</span>
                    :
                    ''
                  }
                 </DivRight>
              </DivCont>
          </div>
        </Modal>
    </div>
  )
}

const mapStateToProps = (state)=>({
  windowH: state.windowH.windowH
})
export default connect(mapStateToProps,null)(SetMonitor)
