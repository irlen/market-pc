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
function Radius(props){
  const [form] = Form.useForm()
  //页面高度
  const [ windowH,setWindowH ]  = useState(0);
  //做初始化
  useEffect(()=>{
    setWindowH(props.windowH);
  },[])

  //监控windowH
  useEffect(()=>{
    setWindowH(props.windowH);
  },[props.windowH])
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
          <Form  form={form} onFinish={onFinish}>
            <div style={{width:"60%"}}>
              <Form.Item name="server" label="Server" rules={[{ required: true }]}>
                <Input />
              </Form.Item>
              <Form.Item name="security" label="Security" rules={[{ required: true }]}>
                <Input />
              </Form.Item>
              <Form.Item name="nas_identifier" label="NAS identifier" rules={[{ required: true }]}>
                <Input />
              </Form.Item>
              <Form.Item name="protocol" label="Protocol" rules={[{ required: true }]}>
                <Input />
              </Form.Item>
              <Form.Item name="port" label="Port" rules={[{ required: true }]}>
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
export default connect(mapStateToProps,null)(Radius)
