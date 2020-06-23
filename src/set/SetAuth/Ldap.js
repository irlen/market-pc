/** @jsx jsx */
import { jsx } from '@emotion/core'
import styled from '@emotion/styled'
import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'
import _ from 'lodash'
import { Scrollbars } from 'react-custom-scrollbars'
import { message, Form, Input, Button, Select, InputNumber } from 'antd'


import { wyAxiosPost } from '../../components/WyAxios'
import { curTheme } from '../../styles/defineColor'

const { Option } = Select
function Ldap(props){
  const [form] = Form.useForm()
  //页面高度
  const [ windowH,setWindowH ]  = useState(0);
  const [ formData,setFormData ] = useState({});
  //做初始化
  useEffect(()=>{
    setWindowH(props.windowH);
    getFormData()
  },[])
  useEffect(()=>{
    form.setFieldsValue(formData)
  },[formData])

  //监控windowH
  useEffect(()=>{
    setWindowH(props.windowH);
  },[props.windowH])
  function getFormData(){
    wyAxiosPost('external/getlist',{},(result)=>{
      if(result.status === 0){
        message.warning(result.msg)
        return
      }
      const newFormData = _.cloneDeep(result.msg)
      console.log(newFormData)
      setFormData(newFormData)
    })
  }
  function onFinish(){

  }
  return (
    <div>
      <Scrollbars
        autoHide
        autoHideTimeout={100}
        autoHideDuration={200}
        universal={true}
        style={{height: windowH===0?0 : windowH-200+'px'}}
      >
        <div style={{padding:"20px"}}>
          <Form  form={form}  >
            <div style={{width:"60%"}}>
              <Form.Item name="server_type" label="Server Type" rules={[{ required: true }]}>
                <Select style={{width:"100%"}}>
                  <Option value="Active Directory">Active Directory</Option>
                </Select>
              </Form.Item>
              <Form.Item name="host" label="LDAP server names or IPs" rules={[{ required: true }]}>
                <Input />
              </Form.Item>
              <Form.Item name="domain_dn" label="Domain DN" rules={[{ required: true }]}>
                <Input />
              </Form.Item>
              <Form.Item name="admin_group_dn" label="Administrators group DN" rules={[{ required: true }]}>
                <Input />
              </Form.Item>
              <Form.Item name="user_group_dn" label="Users group DN" rules={[{ required: true }]}>
                <Input />
              </Form.Item>
              <Form.Item name="port" label="Port" rules={[{ required: true }]}>
                <Input />
              </Form.Item>
              <Form.Item name="bind_dn" label="LDAP Bind DN" rules={[{ required: true }]}>
                <Input />
              </Form.Item>
              <Form.Item name="bind_passwd" label="LDAP Bind password" rules={[{ required: true }]}>
                <Input />
              </Form.Item>
              <div style={{display:"flex"}}>
                <div style={{flex:"0 0 250px"}}>
                  <Form.Item name="time_out" label="Connection time out" rules={[{ required: true }]}>
                    <InputNumber min={1}/>
                  </Form.Item>
                </div>
                <div style={{flex:"1 1 auto",lineHeight:"30px"}}>seconds</div>
              </div>
            </div>
          </Form>
        </div>















      </Scrollbars>
    </div>
  )
}

const mapStateToProps = (state)=>({
  windowH: state.windowH.windowH
})
export default connect(mapStateToProps,null)(Ldap)
