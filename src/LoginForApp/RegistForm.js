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
    wyAxiosPost('User/getUserCode',{phone_number},(result)=>{
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
     const { username, email, phone_number, password, repeat_password, vertification_code } = valueList
     const isAllFill = !!username && !!email && !!phone_number && !!password && !!repeat_password && !!vertification_code
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
        this.props.registSubmit(values)
      }else{
        message.warning('请确保信息完整且格式正确再提交')
      }
     });
  }
  handleConfirmBlur = e => {
    const { value } = e.target;
    if(this._isMounted){
      this.setState({ confirmDirty: this.state.confirmDirty || !!value });
    }

  };
  compareToFirstPassword = (rule, value, callback) => {
    const { form } = this.props;
    if (value && value !== form.getFieldValue('password')) {
      callback('两次密码尚不一致!');
    } else {
      callback();
    }
  };
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
  verticateName = (rule, value, callback) => {
    const { form } = this.props
    //const reg = /^(?!_)(?!.*?_$)[a-zA-Z0-9_\u4e00-\u9fa5]+$/
    const reg2 = /^\d+$/
    const reg = /^(?!_)(?!.*?_$)[a-zA-Z0-9_\u4e00-\u9fa5]{2,16}$/
    const username = form.getFieldValue('username').trim()
    if (username && (!(reg.test(username))|| reg2.test(username))) {
      callback('用户名格式尚不符合要求!');
    } else {
      callback();
    }
  };
  validateToNextPassword = (rule, value, callback) => {
    const { form } = this.props;
    if (value && this.state.confirmDirty) {
      form.validateFields(['repeat_password'], { force: true });
    }
    callback();
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
          <Tooltip placement="topLeft" title="非纯数字，2-16位">
            {getFieldDecorator('username', {
              rules: [
                { required: true, message: '请输入用户名!' },
                {validator: this.verticateName}
              ],
            })(
              <Input ref={(input) => { this.inputRef = input }} prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="username" />
            )}
          </Tooltip>
        </FormItem>
        <FormItem>
          {getFieldDecorator('email', {
            rules: [
              {type: 'email',message: '邮箱格式尚未正确!'},
              { required: true, message: '请输入邮箱!' }
            ],
          })(
            <Input ref={(input) => { this.inputRef = input }} prefix={<Icon type="message" style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="email" />
          )}
        </FormItem>
        <FormItem>
          {getFieldDecorator('phone_number', {
            rules: [
              { required: true, message: '请输入手机号!' },
              {validator: this.verticatePhoneNumber}
            ],
          })(
            <Input addonBefore={prefixSelector} style={{ width: '100%' }} ref={(input) => { this.inputRef = input }} prefix={<Icon type="mobile" style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="phone number" />
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
          {getFieldDecorator('password', {
            rules: [
              { required: true, message: '请输入密码!' },
              {
                validator: this.validateToNextPassword,
              }
            ],
          })(
            <Input.Password  prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />} type="password" placeholder="password" />
          )}
        </FormItem>
        <FormItem>
          {getFieldDecorator('repeat_password', {
            rules: [
              {required: true, message: '请重复输入密码!'},
              {
                validator: this.compareToFirstPassword,
              }
            ],
          })(
            <Input.Password  onBlur={this.handleConfirmBlur} prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />} type="password" placeholder="repeat password" />
          )}
        </FormItem>
        <FormItem>
          <Button type="primary" htmlType="submit" className="login-form-button" style={{color:"#ffffff",width:"100%",letterSpacing:"10px"}}>
            注  册
          </Button>
        </FormItem>
      </Form>
    );
  }
}
const RegistForm = Form.create()(NormalLoginForm)
export default RegistForm
