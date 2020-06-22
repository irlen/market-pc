/** @jsx jsx */
import { jsx, css } from '@emotion/core'
import styled from '@emotion/styled'
import React, { Component } from 'react'
import { Form, Input, Select, Row, Col, Button, Tooltip, TreeSelect } from 'antd'
import _ from 'lodash'

import { wyAxiosPost } from '../components/WyAxios'
import { singleIp, groupIp, rangeIp, ipMask, singlePort, rangePort, tcp_udp_port } from '../components/RegExp'
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
class AtomForm extends Component {
  state = {
    device_list:[],
    data:{},
    devices: []
  }
  componentDidMount(){
    this._isMounted = true
    this.getDevices()
    const {data,form} = this.props
    if(data && data.id){
      this.setState({
        data
      },()=>{
        //setFieldsValue
        form.resetFields(data)
      })
    }
  }

  componentWillReceiveProps(nextProps){
    if(! _.isEqual(this.props.data,nextProps.data)){
      const  data  = _.cloneDeep(nextProps.data)
      const { form } = this.props
      if(this._isMounted && data && data.id){
        this.setState({
          data
        },()=>{
          if(nextProps.id){
            form.resetFields(data)
          }
        }
      )
      }
    }
  }

  getDevices = ()=>{
    wyAxiosPost('Firewall/getDeviceName',{},(result)=>{
      const responseData = _.cloneDeep(result.data.msg.msg)
      const relData = []
      responseData.map(item=>{
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
      if(this._isMounted){
        this.setState({
          device_list: _.cloneDeep(relData)
        })
      }
    })
  }
  minuStragidy = (id)=>{
    this.props.removeStragidy(id)
  }
  handleSubmit = e => {
   e.preventDefault();
   this.props.form.validateFieldsAndScroll((err, values) => {
     if (!err) {
       console.log('Received values of form: ', values);
     }
   })
 }
 //端口验证器
 portValidate = (rule, value, callback) => {
    const { form } = this.props
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
  ipValidate = (rule,value,callback)=>{
    const { form } = this.props
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
  onChange=(value)=>{
    if(this._isMounted){
      this.setState({
       devices: value
      })
    }
  }
  componentWillUnmount(){
    this._isMounted = false
  }
  render(){
    const { getFieldDecorator } = this.props.form
    const { device_list, data, devices } = this.state
    return (
      <div style={{marginBottom:"20px"}}>
        <Form>
          <div style={{display:"flex"}}>
            <div style={{flex:"1 1 auto",borderBottom:"#cccccc dashed 1px"}}>
              <Row gutter={16}>
                <Col sm={12} md={12} >
                  <StyleDiv>
                    <StyleLeft>
                      <span style={{color:"#f5222d",paddingRight:"5px"}}>*</span>设备
                    </StyleLeft>
                    <StyleRight>
                      <Form.Item label="">
                        <Tooltip placement="topLeft" title={
                          <div style={{fontSize:"12px"}}>
                            <div>设备-接口-流向</div>
                          </div>
                        }>
                          {
                            getFieldDecorator('device', {
                            initialValue: data.device,
                            rules: [
                              {
                                required: true,
                                message: '设备不能为空',
                              },
                            ],
                          })(
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
                          )}
                        </Tooltip>
                      </Form.Item>
                    </StyleRight>
                  </StyleDiv>
                </Col>
                <Col sm={12} md={12} >
                  <StyleDiv>
                    <StyleLeft>
                      <span style={{color:"#f5222d",paddingRight:"5px"}}>*</span>源地址
                    </StyleLeft>
                    <StyleRight>
                      <Form.Item label="">
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
                        {
                          getFieldDecorator('source_address', {
                          initialValue: data.source_address,
                          getValueFromEvent:(value)=>{
                            let relValue = value
                            if(value && value.length>1){
                              if(value.indexOf('any') !== -1){
                                relValue = ['any']
                              }
                            }
                            return relValue
                          },
                          rules: [
                            {
                              validator: this.ipValidate,
                            }
                            // ,{
                            //   required: true,
                            //   message: '源地址不能为空',
                            // },
                          ],
                        })(

                          <Select
                            mode="tags" allowClear={true}
                            maxTagCount={1}
                            maxTagPlaceholder={(value)=>('共'+(value.length+1)+'项')}
                          >
                          </Select>
                        )
                      }
                      </Tooltip>
                      </Form.Item>

                    </StyleRight>
                  </StyleDiv>
                </Col>
                <Col sm={12} md={12} >
                  <StyleDiv>
                    <StyleLeft>
                      <span style={{color:"#f5222d",paddingRight:"5px"}}>*</span>目的地址
                    </StyleLeft>
                    <StyleRight>
                      <Form.Item label="">
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
                          {
                            getFieldDecorator('des_address', {
                            initialValue: data.des_address,
                            getValueFromEvent:(value)=>{
                              let relValue = value
                              if(value && value.length>1){
                                if(value.indexOf('any') !== -1){
                                  relValue = ['any']
                                }
                              }
                              return relValue
                            },
                            rules: [
                              {
                                required: true,
                                message: '目的地址不能为空',
                              },
                            {
                                validator: this.ipValidate
                              }
                            ],
                          })(
                            <Select
                              mode="tags"
                              allowClear={true}
                              maxTagCount={1}
                              maxTagPlaceholder={(value)=>('共'+(value.length+1)+'项')}
                            >
                            </Select>
                          )
                        }
                        </Tooltip>
                      </Form.Item>
                    </StyleRight>
                  </StyleDiv>
                </Col>
                <Col sm={12} md={12} >
                  <StyleDiv>
                    <StyleLeft>
                      <span style={{color:"#f5222d",paddingRight:"5px"}}>*</span>端口
                    </StyleLeft>
                    <StyleRight>
                      <Form.Item label="">
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
                          {
                            getFieldDecorator('port', {
                            initialValue: data.port,
                            getValueFromEvent:(value)=>{
                              let relValue = value
                              if(value && value.length>1){
                                if(value.indexOf('any') !== -1){
                                  relValue = ['any']
                                }
                              }
                              return relValue
                            },
                            rules: [
                              // {
                              //   required: true,
                              //   message: '端口不能为空',
                              // },
                              {
                                  validator: this.portValidate
                              }
                            ],
                          })(
                            <Select
                              mode="tags"
                              allowClear={true}
                              maxTagCount={1}
                              maxTagPlaceholder={(value)=>('共'+(value.length+1)+'项')}
                            >

                            </Select>
                          )
                        }
                        </Tooltip>
                      </Form.Item>
                    </StyleRight>
                  </StyleDiv>
                </Col>
                <Col sm={12} md={12} >
                  <StyleDiv>
                    <StyleLeft>
                      <span style={{color:"#f5222d",paddingRight:"5px"}}>*</span>动作
                    </StyleLeft>
                    <StyleRight>
                      <Form.Item label="">
                        {getFieldDecorator('behavior', {
                          initialValue: data.behavior,
                          rules: [
                            {
                              required: true,
                              message: '动作为必选项',
                            },
                          ],
                        })(
                          <Select allowClear={true}>
                            <Option value='permit'>允许</Option>
                            <Option value='deny'>拒绝</Option>
                          </Select>
                        )}
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
                      <Form.Item label="">
                        {getFieldDecorator('atom_note', {
                          initialValue: data.atom_note,
                          rules: [
                            {
                              required: true,
                              message: '',
                            },
                          ],
                        })(<TextArea
                            rows={1}
                          />)}
                      </Form.Item>
                    </StyleRight>
                  </StyleDiv>
                </Col>
              </Row>
            </div>
            <div style={{flex:"0 0 120px",borderRight: "#cccccc dashed 1px",textAlign:"center"}}>
              <Button style={{display:"inline-block",marginTop:"calc(100% - 52px)"}} onClick={()=>this.minuStragidy(this.props.data.id)}>
                <span><i className="fa fa-minus" aria-hidden="true"></i></span>
                <span style={{marginLeft:"10px"}}>删除</span>
              </Button>
            </div>
          </div>
        </Form>
      </div>
    )
  }
}

const WrappedRegistrationForm = Form.create({
  onFieldsChange: (props, changedFields, allFields)=>{
    const id = props.data.id
    const arr = Object.keys(changedFields)
    const info = {id,changedFields}
    if(arr && arr.length === 1){
      props.setAtomField(info)
    }
  }
})(AtomForm)
export default WrappedRegistrationForm
