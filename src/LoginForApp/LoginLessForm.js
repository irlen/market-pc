/** @jsx jsx */
import styled from '@emotion/styled'
import { jsx, css } from '@emotion/core'
import React from 'react'
import { Form, Icon, Input, Button, Checkbox ,message, Select, Tooltip } from 'antd'
import $ from 'jquery'
import _ from 'lodash'

import { wyAxiosPost } from '../components/WyAxios'
const FormItem = Form.Item
const { Option } = Select
const AfterSpan = styled.span({
  cursor:"pointer",color:"#01bd4c",
  "&:hover":{
    fontWeight:"bold"
  },
  "&:active":{
    fontWeight:"normal"
  }
})
class NormalLoginForm extends React.Component {
  state = {
    confirmDirty: false,
    isPhoneNumRight: false,
    time: 60,
    isCount: false,
    sentId:''
  }
  //发送验证码
  sentVerticicationCode = ()=>{
    const phone_number = this.props.form.getFieldValue('phone_number')
    wyAxiosPost('User/getCode',{phone_number},(result)=>{
      const responseData = result.data
      const status = responseData.status
      if(status === 1){
        const sentId = responseData.msg.res
        if(status && this._isMounted){
          this.setState({
            isCount: true,
            sentId
          },()=>{this.timeCount(61)})
        }
      }else{
        const msg = responseData.msg
        message.info(msg)
      }
    })
  }
  //注册表单提交事件
  handleSubmit = (e) => {
     e.preventDefault();
     //查看是否全部填写
     const valueList = this.props.form.getFieldsValue()
     const { phone_number, vertification_code } = valueList
     const isAllFill = !!phone_number &&  !!vertification_code
     //获取错误
     const errs = this.props.form.getFieldsError()
     const hasErr = _.findKey(errs,(o)=>{return !!o})
     if(!isAllFill || hasErr ){
       message.warning('请确保信息完整且格式正确再提交')
       return
     }
     this.props.form.validateFields((err, values) => {
      if (!err) {
        values.sentId = this.state.sentId
        this.props.phoneLogin(values)
      }else{
        message.warning('请确保信息完整且格式正确再提交')
      }
     });
  }
  verticatePhoneNumber = (rule, value, callback)=>{
    const { form } = this.props;
    const reg =/^1(3|4|5|6|7|8|9)\d{9}$/
    const phone_number = form.getFieldValue('phone_number').trim()
    if(this._isMounted){
      if(phone_number && !(reg.test(phone_number))){
        this.setState({
          isPhoneNumRight: false
        })
        callback('手机号码尚不正确!');
      }else if(!phone_number){
        this.setState({
          isPhoneNumRight: false
        })
      }else{
        this.setState({
          isPhoneNumRight: true
        })
        callback();
      }
    }
  }
  timeCount = (count)=>{
    const nextCount = count -1
    if(this.t){
      clearTimeout(this.t)
    }
    this.t=setTimeout(()=>{
      this.setState({
        time: nextCount
      })
      if(nextCount === 0){
        if(this.t){
          clearTimeout(this.t)
        }
        this.setState({
          isCount: false,
          time: 60
        })
        return
      }
      this.timeCount(nextCount)
    },1000)
  }
  componentDidMount(){
    this._isMounted = true
    this.inputRef.input.autofocus = true
  }
  componentWillUnmount(){
    this._isMounted = false
  }
  render() {
    const { getFieldDecorator } = this.props.form;
    const prefixSelector = getFieldDecorator('prefix', {
      initialValue: '86',
    })(
      <Select style={{ width: 70 }}>
        <Option value="86">+86</Option>
        <Option value="87">+87</Option>
      </Select>
    )
    const getContent = ()=>{
      const { isPhoneNumRight,isCount } = this.state
      let dom = ''
      if(isCount){
        dom = <span style={{color:"#01bd4c",padding:"0 20px 0 20px"}}>{`${this.state.time} s`}</span>
      }else{
        if(isPhoneNumRight){
          dom = <AfterSpan onClick={this.sentVerticicationCode} style={{cursor:"pointer",color:"#01bd4c"}}>获取验证码</AfterSpan>
        }else{
          dom = <span style={{color:"#cccccc"}}>获取验证码</span>
        }
      }
      return dom
    }
    const afterButton = getFieldDecorator('prefix', {
    })(
      getContent()
    )
    return (
      <Form onSubmit={this.handleSubmit} className="login-form" style={{width:"400px"}}>
        <FormItem>
          {getFieldDecorator('phone_number', {
            rules: [
              { required: true, message: '请输入手机号!' },
              {validator: this.verticatePhoneNumber}
            ],
          })(
            <Input addonBefore={prefixSelector} style={{ width: '100%' }} ref={(input) => { this.inputRef = input }} prefix={<Icon type="mobile" style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="手机号码" />
          )}
        </FormItem>
        <FormItem>
          {getFieldDecorator('vertification_code', {
            rules: [{ required: true, message: '请输入验证码!' }],
          })(
            <Input addonAfter={afterButton} style={{ width: '100%' }} ref={(input) => { this.inputRef = input }}  placeholder="验证码" />
          )}
        </FormItem>
        <FormItem>
          <Button type="primary" htmlType="submit" className="login-form-button" style={{color:"#ffffff",width:"100%",letterSpacing:"10px"}}>
            登   录
          </Button>
        </FormItem>
      </Form>
    );
  }
}
const LoginLessForm = Form.create()(NormalLoginForm)
export default LoginLessForm
