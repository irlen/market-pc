/** @jsx jsx */
import { jsx, css } from '@emotion/core'
import styled from '@emotion/styled'
import React, { useState, useEffect } from 'react'
import { Form, Input, Select, Row, Col, Button, Tooltip, TreeSelect  } from 'antd'
import _ from 'lodash'

import { wyAxiosPost } from '../../components/WyAxios'
import { singleIp, groupIp, rangeIp, singlePort, not_all_count } from '../../components/RegExp'
const { TextArea } = Input
const { Option } = Select
const { TreeNode } = TreeSelect
const StyleDiv = styled.div({
  display:"flex",
  lineHeight:"40px"
})
const StyleLeft = styled.div({
  flex: "0 0 120px",
  textAlign: "right",
  paddingRight:"10px"
})
const StyleRight = styled.div({
  flex:"1 1 auto",
  verticalAlign:"middle"
})
function StepTwo(props){
  const [form] = Form.useForm();

  const [data, setData] = useState({})
  const [id,setId] = useState("")
  const [_isMounted,set_isMounted] = useState(true)

  useEffect(()=>{
    const {data,id} = props
    if(data && Object.keys(data).length>0){
      setData(data);
    }
    setId(id)
    return ()=>{
      set_isMounted(false)
    }
  },[])

  useEffect(()=>{
    setData(props.data)
    setId(props.id)
  },[props.data,props.id])
  useEffect(()=>{
    if(data && Object.keys(data).length>0){
      let formData = {}
      if(data.cmd && data.cmd.add_acl && data.cmd.add_acl === 1){
        formData[`acl_name-${id}`] = data.cmd.acl_name;
      }

      if(data.cmd && data.cmd.add && data.cmd.add.length>0){
        const add = _.cloneDeep(data.cmd.add)
        add.map((item,index)=>{
          if(item.group.dest.no_change === 0){
            formData[`cmd-add-${index}-group-dest-name`] = item.group.dest.name
          }
          if(item.group.port.no_change === 0){
            formData[`cmd-add-${index}-group-port-name`] = item.group.port.name
          }
          if(item.group.source.no_change === 0){
            formData[`cmd-add-${index}-group-source-name`] = item.group.source.name
          }
        })
      }
      form.setFieldsValue(formData)
    }
  },[data,id])

 //端口验证器
 function portValidate(rule, value, callback){
    const trimValue = value.trim()
    if (trimValue && singlePort.test(trimValue)) {
      callback()
    }else if(trimValue && !singlePort.test(trimValue)){
      callback('端口格式存在错误！')
    }
  }
  function ipValidate(rule,value,callback){
    let isFit= true
    if(value && value.length>0){
      for(let item of value){
        if( (!singleIp.test(item)) && (!groupIp.test(item))){
          isFit = true
          break
        }else{
          isFit = true
        }
      }
      if(!isFit){
        callback('ip格式有误')
      }
      return
    }
  }

  const doWrap = (str)=>{
    const newStr=str.replace(/\n/g,"<br/>")
    return newStr
  }
  return (
    <div style={{marginBottom:"20px"}}>
      <Form
        onFieldsChange={
          (changedFields, allFields)=>{
            if(changedFields && changedFields[0] && changedFields[0]['name']){
              const info = {id,data:changedFields[0]}
              props.setStepTwo(info)
            }
          }
        }
        form={form}
      >
        <div style={{display:"flex"}}>
          <div style={{flex:"1 1 auto",borderBottom:"#cccccc dashed 1px"}}>
            {
              data && data.name && parseInt(data.status) ===1?
              <Row gutter={16}>
                <Col span={24} >
                  <StyleDiv>
                    <StyleLeft>
                      设备名：
                    </StyleLeft>
                    <StyleRight>
                      {data.name}
                    </StyleRight>
                  </StyleDiv>
                </Col>
                <Col span={24} >
                  <StyleDiv>
                    <StyleLeft>
                      接口：
                    </StyleLeft>
                    <StyleRight>
                      {data.ifname}
                    </StyleRight>
                  </StyleDiv>
                </Col>
                <Col span={24} >
                  <StyleDiv>
                    <StyleLeft>
                      流向：
                    </StyleLeft>
                    <StyleRight>
                      {data.inout}
                    </StyleRight>
                  </StyleDiv>
                </Col>
                {
                  parseInt(data.status) === 1 && parseInt(data.cmd.add_acl) === 1?
                  <Col span={24}>
                    <StyleDiv>
                      <StyleLeft>
                        新增ACL：
                      </StyleLeft>
                      <StyleRight>
                        <Form.Item
                          label=""
                          name={`acl_name-${id}`}
                          rules={
                            [
                              {
                                required: true,
                                message: '此项不能为空',
                              },{
                                pattern: new RegExp(not_all_count),
                                message: '格式不符合要求'
                              }
                            ]
                          }
                        >
                          <Input />
                        </Form.Item>
                      </StyleRight>
                    </StyleDiv>
                  </Col>
                  :
                  <Col span={24}>
                    ACL：{data.cmd.acl_name?data.cmd.acl_name:''}
                  </Col>
                }
                <Col span={24} style={{fontWeight:"bold"}}>
                  <StyleDiv>
                    <StyleLeft>
                      新增：
                    </StyleLeft>
                    <StyleRight>
                      {data.cmd.add?data.cmd.add.length:0}条记录
                    </StyleRight>
                  </StyleDiv>
                </Col>
                <Col span={24}>
                  <div style={{display:"flex",textAlign:"center",lineHeight:"40px"}}>
                    <div style={{flex:"0 0 120px"}}></div>
                    <div style={{flex:"0 0 40px"}}>序号</div>
                    <div style={{flex:"1 1 auto",padding:"0 10px 0 10px"}}>源</div>
                    <div style={{flex:"1 1 auto",padding:"0 10px 0 10px"}}>目的</div>
                    <div style={{flex:"1 1 auto",padding:"0 10px 0 10px"}}>端口</div>
                  </div>
                </Col>
                {
                  data.cmd.add && data.cmd.add.length>0?
                  data.cmd.add.map((item,index)=>{
                    return (
                      <Col span={24} key={index}>
                        <div style={{display:"flex",textAlign:"center",lineHeight:"40px"}}>
                          <div style={{flex:"0 0 120px"}}></div>
                          <div style={{flex:"0 0 40px"}}>{index+1}</div>
                          <div style={{flex:"1 1 auto",padding:"0 10px 0 10px"}}>
                            {
                              !item.group.source.no_change?
                                <Tooltip title={<div dangerouslySetInnerHTML={{__html:doWrap(_.cloneDeep(item.group.source.body))}}></div>} placement="topLeft">
                                    <Form.Item
                                      label=""
                                      name={`cmd-add-${index}-group-source-name`}
                                      rules={
                                        [
                                          {
                                            required: true,
                                            message: '此项不能为空',
                                          },{
                                            pattern: new RegExp(not_all_count),
                                            message: '格式不符合要求'
                                          }
                                        ]
                                      }
                                    >
                                      <Input />
                                    </Form.Item>
                                  </Tooltip>
                                :
                                <Tooltip title={<div dangerouslySetInnerHTML={{__html:doWrap(_.cloneDeep(item.group.source.body))}}></div>} placement="topLeft">
                                  <span>{item.group.source.name?item.group.source.name:item.group.source.body}</span>
                                </Tooltip>
                            }
                          </div>
                          <div style={{flex:"1 1 auto",padding:"0 10px 0 10px"}}>
                            {
                            !item.group.dest.no_change?
                              <Tooltip title={<div dangerouslySetInnerHTML={{__html:doWrap(_.cloneDeep(item.group.dest.body))}}></div>} placement="topLeft">
                                <Form.Item
                                  label=""
                                  name={`cmd-add-${index}-group-dest-name`}
                                  rules={
                                    [
                                      {
                                        required: true,
                                        message: '此项不能为空'
                                      },{
                                        pattern: new RegExp(not_all_count),
                                        message: '格式不符合要求'
                                      }
                                    ]
                                  }
                                >
                                  <Input />
                                </Form.Item>
                              </Tooltip>
                            :
                            <Tooltip title={<div dangerouslySetInnerHTML={{__html:doWrap(_.cloneDeep(item.group.dest.body))}}></div>} placement="topLeft">
                              <span>{item.group.dest.name?item.group.dest.name:item.group.dest.body}</span>
                            </Tooltip>
                          }
                          </div>
                          <div style={{flex:"1 1 auto",padding:"0 10px 0 10px"}}>
                            {
                            !item.group.port.no_change?
                              <Tooltip title={<div dangerouslySetInnerHTML={{__html:doWrap(_.cloneDeep(item.group.port.body))}}></div>} placement="topLeft">
                                <Form.Item
                                  label=""
                                  name={`cmd-add-${index}-group-port-name`}
                                  initialvalue={item.group.port.body}
                                  shouldUpdate={(prevValue, curValue)=>{return prevValue !== curValue}}
                                  rules={
                                    [
                                      {
                                        required: true,
                                        message: '此项不能为空',
                                      },{
                                        pattern: new RegExp(not_all_count),
                                        message: '格式不符合要求'
                                      }
                                    ]
                                  }

                                >
                                  <Input placeholder="测试"/>
                                </Form.Item>
                              </Tooltip>
                            :
                            <Tooltip title={<div dangerouslySetInnerHTML={{__html:doWrap(_.cloneDeep(item.group.port.name))}}></div>} placement="topLeft">
                              <span>{item.group.port.name?item.group.port.name:item.group.port.body}</span>
                            </Tooltip>
                          }
                          </div>
                        </div>
                      </Col>
                    )
                  })
                  :
                  ''
                }
                <Col span={24} style={{fontWeight:"bold"}}>
                  <StyleDiv>
                    <StyleLeft>
                      变更：
                    </StyleLeft>
                    <StyleRight>
                      {data.cmd.change ?data.cmd.change.length:0}条记录
                    </StyleRight>
                  </StyleDiv>
                </Col>
                <Col span={24}>
                  <div style={{display:"flex",textAlign:"center",lineHeight:"40px"}}>
                    <div style={{flex:"0 0 120px"}}></div>
                    <div style={{flex:"0 0 40px"}}>序号</div>
                    <div style={{flex:"1 1 auto",padding:"0 10px 0 10px"}}>源</div>
                    <div style={{flex:"1 1 auto",padding:"0 10px 0 10px"}}>目的</div>
                    <div style={{flex:"1 1 auto",padding:"0 10px 0 10px"}}>端口</div>
                  </div>
                </Col>
                {
                  data.cmd.change && data.cmd.change.length>0?
                  data.cmd.change.map((item,index)=>{
                    return (
                      <Col span={24}>
                        <div style={{display:"flex",textAlign:"center",lineHeight:"40px"}}>
                          <div style={{flex:"0 0 120px"}}></div>
                          <div style={{flex:"0 0 40px"}}>{index+1}</div>
                          <div style={{flex:"1 1 auto",padding:"0 10px 0 10px"}}>
                            {
                              !item.group.source.no_change?
                                <Tooltip title={<div dangerouslySetInnerHTML={{__html:doWrap(_.cloneDeep(item.group.source.body))}}></div>} placement="topLeft">
                                  <Form.Item
                                    label=""
                                    name={`cmd-change-${index}-group-source-name`}
                                    rules={
                                      [
                                        {
                                          required: true,
                                          message: '此项不能为空',
                                        },{
                                          pattern: new RegExp(not_all_count),
                                          message: '格式不符合要求'
                                        }
                                      ]
                                    }
                                  >
                                    <Input />
                                  </Form.Item>
                                </Tooltip>
                                :
                                <Tooltip title={<div dangerouslySetInnerHTML={{__html:doWrap(_.cloneDeep(item.group.source.body))}}></div>} placement="topLeft">
                                  <span>{item.group.source.name?item.group.source.name:item.group.source.body}</span>
                                </Tooltip>
                            }
                          </div>
                          <div style={{flex:"1 1 auto",padding:"0 10px 0 10px"}}>
                            {
                            !item.group.dest.no_change?
                              <Tooltip title={<div dangerouslySetInnerHTML={{__html:doWrap(_.cloneDeep(item.group.dest.body))}}></div>} placement="topLeft">
                                <Form.Item
                                  label=""
                                  name={`cmd-change-${index}-group-dest-name`}
                                  rules={
                                    [
                                      {
                                        required: true,
                                        message: '此项不能为空',
                                      },{
                                        pattern: new RegExp(not_all_count),
                                        message: '格式不符合要求'
                                      }
                                    ]
                                  }
                                >
                                  <Input />
                                </Form.Item>
                              </Tooltip>
                            :
                            <Tooltip title={<div dangerouslySetInnerHTML={{__html:doWrap(_.cloneDeep(item.group.dest.body))}}></div>} placement="topLeft">
                              <span>{item.group.dest.name?item.group.dest.name:item.group.dest.body}</span>
                            </Tooltip>
                          }
                          </div>
                          <div style={{flex:"1 1 auto",padding:"0 10px 0 10px"}}>
                            {
                            !item.group.port.no_change?
                              <Tooltip title={<div dangerouslySetInnerHTML={{__html:doWrap(_.cloneDeep(item.group.port.body))}}></div>} placement="topLeft">
                                <Form.Item
                                  label=""
                                  name={`cmd-change-${index}-group-port-name`}
                                  rules={
                                    [
                                      {
                                        required: true,
                                        message: '此项不能为空',
                                      },{
                                        pattern: new RegExp(not_all_count),
                                        message: '格式不符合要求'
                                      }
                                    ]
                                  }
                                 >
                                  <Input />
                                </Form.Item>
                              </Tooltip>
                            :
                            <Tooltip title={<div dangerouslySetInnerHTML={{__html:doWrap(_.cloneDeep(item.group.port.body))}}></div>} placement="topLeft">
                              <span>{item.group.port.name?item.group.port.name:item.group.port.body}</span>
                            </Tooltip>
                          }
                          </div>
                        </div>
                      </Col>
                    )
                  })
                  :
                  ''
                }
              </Row>
              :

              data.status === 0?
              <div>{data.msg}</div>
              :
              ''
            }
          </div>
        </div>
      </Form>
    </div>
  )
}

export default StepTwo
