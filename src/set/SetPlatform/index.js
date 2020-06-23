/** @jsx jsx */
import { jsx } from '@emotion/core'
import styled from '@emotion/styled'
import React, { useState, useEffect, useRef } from 'react'
import { connect } from 'react-redux'
import _ from 'lodash'
import { Scrollbars } from 'react-custom-scrollbars'
import { Form, Input, Button, Select, Row, Col, message } from 'antd';


import { wyAxiosPost } from '../../components/WyAxios'
import { curTheme } from '../../styles/defineColor'

const StyDiv = styled.div({
  background:curTheme.moduleBg,
  padding:"20px",
  borderRadius: "5px"
})
function SetPlatform(){
  const [ form ] = Form.useForm();
  const [formData,setFormData ] = useState({})
  const [configData,setConfigData] = useState({});
  useEffect(()=>{
    getFormData()
  },[])
  useEffect(()=>{
    setConfigData(formData)
    form.setFieldsValue(formData)
  },[formData])
  function getFormData(){
    wyAxiosPost('config/getlist',{},(result)=>{
      if(result.status === 0){
        message.warning(result.msg)
        return
      }
      const newFormData = _.cloneDeep(result.msg);
      setFormData(newFormData)
    })
  }
  return(
    <div>
      <Form form={form} >
        <Row gutter={16}>
          <Col span={8}>
            <StyDiv>
              <div><h2>IPv4 配置</h2></div>
              <Form.Item
                name="IPADDR"
                label="ip地址"
                rules={[
                  {
                    required: true,
                  },
                ]}
              >
                <Input disabled={true}/>
              </Form.Item>
              <Form.Item
                name="PREFIX"
                label="掩码"
                rules={[
                  {
                    required: true,
                  },
                ]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                name="GATEWAY"
                label="网关"
                rules={[
                  {
                    required: true,
                  },
                ]}
              >
                <Input />
              </Form.Item>
            </StyDiv>
          </Col>
          <Col span={8}>
            <StyDiv>
              <div><h2>DNS 配置</h2></div>
              <Form.Item
                name="DNS1"
                label="DNS1"
                rules={[
                  {
                    required: true,
                  },
                ]}
              >
                <Input />
              </Form.Item>
            </StyDiv>
          </Col>
          <Col span={8}>
            <StyDiv>
              <div><h2>邮件服务 配置</h2></div>
              <Form.Item
                name="ss"
                label="ss"
                rules={[
                  {
                    required: true,
                  },
                ]}
              >
                <Input />
              </Form.Item>
            </StyDiv>
          </Col>

        </Row>
      </Form>
    </div>
  )
}





const mapStateToProps = (state)=>({
  windowH: state.windowH.windowH
})
export default connect(mapStateToProps,null)(SetPlatform)
