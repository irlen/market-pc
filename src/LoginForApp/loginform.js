import React from 'react'
import { Form, Icon, Input, Button, Checkbox ,message} from 'antd'
import $ from 'jquery'

import { wyAxiosPost } from '../components/WyAxios'
const FormItem = Form.Item

class NormalLoginForm extends React.Component {
  //表单提交事件
  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        this.props.loginSubmit(values)
      }else{
        message.error(err)
      }
    });
  }
  componentDidMount(){
    this.inputRef.input.autofocus = true
  }
  render() {
    const { getFieldDecorator } = this.props.form;
    return (
      <Form onSubmit={this.handleSubmit} className="login-form" style={{width:"400px"}}>
        <FormItem>
          {getFieldDecorator('username', {
            rules: [{ required: true, message: '请输入账户!' }],
          })(
            <Input ref={(input) => { this.inputRef = input }} prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="用户名,手机号 or 邮箱" />
          )}
        </FormItem>

        <FormItem>
          {getFieldDecorator('password', {
            rules: [{ required: true, message: '请输入密码!' }],
          })(
            <Input prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />} type="password" placeholder="密码" />
          )}
        </FormItem>

        <FormItem>
          <Button type="primary" htmlType="submit" className="login-form-button" style={{color:"#ffffff",width:"100%",letterSpacing:"10px"}}>
            登  录
          </Button>
        </FormItem>
      </Form>
    );
  }
}
const Loginform = Form.create()(NormalLoginForm)
export default Loginform
