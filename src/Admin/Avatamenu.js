import { Avatar, Menu, Dropdown, Icon, message, Modal, Input } from 'antd'
import React, { Component } from 'react'
import { Link,withRouter } from 'react-router-dom'
import $ from 'jquery'
import { connect } from 'react-redux'

import { wyAxiosPost } from '../components/WyAxios'
import * as screenShot from '../components/ScreenShot/index'
import { doLogout } from '../actions'
import { base64Decode } from '../components/Base64'
class Avatarmenu extends Component{
  constructor(props){
    super(props)
  }
  state={
    passVisible:false,
    id:'',
    newpass:'',
    newpass_repeat:''
  }
  componentWillMount = ()=>{
    // dom全屏
    let id = ''
    if(localStorage.user_token){
      const user_token = localStorage.user_token
      const userArr = user_token.split('.')
      const userInfo = JSON.parse(base64Decode(userArr[1]))
      id = userInfo.id
      this.setState({
        id
      })
    }
  }
  componentDidMount(){
    this._isMounted = true
  }
  clearCache = ()=>{
    wyAxiosPost('User/clearCache',{},(result)=>{
      const responseData = result.data
      if(responseData.status === 1){
        message.success(responseData.msg)
      }
    })
  }


  doLogout = ()=>{
    localStorage.removeItem('user_token')
    this.props.doLogout({user_token:''})
    this.props.history.push('/')
  }
  resetPass = ()=>{
    if(this._isMounted){
      this.setState({
        passVisible: true,
        newpass:"",
        newpass_repeat:""
      })
    }
  }
  savePass = ()=>{
    const { newpass, newpass_repeat,id} = this.state
    const erroList = []
    if(newpass === '' || newpass_repeat === ''){
      erroList.push('密码不能为空')
    }
    if(newpass !== newpass_repeat){
      erroList.push('两次输入不相等')
    }
    if(erroList.length === 0){
      let info = {
        newpass,
        id
      }
      wyAxiosPost('User/resetPassword',{info},(result)=>{
        const responseData = result.data.msg
        console.log(responseData)
        if(responseData.status === 1){
          this.passHandleCancel()
          message.success(`${responseData.msg},${'您需要重新登录系统'}`)
          setTimeout(()=>{
            this.doLogout()
          },1000)
        }else{
          message.warning(responseData.msg)
        }
      })
    }else{
      let str = ''
      erroList.map((item,index)=>{
        str += index+1+'.'+item+'  '
      })
      message.warning(str)
    }
  }
  passHandleCancel = e => {
    if(this._isMounted){
      this.setState({
        passVisible: false,
        newpass:"",
        id:""
      })
    }
  }
  inputChange = (value,field)=>{
    if(this._isMounted){
      this.setState({
        [field]: value
      })
    }
  }

  compoenntWillUnmount(){
    this._isMounted = false
  }
  render(){
    const menu = (
      <Menu>
        {
          // <Menu.Item>
          //   <span onClick={this.resetPass}>重置密码</span>
          // </Menu.Item>
          // <Menu.Item onClick={this.doLogout}>
          //   <span>退出</span>
          // </Menu.Item>
        }
      </Menu>
    )
    return(
      <div style={{float:"right",margin: "0 20px 0 0"}}>
        <Avatar icon="user" style={{background: "#87d068"}}/>
        <Dropdown overlay={menu} trigger={['click']}>
          <a className="ant-dropdown-link" href="#" style={{fontSize: "12px"}}>
            {this.props.userName}
            <Icon type="down" />
          </a>
        </Dropdown>
        <a className="down" href="imageData" download="内容快照"><span className="downin"></span></a>
        <Modal
            title="重置密码"
            visible={this.state.passVisible}
            onOk={this.savePass}
            onCancel={this.passHandleCancel}
          >
            <div style={{display:"flex",margin:"10px 0 10px 0"}}>
              <div style={{flex:"0 0 80px"}}>新密码</div>
              <div style={{flex:"1 1 auto"}}>
                <Input.Password
                  onChange={(e)=>{this.inputChange(e.target.value,'newpass')}}
                  value={this.state.newpass}
                />
              </div>
            </div>
            <div style={{display:"flex",margin:"10px 0 10px 0"}}>
              <div style={{flex:"0 0 80px"}}>重复密码</div>
              <div style={{flex:"1 1 auto"}}>
                <Input.Password
                  onChange={(e)=>{this.inputChange(e.target.value,'newpass_repeat')}}
                  value={this.state.newpass_repeat}
                />
              </div>
            </div>
        </Modal>
      </div>
    )
  }
}

const mapDispatchToProps = (dispatch)=>({
  doLogout: (value)=>{dispatch(doLogout(value))}
})
export default connect(null,mapDispatchToProps)(withRouter(Avatarmenu))
