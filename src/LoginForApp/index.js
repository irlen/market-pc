/** @jsx jsx */
import styled from '@emotion/styled'
import { jsx, css } from '@emotion/core'
import React from 'react'
import { message, Row, Col } from 'antd'
import $ from 'jquery'
import { connect } from 'react-redux'
import { Redirect, withRouter } from 'react-router-dom'

import { doLogin } from '../actions'
import Loginform from './loginform'
import RegistForm from './RegistForm'
import LoginLessForm from './LoginLessForm'
import { wyAxiosPost } from '../components/WyAxios'
import Background from '../asets/apploginbg.png'
import leftbg from '../asets/apploginleft.png'
const StyleButton = styled.span({
  color:"#01bd4c",
  "&:hover":{
    fontWeight:"bold",
    opacity: 0.8
  },
  "&:active":{
    opacity: 1
  }
})
const ChangeButton = styled.span({
  padding:"5px",
  fontSize:"18px",
  margin:"0 5px 0 5px",
  cursor:"pointer",
  color:"rgba(255,255,255,0.8)"
})
const curSty = {
  borderBottom: '#01bd4c solid 2px',
  fontWeight:"bold"
}
const sty = {
  borderBottom: 'none',
  fontWeight:"normal"
}
class LoginForApp extends React.Component {
  state={
    verificated: false,
    curAction:'loginless'
  }
  componentDidMount(){
    this._isMounted = true
    //容器高度自适应
    const loginContainer = document.querySelector(".loginContainer")
    const windowH = parseInt(document.body.clientHeight,0);
    loginContainer.style.height = windowH +'px'
    window.onresize = ()=>{
      const rwindowH = parseInt(document.body.clientHeight,0)
      loginContainer.style.height = rwindowH +'px'
    }
  }
  //注册提交事件
  registSubmit = (values)=>{
    wyAxiosPost('User/userRegister',values,(result)=>{
      const responseData = result.data
      if(responseData.status === 1){
        const  token = responseData.msg
        localStorage.user_token = token
        this.props.doLogin({user_token:token})
        this.props.history.push(this.props.lockedUrl)
      }else{
        message.warning(responseData.msg)
      }
    })
  }
  //免密登陆
  phoneLogin = (values)=>{
    wyAxiosPost('User/phoneLogin',values,(result)=>{
      const responseData = result.data
      if(responseData.status === 1){
        const  token = responseData.msg
        localStorage.user_token = token
        this.props.doLogin({user_token:token})
        this.props.history.push(this.props.lockedUrl)
      }else{
        message.warning(responseData.msg)
      }
    })
  }
  //登陆提交事件
  loginSubmit = (values)=>{
    wyAxiosPost('Index/login',values,(result)=>{
      const responseData = result.data.msg.msg
      if(responseData.status === 1){
        const  token = responseData.token
        //写入localStorage
        localStorage.user_token = token
        //写入redux
        this.props.doLogin({user_token:token})
        this.props.history.push(this.props.lockedUrl)
      }else{
        message.warning(responseData.msg)
      }
    })
  }
  actionChange = (value)=>{
    if(this._isMounted){
      this.setState({
        curAction: value
      })
    }
  }
  toHome = ()=>{
    const url = '/app'
    this.props.history.push(url)
  }
  componentWillUnmount(){
    this._isMounted = false
  }
  render(){
      const { curAction } = this.state
      return(
        <div
          style={{
            background: `url(${Background}) no-repeat`,backgroundSize:"cover"
          }}
          className="loginContainer evntContainer" css={{position: "relative"}}
        >

          <div style={{
              width:"429px",height:"200px",
              position:"absolute",left:"25%",marginLeft:"-210px",bottom:"100px",
              background: `url(${leftbg}) no-repeat`,backgroundSize:"cover",
            }}
          >
          </div>
          <div style={{
              width:"auto",height:"200px",
              position:"absolute",left:"25%",marginLeft:"-210px",top:"200px",
              paddingLeft:"50px"
            }}
          >
            <img src={require('../asets/logo.png')} style={{width:"40px",marginTop:"-13px"}} />
            <span style={{fontSize:"30px",lineHeight:"40px",margin:"5px 20px 0 20px",color:"rgba(255,255,255,0.8)"}}>哈尔滨产业地图大数据</span>
          </div>
          <div style={{
              width:"auto",height:"40px",
              position:"absolute",left:"20px",top:"20px",
              cursor:"pointer"
            }}>
              <StyleButton onClick={this.toHome}><i className="fa fa-angle-double-left" aria-hidden="true"></i><span style={{paddingLeft:"10px"}}>回到首页</span></StyleButton>
          </div>
          <div className="loginform" css={{ background:"rgba(255,255,255,0.2)",padding:"10px 20px 20px 20px",borderRadius:"10px",position: "absolute", top:"50%", marginTop:"-240px",right:"100px"}}>
            <div style={{height:"60px"}}>
              <ChangeButton style={curAction === 'loginless'?curSty:sty} onClick={()=>{this.actionChange('loginless')}} >免密登陆</ChangeButton>
              <ChangeButton style={curAction === 'login'?curSty:sty} onClick={()=>{this.actionChange('login')}} >账号密码登陆</ChangeButton>
              <ChangeButton style={curAction === 'register'?curSty:sty} onClick={()=>{this.actionChange('register')}} >注册</ChangeButton>
            </div>
            {
              curAction && curAction === 'register'?
              <RegistForm registSubmit={(values)=>this.registSubmit(values)}/>
              :
              ''
            }
            {
              curAction && curAction === 'login'?
              <Loginform className="formponent" loginSubmit={this.loginSubmit.bind(this)}/>
              :
              ''
            }
            {
              curAction && curAction === 'loginless'?
              <LoginLessForm phoneLogin={(values)=>{this.phoneLogin(values)}} />
              :
              ''
            }

          </div>

        </div>
      )
  }
}
const mapStateToProps = (state)=>({
  lockedUrl: state.lockedPage.lockedUrl
})
const mapDispatchToProps = (dispatch)=>({
  doLogin: (value)=>{dispatch(doLogin(value))}
})
export default connect(mapStateToProps,mapDispatchToProps)(withRouter(LoginForApp))
