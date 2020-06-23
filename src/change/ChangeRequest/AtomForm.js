/** @jsx jsx */
import { jsx, css } from '@emotion/core'
import styled from '@emotion/styled'
import React, { useState, useEffect } from 'react'
import { Form, Input, Select, Row, Col, Button, Tooltip, TreeSelect } from 'antd'
import _ from 'lodash'

import { wyAxiosPost } from '../../components/WyAxios'
import { singleIp, groupIp, rangeIp, ipMask, singlePort, rangePort, tcp_udp_port } from '../../components/RegExp'
const { TextArea } = Input
const { Option } = Select
const { TreeNode } = TreeSelect
//验证ip5种格式
const isRightIp = (arr)=>{
  let isRight = true
  for(let item of arr){
    if(
      (! singleIp.test(item) ) &&
      (! groupIp.test(item) ) &&
      (! rangeIp(item) ) &&
      (! ipMask.test(item)) &&
      (item !== 'any')
    ){
      isRight = false
      break
    }
  }
  return isRight
}
//验证端口5种格式
const isRightPort = (arr) =>{
  let isRight = true
  for(let item of arr){
    if(
      (! singlePort.test(item) ) &&
      (! rangePort(item) ) &&
      (! tcp_udp_port.test(item)) &&
      (item !== 'any')
    ){
      isRight = false
      break
    }
  }
  return isRight
}

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
function AtomForm(props){
  const [form] = Form.useForm();
  const [device_list, setDevice_list] = useState([]);
  const [data, setData] = useState({});
  const [devices, setDevices] = useState([]);
  const [_isMounted,set_isMounted] = useState(true);

  useEffect(()=>{
    getDevices()
    return ()=>{
      set_isMounted(false);
      setData({})
    }
  },[])

  useEffect(()=>{
    setData(props.data);
  },[props.data])

  useEffect(()=>{
    if(data && data.id){
      form.setFieldsValue(data);
    }
  },[data])

  function getDevices(){
    wyAxiosPost('Firewall/getDeviceName',{},(result)=>{
      const responseData = _.cloneDeep(result.msg.msg)
      const relData = []
      responseData && responseData.length>0 && responseData.map(item=>{
        if(item.children && item.children.length>0){
          const subData = item.children
          subData.map(subItem=>{
            if(subItem.children && subItem.children.length>0){
              const sonData = subItem.children
              sonData.map(sonItem=>{
                const atom = {name: item.name+'-'+subItem.name+'-'+sonItem.name,value: item.value+'-'+subItem.value+'-'+sonItem.value}
                relData.push(atom)
              })
            }else{
              const atom = {name: item.name+'-'+subItem.name,value: item.value+'-'+subItem.value}
              relData.push(atom)
            }
          })
        }else{
          const atom = {name: item.name,value: item.value}
          relData.push(atom)
        }
      })
      if(_isMounted){
        setDevice_list(_.cloneDeep(relData));
      }
    })
  }
  function minuStragidy(id){
    props.removeStragidy(id)
  }
  function handleSubmit(e){
   e.preventDefault();
   form.validateFieldsAndScroll((err, values) => {
     if (!err) {
       console.log('Received values of form: ', values);
     }
   })
 }
  //端口验证器
  function portValidate(rule, value, callback){
    let isFit= true
    if(value && value.length>0){
      isFit = isRightPort(value)
      if(!isFit){
        callback('端口格式有误')
      }
      return
    }else if(value && value.length === 0){
      callback('不能为空')
    }
  }
  function ipValidate(rule,value,callback){
    let isFit= true
    if(value && value.length>0){
      isFit = isRightIp(value)
      if(!isFit){
        callback('ip格式有误')
      }
      return
    }else if(value && value.length === 0){
      callback('必填项')
    }
  }
  function onChange(value){
    if(_isMounted){
      setDevices(value);
    }
  }
  return (
      <div style={{marginBottom:"20px"}}>
        <Form
          form={form}
          onFieldsChange={
            (changedFields, allFields)=>{
              // const id = props.data.id
              // const arr = Object.keys(changedFields)
              // const info = {id,changedFields}
              // if(arr && arr.length === 1){
              //   props.setAtomField(info)
              // }
              const allData = _.cloneDeep(allFields);
              const newData = {}
              newData.errors = []
              newData.id = props.data.id
              if(allData && allData.length>0){
                allData.map(item=>{
                  newData[item.name[0]] = item.value
                  if(item.errors && item.errors.length>0){
                    newData.errors = item.errors
                  }
                })
              }
              props.setAtomField(newData)
            }
          }
        >
          <div style={{display:"flex"}}>
            <div style={{flex:"1 1 auto",borderBottom:"#cccccc dashed 1px"}}>
              <Row gutter={16}>
                <Col sm={12} md={12} >
                  <StyleDiv>
                    <StyleLeft>
                      <span style={{color:"#f5222d",paddingRight:"5px"}}>*</span>设备
                    </StyleLeft>
                    <StyleRight>
                      <Tooltip placement="topLeft" title={
                        <div style={{fontSize:"12px"}}>
                          <div>设备-接口-流向</div>
                        </div>
                      }>
                        <Form.Item
                          label=""
                          name="device"
                          rules={[
                            {
                              required: true,
                              message: '设备不能为空',
                            },
                          ]}
                        >
                          <Select
                            mode="multiple"
                            allowClear={true}
                            showSearch
                            maxTagCount={1}
                            filterOption={(input, option) =>
                              option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                            }
                            maxTagPlaceholder={(value)=>('共'+(value.length+1)+'项')}
                          >
                            {
                              device_list && device_list.length>0?
                              device_list.map(item=>{
                                return (
                                  <Option key={item.value} value={item.value}>{item.name}</Option>
                                )
                              })
                              :
                              ''
                            }
                          </Select>
                        </Form.Item>
                      </Tooltip>
                    </StyleRight>
                  </StyleDiv>
                </Col>
                <Col sm={12} md={12} >
                  <StyleDiv>
                    <StyleLeft>
                      <span style={{color:"#f5222d",paddingRight:"5px"}}>*</span>源地址
                    </StyleLeft>
                    <StyleRight>
                      <Tooltip placement="topLeft" title={
                        <div style={{fontSize:"12px"}}>
                          <div>以下格式均可：</div>
                          <div>1. 单ip(12.12.12.1)</div>
                          <div>2. ip组(12.12.12.0/24)</div>
                          <div>3. ip范围(12.12.12.1-12.12.12.99)</div>
                          <div>4. ip/掩码(12.12.12.0/255.255.255.0)</div>
                          <div>5. any(代表所有，填此项时，其他项将无效)</div>
                        </div>
                      }>
                        <Form.Item
                          label=""
                          name="source_address"
                          getValueFromEvent={(value)=>{
                            let relValue = value
                            if(value && value.length>1){
                              if(value.indexOf('any') !== -1){
                                relValue = ['any']
                              }
                            }
                            return relValue
                          }}
                          rules= {
                            [
                              {
                                validator: ipValidate,
                              }
                              ,{
                                required: true,
                                message: '源地址不能为空',
                              }
                            ]
                          }
                        >
                          <Select
                            mode="tags" allowClear={true}
                            maxTagCount={1}
                            maxTagPlaceholder={(value)=>('共'+(value.length+1)+'项')}
                          >
                          </Select>
                        </Form.Item>
                      </Tooltip>
                    </StyleRight>
                  </StyleDiv>
                </Col>
                <Col sm={12} md={12} >
                  <StyleDiv>
                    <StyleLeft>
                      <span style={{color:"#f5222d",paddingRight:"5px"}}>*</span>目的地址
                    </StyleLeft>
                    <StyleRight>
                    <Tooltip placement="topLeft" title={
                      <div style={{fontSize:"12px"}}>
                        <div>以下格式均可：</div>
                        <div>1. 单ip(12.12.12.1)</div>
                        <div>2. ip组(12.12.12.0/24)</div>
                        <div>3. ip范围(12.12.12.1-12.12.12.99)</div>
                        <div>4. ip/掩码(12.12.12.0/255.255.255.0)</div>
                        <div>5. any(代表所有，填此项时，其他项将无效)</div>
                      </div>
                    }>
                      <Form.Item
                        label=""
                        name="des_address"
                        getValueFromEvent={
                          (value)=>{
                            let relValue = value
                            if(value && value.length>1){
                              if(value.indexOf('any') !== -1){
                                relValue = ['any']
                              }
                            }
                            return relValue
                          }
                        }
                        rules={
                          [
                            {
                              required: true,
                              message: '目的地址不能为空',
                            },
                          {
                              validator: ipValidate
                            }
                          ]
                        }
                      >
                        <Select
                          mode="tags"
                          allowClear={true}
                          maxTagCount={1}
                          maxTagPlaceholder={(value)=>('共'+(value.length+1)+'项')}
                        >
                        </Select>
                      </Form.Item>
                      </Tooltip>
                    </StyleRight>
                  </StyleDiv>
                </Col>
                <Col sm={12} md={12} >
                  <StyleDiv>
                    <StyleLeft>
                      <span style={{color:"#f5222d",paddingRight:"5px"}}>*</span>端口
                    </StyleLeft>
                    <StyleRight>
                      <Tooltip placement="topLeft" title={
                        <div style={{fontSize:"12px"}}>
                          <div>以下格式均可：</div>
                          <div>1. 端口(22)</div>
                          <div>2. tcp端口(tcp 22)</div>
                          <div>3. udp端口(udp 22)</div>
                          <div>4. 端口范围(22-222)</div>
                          <div>5. any(代表所有，填此项时，其他项将无效)</div>
                        </div>
                      }>
                        <Form.Item
                          label=""
                          name="port"
                          getValueFromEvent={
                            (value)=>{
                              let relValue = value
                              if(value && value.length>1){
                                if(value.indexOf('any') !== -1){
                                  relValue = ['any']
                                }
                              }
                              return relValue
                            }
                          }
                          rules={
                            [
                              {
                                required: true,
                                message: '端口不能为空',
                              },
                              {
                                  validator: portValidate
                              }
                            ]
                          }
                        >
                          <Select
                            mode="tags"
                            allowClear={true}
                            maxTagCount={1}
                            maxTagPlaceholder={(value)=>('共'+(value.length+1)+'项')}
                          >

                          </Select>
                        </Form.Item>
                      </Tooltip>
                    </StyleRight>
                  </StyleDiv>
                </Col>
                <Col sm={12} md={12} >
                  <StyleDiv>
                    <StyleLeft>
                      <span style={{color:"#f5222d",paddingRight:"5px"}}>*</span>动作
                    </StyleLeft>
                    <StyleRight>
                      <Form.Item
                        label=""
                        name="behavior"
                        rules={
                          [
                            {
                              required: true,
                              message: '动作为必选项',
                            },
                          ]
                        }
                      >
                        <Select allowClear={true}>
                          <Option value='permit'>允许</Option>
                          <Option value='deny'>拒绝</Option>
                        </Select>
                      </Form.Item>
                    </StyleRight>
                  </StyleDiv>
                </Col>
                <Col sm={12} md={12} >
                  <StyleDiv>
                    <StyleLeft>
                      备注
                    </StyleLeft>
                    <StyleRight>
                      <Form.Item
                        label=""
                        name="atom_note"
                        rule={
                          [
                            {
                              required: true,
                              message: '',
                            },
                          ]
                        }
                      >
                        <TextArea rows={1} />
                      </Form.Item>
                    </StyleRight>
                  </StyleDiv>
                </Col>
              </Row>
            </div>
            <div style={{flex:"0 0 120px",borderRight: "#cccccc dashed 1px",textAlign:"center"}}>
              <Button style={{display:"inline-block",marginTop:"calc(100% - 52px)"}} onClick={()=>minuStragidy(props.data.id)}>
                <span><i className="fa fa-minus" aria-hidden="true"></i></span>
                <span style={{marginLeft:"10px"}}>删除</span>
              </Button>
            </div>
          </div>
        </Form>
      </div>
    )
}

export default AtomForm
